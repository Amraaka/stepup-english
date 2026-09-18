import ranks from "@/content/dictionary/frequency.json";
import type { CefrLevel } from "@/lib/levels";
import type { GlossEntry } from "@/lib/dictionary/types";
import { lookupWord, wordKey } from "@/lib/dictionary/glossary";

// "How much will I understand?": the share of running words a learner probably knows (ADR 0022).
// Server side only, like `glossary.ts`. Understanding jumps once 95–98% of the words are known (Hu & Nation 2000).

const RANK = ranks as Record<string, number>;

/**
 * Frequency rank (scripts/dictionary/build_frequency.py) up to which a learner at each level is assumed to know
 * a word. Ranks count word forms, so they run higher than lemma counts. Calibrated so the 50 graded reading texts
 * sit around 95–97% at their own level (ADR 0022); an estimate, not a test.
 */
export const KNOWN_UP_TO: Record<CefrLevel, number> = {
  A1: 1_500,
  A2: 3_000,
  B1: 5_000,
  B2: 8_000,
  C1: 12_000,
};

/** A saved word in this box or higher counts as known; below it, the learner is still learning it. ADR 0010. */
const KNOWN_BOX = 3;

export type Learner = {
  level: CefrLevel;
  /** Saved lemma → Leitner box. */
  saved: Record<string, number>;
};

export type Fit = "fit" | "stretch" | "hard";

/** A word the learner probably doesn't know; `sentence` and `token` point at its first use. */
export type NewWord = { lemma: string; entry: GlossEntry; count: number; sentence: number; token: number };

export type Coverage = {
  /** Known running words, 0–100, rounded down so 94.9 never reads as 95. */
  percent: number;
  fit: Fit;
  /** Distinct words the learner probably doesn't know, most useful first. */
  newWords: NewWord[];
};

export function fitFor(percent: number): Fit {
  if (percent >= 95) return "fit";
  if (percent >= 90) return "stretch";
  return "hard";
}

function knows(lemma: string, entry: GlossEntry | null, learner: Learner): boolean {
  // Names and numbers count as known, as in the coverage studies.
  if (entry?.pos === "name" || entry?.pos === "num") return true;
  const box = learner.saved[lemma];
  if (box !== undefined) return box >= KNOWN_BOX;
  const rank = RANK[lemma];
  return rank !== undefined && rank <= KNOWN_UP_TO[learner.level];
}

/** Coverage of these sentences (token lists as published) for one learner. */
export function coverage(sentences: string[][], learner: Learner): Coverage {
  let total = 0;
  let known = 0;
  const unknown = new Map<string, NewWord>();

  sentences.forEach((tokens, sentence) => {
    tokens.forEach((raw, token) => {
      const key = wordKey(raw);
      if (!/[a-z]/.test(key)) return; // punctuation and bare numbers
      total++;
      const entry = lookupWord(key);
      const lemma = entry?.lemma ?? key;
      if (knows(lemma, entry, learner)) {
        known++;
        return;
      }
      const seen = unknown.get(lemma);
      if (seen) seen.count++;
      else if (entry) unknown.set(lemma, { lemma, entry, count: 1, sentence, token });
    });
  });

  const percent = total ? Math.floor((known / total) * 100) : 100;
  // Words heard more than once first, then the ones most common in English (the most useful to learn).
  const newWords = [...unknown.values()].sort(
    (a, b) => b.count - a.count || (RANK[a.lemma] ?? Infinity) - (RANK[b.lemma] ?? Infinity),
  );
  return { percent, fit: fitFor(percent), newWords };
}
