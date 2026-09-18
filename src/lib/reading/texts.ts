import type { ReadingText } from "@/lib/reading/types";
import type { ClipQuestion } from "@/lib/listening/types";
import { seeded, shuffle } from "@/lib/random";
import catalog from "@/content/reading/catalog.json";

// The catalog is built from scripts/reading/sources/ by scripts/reading/build_text.py (ADR 0017, 0021):
// one <slug>.txt (the text as published) and one <slug>.meta.json (title, level, topic, source, questions)
// per text. The build checks the metadata; every word needs a dictionary entry (scripts/reading/coverage.ts).
// Texts are public domain or CC BY, and allow commercial use and adaptation.

/** Texts from the easiest level up, by title within a level. */
export const TEXTS = catalog as ReadingText[];

export function getText(slug: string): ReadingText | null {
  return TEXTS.find((t) => t.slug === slug) ?? null;
}

/** Words in the text; a lone dash or ellipsis between words doesn't count. */
export function wordCount(text: ReadingText): number {
  return text.paragraphs.flat().reduce((n, sentence) => n + sentence.filter((t) => /[A-Za-z0-9]/.test(t)).length, 0);
}

/** The text's questions with options shuffled; the same seed gives the same order all day. */
export function shuffledQuestions(text: ReadingText, seed: string): ClipQuestion[] {
  const rand = seeded(seed);
  return text.questions.map((q) => {
    const order = shuffle(q.options.map((_, k) => k), rand);
    return { ...q, options: order.map((k) => q.options[k]), answer: order.indexOf(q.answer) };
  });
}

/** Estimated reading time at about 120 words a minute. */
export function readingMinutes(text: ReadingText): number {
  return Math.max(1, Math.round(wordCount(text) / 120));
}

/** Most seconds one tracker flush may claim for a text: three slow readings, at least 10 minutes. */
export function readingCapSec(text: ReadingText): number {
  return Math.max(600, readingMinutes(text) * 60 * 3);
}
