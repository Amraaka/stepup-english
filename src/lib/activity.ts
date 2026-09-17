import "server-only";
import { cache } from "react";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { activityEvents, profiles, type ActivityModule } from "@/db/schema";
import { buildStats, localDay, manualLogPoints, pointsForStudyLog, type DayAgg, type TrackerStats } from "@/lib/tracker";

export const getProfile = cache(async (userId: string) => {
  const rows = await db.select().from(profiles).where(eq(profiles.id, userId));
  return rows[0] ?? null;
});

/** Daily limits per learner, over the last 24 hours, so scripted calls can't farm the tracker. */
export const DAILY_STUDY_MIN = 240;
export const DAILY_TIMED_SEC = 6 * 60 * 60;
export const DAILY_POINTS = 500;

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Serialises one learner's logs, so two concurrent flushes can't both read the old totals. */
async function lockUser(tx: Tx, userId: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${userId}))`);
}

/** What the learner logged in the last 24 hours. */
async function lastDayTotals(tx: Tx, userId: string) {
  const [row] = await tx
    .select({
      studySec: sql<number>`coalesce(sum(${activityEvents.durationSec}) filter (where ${activityEvents.kind} = 'study'), 0)::int`,
      timedSec: sql<number>`coalesce(sum(${activityEvents.durationSec}) filter (where ${activityEvents.kind} = 'timed'), 0)::int`,
      points: sql<number>`coalesce(sum(${activityEvents.points}), 0)::int`,
    })
    .from(activityEvents)
    .where(and(eq(activityEvents.userId, userId), sql`${activityEvents.occurredAt} >= now() - interval '24 hours'`));
  return row;
}

/** Logs a typed study session. Returns false when the daily limit is already used up. */
export async function logStudySession(opts: {
  userId: string;
  module: ActivityModule;
  durationMin: number;
  timeZone: string;
}): Promise<boolean> {
  return db.transaction(async (tx) => {
    await lockUser(tx, opts.userId);
    const day = await lastDayTotals(tx, opts.userId);
    const roomMin = Math.max(0, DAILY_STUDY_MIN - Math.floor(day.studySec / 60));
    const durationMin = Math.max(0, Math.min(240, roomMin, Math.floor(opts.durationMin)));
    if (durationMin === 0) return false;
    // Manual logs earn on the local day's running total (ADR 0019).
    const startOfDay = sql`(date_trunc('day', now() at time zone ${opts.timeZone}) at time zone ${opts.timeZone})`;
    const [today] = await tx
      .select({
        sec: sql<number>`coalesce(sum(${activityEvents.durationSec}), 0)::int`,
        pts: sql<number>`coalesce(sum(${activityEvents.points}), 0)::int`,
      })
      .from(activityEvents)
      .where(
        and(
          eq(activityEvents.userId, opts.userId),
          eq(activityEvents.kind, "study"),
          gte(activityEvents.occurredAt, startOfDay),
        ),
      );
    const earned = manualLogPoints({ minutes: Math.floor(today.sec / 60), points: today.pts }, durationMin);
    await tx.insert(activityEvents).values({
      userId: opts.userId,
      module: opts.module,
      kind: "study",
      durationSec: durationMin * 60,
      points: Math.max(0, Math.min(earned, DAILY_POINTS - day.points)),
    });
    return true;
  });
}

/** Minutes of a timed session already logged for the same item recently. */
const TIMED_WINDOW_MS = 3 * 60 * 60 * 1000;

/** Leeway on "no more seconds than have passed since the last flush" for network and timer lag. */
const ELAPSED_SLACK_SEC = 30;

/**
 * Logs time measured by a module (e.g. a listening clip), not typed by the learner.
 * Points follow the study-log rule on the *cumulative* time for the same item in
 * the last 3 hours, so flushing in small pieces never earns more than one long session.
 * A flush can't claim more time than has passed since the last one for the same item, and
 * the daily limits apply. Returns false when nothing was left to log.
 */
export async function logTimedSession(opts: {
  userId: string;
  module: ActivityModule;
  seconds: number;
  ref: string;
}): Promise<boolean> {
  return db.transaction(async (tx) => {
    await lockUser(tx, opts.userId);
    const [prev] = await tx
      .select({
        sec: sql<number>`coalesce(sum(${activityEvents.durationSec}), 0)::int`,
        pts: sql<number>`coalesce(sum(${activityEvents.points}), 0)::int`,
        sinceLast: sql<number | null>`extract(epoch from now() - max(${activityEvents.occurredAt}))::int`,
      })
      .from(activityEvents)
      .where(
        and(
          eq(activityEvents.userId, opts.userId),
          eq(activityEvents.module, opts.module),
          eq(activityEvents.kind, "timed"),
          gte(activityEvents.occurredAt, new Date(Date.now() - TIMED_WINDOW_MS)),
          sql`${activityEvents.meta}->>'ref' = ${opts.ref}`,
        ),
      );
    const day = await lastDayTotals(tx, opts.userId);

    let seconds = Math.max(0, Math.min(14400, Math.floor(opts.seconds)));
    if (prev.sinceLast !== null) seconds = Math.min(seconds, prev.sinceLast + ELAPSED_SLACK_SEC);
    seconds = Math.min(seconds, Math.max(0, DAILY_TIMED_SEC - day.timedSec));
    if (seconds <= 0) return false;

    const earned = Math.max(0, pointsForStudyLog(Math.floor((prev.sec + seconds) / 60)) - prev.pts);
    await tx.insert(activityEvents).values({
      userId: opts.userId,
      module: opts.module,
      kind: "timed",
      durationSec: seconds,
      points: Math.max(0, Math.min(earned, DAILY_POINTS - day.points)),
      meta: { ref: opts.ref },
    });
    return true;
  });
}

/** Seconds of measured time per ref (e.g. per clip) for one module. */
export async function timedSecondsByRef(userId: string, module: ActivityModule): Promise<Record<string, number>> {
  const ref = sql<string>`${activityEvents.meta}->>'ref'`;
  const rows = await db
    .select({ ref, sec: sql<number>`coalesce(sum(${activityEvents.durationSec}), 0)::int` })
    .from(activityEvents)
    .where(and(eq(activityEvents.userId, userId), eq(activityEvents.module, module), eq(activityEvents.kind, "timed")))
    .groupBy(ref);
  return Object.fromEntries(rows.filter((r) => r.ref).map((r) => [r.ref, r.sec]));
}

export const getDashboardStats = cache(async (userId: string, timeZone: string): Promise<TrackerStats> => {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 400);

  const events = await db
    .select({
      occurredAt: activityEvents.occurredAt,
      module: activityEvents.module,
      points: activityEvents.points,
      durationSec: activityEvents.durationSec,
      kind: activityEvents.kind,
    })
    .from(activityEvents)
    .where(and(eq(activityEvents.userId, userId), gte(activityEvents.occurredAt, since)))
    .orderBy(desc(activityEvents.occurredAt));

  const [totals] = await db
    .select({
      points: sql<number>`coalesce(sum(${activityEvents.points}), 0)::int`,
      durationSec: sql<number>`coalesce(sum(${activityEvents.durationSec}), 0)::int`,
    })
    .from(activityEvents)
    .where(eq(activityEvents.userId, userId));

  const today = localDay(new Date(), timeZone);
  const byDay = new Map<string, DayAgg>();
  const moduleSec: Record<string, number> = {};
  const manualToday = { minutes: 0, points: 0 };
  let manualSec = 0;
  for (const e of events) {
    const day = localDay(e.occurredAt, timeZone);
    if (day === today && e.kind === "study") {
      manualSec += e.durationSec;
      manualToday.points += e.points;
    }
    const cur = byDay.get(day) ?? { points: 0, durationSec: 0 };
    cur.points += e.points;
    cur.durationSec += e.durationSec;
    byDay.set(day, cur);
    moduleSec[e.module] = (moduleSec[e.module] ?? 0) + e.durationSec;
  }
  const moduleMinutes = Object.fromEntries(
    Object.entries(moduleSec).map(([m, sec]) => [m, Math.floor(sec / 60)]),
  );

  manualToday.minutes = Math.floor(manualSec / 60);

  return buildStats(byDay, today, totals, moduleMinutes, manualToday);
});
