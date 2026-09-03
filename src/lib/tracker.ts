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

export type DayAgg = { points: number; durationSec: number };
export type WeekDay = { day: string; points: number; durationSec: number };

export type TrackerStats = {
  streak: number;
  totalPoints: number;
  totalMinutes: number;
  todayPoints: number;
  todayMinutes: number;
  week: WeekDay[];
};

export function buildStats(byDay: Map<string, DayAgg>, today: string, totals: DayAgg): TrackerStats {
  const week: WeekDay[] = [];
  let d = today;
  for (let i = 0; i < 7; i++) {
    const v = byDay.get(d) ?? { points: 0, durationSec: 0 };
    week.unshift({ day: d, ...v });
    d = prevDay(d);
  }
  return {
    streak: computeStreak(new Set(byDay.keys()), today),
    totalPoints: totals.points,
    totalMinutes: Math.floor(totals.durationSec / 60),
    todayPoints: byDay.get(today)?.points ?? 0,
    todayMinutes: Math.floor((byDay.get(today)?.durationSec ?? 0) / 60),
    week,
  };
}
