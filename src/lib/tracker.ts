// Pure tracker rules shared by server (DB) and guest (in-browser) modes.
// Points/streak rules: docs/decisions/0005-activity-log-points-streaks.md

export function pointsForStudyLog(durationMin: number): number {
  return Math.min(10 + 5 * Math.floor(durationMin / 5), 60);
}

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
};

const HISTORY_DAYS = 35;

export function buildStats(
  byDay: Map<string, DayAgg>,
  today: string,
  totals: DayAgg,
  moduleMinutes: Record<string, number> = {},
): TrackerStats {
  const days: WeekDay[] = [];
  let d = today;
  for (let i = 0; i < HISTORY_DAYS; i++) {
    const v = byDay.get(d) ?? { points: 0, durationSec: 0 };
    days.unshift({ day: d, ...v });
    d = prevDay(d);
  }
  const active = new Set(byDay.keys());
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
  };
}
