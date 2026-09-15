// Leitner review rules shared by server and client. Decision: docs/decisions/0010-saved-words-review.md

export const DAILY_REVIEW_CAP = 20;

/** Days until the next review for boxes 0–6 (box 0 = due again now). */
export const BOX_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;
export const MAX_BOX = BOX_DAYS.length - 1;

export function nextReview(box: number, remembered: boolean, now = new Date()): { box: number; dueAt: Date } {
  const next = remembered ? Math.min(box + 1, MAX_BOX) : 0;
  return { box: next, dueAt: new Date(now.getTime() + BOX_DAYS[next] * 86_400_000) };
}

export function boxLabel(box: number): string {
  if (box === 0) return "Шинэ";
  if (box <= 2) return "Давтаж байна";
  if (box < MAX_BOX) return "Бараг цээжилсэн";
  return "Цээжилсэн";
}

/** A saved word as the client sees it. */
export type Card = {
  id: number;
  lemma: string;
  surface: string;
  sentence: string;
  clip: string | null;
  /** The sentence in the hosted clip, when the source is still in the catalog. */
  audio: { src: string; start: number; end: number } | null;
};
