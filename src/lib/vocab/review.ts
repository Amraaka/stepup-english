// Leitner review rules shared by server and client. Decision: docs/decisions/0010-saved-words-review.md

import type { GlossEntry } from "@/lib/dictionary/types";

export const DAILY_REVIEW_CAP = 20;

/** Days until the next review for boxes 0–6 (box 0 = due again now). */
export const BOX_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;
export const MAX_BOX = BOX_DAYS.length - 1;

/**
 * With `timeZone`, a word is due from the start of the learner's local day N days ahead, so a word
 * reviewed at 21:00 is in the next morning's session. Without it, exactly N×24h from now.
 */
export function nextReview(
  box: number,
  remembered: boolean,
  now = new Date(),
  timeZone?: string,
): { box: number; dueAt: Date } {
  const next = remembered ? Math.min(box + 1, MAX_BOX) : 0;
  const days = BOX_DAYS[next];
  if (!timeZone || days === 0) return { box: next, dueAt: new Date(now.getTime() + days * 86_400_000) };
  const day = new Date(`${new Intl.DateTimeFormat("en-CA", { timeZone }).format(now)}T00:00:00Z`);
  day.setUTCDate(day.getUTCDate() + days);
  return { box: next, dueAt: startOfLocalDay(day.getTime(), timeZone) };
}

/** The instant `wall` (a UTC-encoded local midnight) happens in `timeZone`. */
function startOfLocalDay(wall: number, timeZone: string): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const offset = (t: number) => {
    const p = Object.fromEntries(parts.formatToParts(t).map((x) => [x.type, Number(x.value)]));
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - t;
  };
  // Twice, in case the offset differs across a DST change.
  return new Date(wall - offset(wall - offset(wall)));
}

export function boxLabel(box: number): string {
  if (box === 0) return "Шинэ";
  if (box <= 2) return "Давтаж байна";
  if (box < MAX_BOX) return "Бараг цээжилсэн";
  return "Цээжилсэн";
}

/**
 * How a card is asked (ADR 0018): a new or forgotten word is a flip card, a word remembered once is
 * heard and matched to its meaning, and after that the learner types it from the meaning.
 */
export type CardMode = "flip" | "listen" | "type";

export function modeForBox(box: number): CardMode {
  return box <= 0 ? "flip" : box === 1 ? "listen" : "type";
}

/** The first sense of a Mongolian meaning ("алба хаах, ажиллах; үйлчлэх" → "алба хаах, ажиллах"). */
export function shortMeaning(mn: string): string {
  return mn.split(";")[0].trim();
}

/** A saved word as the client sees it. */
export type Card = {
  id: number;
  lemma: string;
  surface: string;
  sentence: string;
  /** Where it was saved (a clip or a text), when that content is still in the catalog. */
  from: { title: string; href: string } | null;
  /** The sentence in the hosted clip, when the source is still in the catalog. */
  audio: { src: string; start: number; end: number } | null;
  box: number;
  mode: CardMode;
  /** The dictionary entry, resolved on the server so the client never loads the whole dictionary (ADR 0016). */
  entry: GlossEntry | null;
  /** Listen cards: four short Mongolian meanings in shown order, one of them this word's. */
  choices?: string[];
  /** Type cards: dictionary words one letter from the answer, which get no "almost" credit. */
  confusable?: string[];
};
