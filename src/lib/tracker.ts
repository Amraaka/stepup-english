// Pure tracker rules shared by server (DB) and guest (in-browser) modes.
// Points/streak rules: docs/decisions/0005-activity-log-points-streaks.md

/** Shortest time a module may log on its own (e.g. listening), in seconds. */
export const MIN_TIMED_SEC = 60;

/** What a measured session belongs to: a clip (listening or shadowing it), or the daily word review. */
export type TimedTarget =
  | { module: "listening"; ref: string }
  | { module: "speaking"; ref: string }
  | { module: "grammar"; ref: string }
  | { module: "reading"; ref: string }
  | { module: "vocabulary"; ref: "review" };

export function pointsForStudyLog(durationMin: number): number {
  return Math.min(10 + 5 * Math.floor(durationMin / 5), 60);
}

/**
 * Points for a manual (typed) log: the study-log rule on the day's *total* manual minutes, minus what
 * that day's earlier manual logs already earned. Splitting a session into pieces never earns more,
 * and manual logs can't earn more than one session's cap (60) a day (ADR 0019).
 */
export function manualLogPoints(today: ManualToday, addMin: number): number {
  return Math.max(0, pointsForStudyLog(today.minutes + addMin) - today.points);
}

/** Manual (typed) logs so far today. */
export type ManualToday = { minutes: number; points: number };

/** Local calendar day ("YYYY-MM-DD") of an instant in the given tz. */
export function localDay(d: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(d);
}

export function prevDay(day: string): string {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Consecutive active days ending today (or yesterday, if today is inactive). */
export function computeStreak(activeDays: Set<string>, today: string): number {
  let day = activeDays.has(today) ? today : prevDay(today);
  let streak = 0;
  while (activeDays.has(day)) {
    streak += 1;
    day = prevDay(day);
  }
  return streak;
}

/** Longest run of consecutive active days in the set. */
export function computeLongestStreak(activeDays: Set<string>): number {
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of [...activeDays].sort()) {
    run = prev !== null && prevDay(day) === prev ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

export type DayAgg = { points: number; durationSec: number };

/** One rule for streaks, check-in and active-day quests: any time or points logged that day. */
export function isActiveDay(d: DayAgg | undefined): boolean {
  return !!d && (d.durationSec > 0 || d.points > 0);
}
export type WeekDay = { day: string; points: number; durationSec: number };

export type TrackerStats = {
  streak: number;
  longestStreak: number;
  totalPoints: number;
  totalMinutes: number;
  todayPoints: number;
  todayMinutes: number;
  /** Last 7 days, oldest first; the last entry is today. */
  week: WeekDay[];
  /** Last 35 days (5 weeks), oldest first. */
  days: WeekDay[];
  /** Logged minutes per activity module. */
  moduleMinutes: Record<string, number>;
  /** Today's manual logs, for the next manual log's points. */
  manualToday: ManualToday;
};

const HISTORY_DAYS = 35;

export function buildStats(
  byDay: Map<string, DayAgg>,
  today: string,
  totals: DayAgg,
  moduleMinutes: Record<string, number> = {},
  manualToday: ManualToday = { minutes: 0, points: 0 },
): TrackerStats {
  const days: WeekDay[] = [];
  let d = today;
  for (let i = 0; i < HISTORY_DAYS; i++) {
    const v = byDay.get(d) ?? { points: 0, durationSec: 0 };
    days.unshift({ day: d, ...v });
    d = prevDay(d);
  }
  const active = new Set([...byDay].filter(([, v]) => isActiveDay(v)).map(([day]) => day));
  return {
    streak: computeStreak(active, today),
    longestStreak: computeLongestStreak(active),
    totalPoints: totals.points,
    totalMinutes: Math.floor(totals.durationSec / 60),
    todayPoints: byDay.get(today)?.points ?? 0,
    todayMinutes: Math.floor((byDay.get(today)?.durationSec ?? 0) / 60),
    week: days.slice(-7),
    days,
    moduleMinutes,
    manualToday,
  };
}
