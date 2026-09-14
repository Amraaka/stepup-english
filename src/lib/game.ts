// Game layer derived from tracker stats — nothing here is stored.
// Rules: docs/decisions/0007-gamified-app-shell.md

import type { ActivityModule } from "@/db/schema";
import type { TrackerStats } from "@/lib/tracker";
import type { Tone } from "@/lib/tones";

export const DAILY_GOAL_MIN = 20;

const WEEKDAYS = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];

export function weekdayLabel(day: string): string {
  return WEEKDAYS[new Date(`${day}T12:00:00Z`).getUTCDay()];
}

/** Modules a learner can log study time against today. */
export const LOG_MODULES: [ActivityModule, string][] = [
  ["general", "Ерөнхий"],
  ["listening", "Сонсгол"],
  ["reading", "Унших"],
  ["writing", "Бичих"],
  ["speaking", "Ярих"],
  ["vocabulary", "Үгийн сан"],
  ["grammar", "Дүрэм"],
];

/** Points needed to reach a level: 50·L·(L−1) → 0, 100, 300, 600, 1000, … */
export function levelThreshold(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFor(points: number) {
  let level = 1;
  while (points >= levelThreshold(level + 1)) level += 1;
  const floor = levelThreshold(level);
  const next = levelThreshold(level + 1);
  return { level, floor, next, progress: (points - floor) / (next - floor) };
}

export function weekMinutes(s: TrackerStats): number {
  return Math.floor(s.week.reduce((sum, d) => sum + d.durationSec, 0) / 60);
}

export function weekPoints(s: TrackerStats): number {
  return s.week.reduce((sum, d) => sum + d.points, 0);
}

export function activeDaysInWeek(s: TrackerStats): number {
  return s.week.filter((d) => d.points > 0).length;
}

export type QuestIconName = "clock" | "check" | "bolt" | "flame";

export type Quest = {
  id: string;
  title: string;
  value: number;
  target: number;
  unit: string;
  tone: Tone;
  icon: QuestIconName;
};

export function dailyQuests(s: TrackerStats): Quest[] {
  return [
    { id: "minutes", title: `${DAILY_GOAL_MIN} минут суралц`, value: s.todayMinutes, target: DAILY_GOAL_MIN, unit: "мин", tone: "coral", icon: "clock" },
    { id: "checkin", title: "Өнөөдөр цагаа бүртгэ", value: s.todayPoints > 0 ? 1 : 0, target: 1, unit: "", tone: "mint", icon: "check" },
    { id: "points", title: "50 оноо цуглуул", value: s.todayPoints, target: 50, unit: "оноо", tone: "sun", icon: "bolt" },
  ];
}

export function weeklyQuests(s: TrackerStats): Quest[] {
  return [
    { id: "week-minutes", title: "7 хоногт 100 минут", value: weekMinutes(s), target: 100, unit: "мин", tone: "sky", icon: "clock" },
    { id: "week-days", title: "5 өдөр идэвхтэй бай", value: activeDaysInWeek(s), target: 5, unit: "өдөр", tone: "violet", icon: "flame" },
  ];
}

export type Achievement = {
  id: string;
  title: string;
  hint: string;
  earned: boolean;
  tone: Tone;
  icon: "arrow" | "flame" | "clock" | "bolt" | "medal";
};

export function achievements(s: TrackerStats): Achievement[] {
  return [
    { id: "first", title: "Эхний алхам", hint: "Анхны бүртгэл", earned: s.totalPoints > 0, tone: "coral", icon: "arrow" },
    { id: "streak3", title: "3 хоног", hint: "3 хоног дараалан", earned: s.longestStreak >= 3, tone: "sun", icon: "flame" },
    { id: "streak7", title: "7 хоног", hint: "7 хоног дараалан", earned: s.longestStreak >= 7, tone: "coral", icon: "flame" },
    { id: "min100", title: "100 минут", hint: "Нийт 100 минут", earned: s.totalMinutes >= 100, tone: "sky", icon: "clock" },
    { id: "pts1000", title: "1 000 оноо", hint: "Нийт 1 000 оноо", earned: s.totalPoints >= 1000, tone: "violet", icon: "bolt" },
    { id: "streak30", title: "30 хоног", hint: "30 хоног дараалан", earned: s.longestStreak >= 30, tone: "mint", icon: "medal" },
  ];
}

/** 1240 → "1 240" */
export function fmtNum(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** 95 → "1ц 35м", 40 → "40 мин" */
export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} мин`;
  return m === 0 ? `${h} цаг` : `${h}ц ${m}м`;
}
