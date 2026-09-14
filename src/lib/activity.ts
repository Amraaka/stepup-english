import "server-only";
import { cache } from "react";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { activityEvents, profiles, type ActivityModule } from "@/db/schema";
import { buildStats, localDay, pointsForStudyLog, type DayAgg, type TrackerStats } from "@/lib/tracker";

export const getProfile = cache(async (userId: string) => {
  const rows = await db.select().from(profiles).where(eq(profiles.id, userId));
  return rows[0] ?? null;
});

export async function logStudySession(opts: {
  userId: string;
  module: ActivityModule;
  durationMin: number;
}) {
  const durationMin = Math.max(0, Math.min(240, Math.floor(opts.durationMin)));
  await db.insert(activityEvents).values({
    userId: opts.userId,
    module: opts.module,
    kind: "study",
    durationSec: durationMin * 60,
    points: pointsForStudyLog(durationMin),
  });
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
  for (const e of events) {
    const day = localDay(e.occurredAt, timeZone);
    const cur = byDay.get(day) ?? { points: 0, durationSec: 0 };
    cur.points += e.points;
    cur.durationSec += e.durationSec;
    byDay.set(day, cur);
    moduleSec[e.module] = (moduleSec[e.module] ?? 0) + e.durationSec;
  }
  const moduleMinutes = Object.fromEntries(
    Object.entries(moduleSec).map(([m, sec]) => [m, Math.floor(sec / 60)]),
  );

  return buildStats(byDay, today, totals, moduleMinutes);
});
