import type { BankItem, Exercise, GrammarLevel, Lesson, PathEntry, PracticeItem } from "@/lib/grammar/types";
import { pickCheckpoint } from "@/lib/grammar/checkpoint";
import { seeded, shuffle } from "@/lib/random";
import { CEFR_LEVELS } from "@/lib/levels";
import bankData from "@/content/grammar/bank.json";
import { presentSimple } from "@/content/grammar/present-simple";
import { presentContinuous } from "@/content/grammar/present-continuous";
import { pastSimple } from "@/content/grammar/past-simple";
import { pastContinuous } from "@/content/grammar/past-continuous";
import { willGoingTo } from "@/content/grammar/will-going-to";
import { presentPerfect } from "@/content/grammar/present-perfect";
import { pastSimpleVsPresentPerfect } from "@/content/grammar/past-simple-vs-present-perfect";
import { presentPerfectContinuous } from "@/content/grammar/present-perfect-continuous";
import { pastPerfect } from "@/content/grammar/past-perfect";
import { usedTo } from "@/content/grammar/used-to";
import { futureContinuous } from "@/content/grammar/future-continuous";
import { futurePerfect } from "@/content/grammar/future-perfect";
import { pastPerfectContinuous } from "@/content/grammar/past-perfect-continuous";
import { futurePerfectContinuous } from "@/content/grammar/future-perfect-continuous";
import { futureInThePast } from "@/content/grammar/future-in-the-past";

/** Every lesson in teaching order; the path is derived from this list. */
export const LESSONS: Lesson[] = [
  presentSimple,
  presentContinuous,
  pastSimple,
  pastContinuous,
  willGoingTo,
  presentPerfect,
  pastSimpleVsPresentPerfect,
  presentPerfectContinuous,
  pastPerfect,
  usedTo,
  futureContinuous,
  futurePerfect,
  pastPerfectContinuous,
  futurePerfectContinuous,
  futureInThePast,
];

/** Reviewed Tatoeba gap-fills (ADR 0014). */
const BANK = bankData as BankItem[];

/** The full tense path in teaching order. */
export const TENSE_PATH: PathEntry[] = LESSONS.map(({ slug, title, mn, level }) => ({ slug, title, mn, level }));

export const LEVELS: GrammarLevel[] = CEFR_LEVELS;

export const LEVEL_NAME: Record<GrammarLevel, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-intermediate",
  C1: "Advanced",
};

/** Share of correct answers that completes a lesson or checkpoint. */
export const PASS_RATIO = 0.7;

export const CHECKPOINT_SIZE = 12;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

/** The path entry after `slug` that already has a lesson. */
export function nextLesson(slug: string): PathEntry | undefined {
  const i = TENSE_PATH.findIndex((p) => p.slug === slug);
  return TENSE_PATH.slice(i + 1).find((p) => getLesson(p.slug));
}

/**
 * Stable id for an exercise inside its lesson: its sentence, or prompt + options for `pick`.
 * Review rows store this, so reordering exercises is safe; rewording one drops it from review.
 */
export function exerciseKey(e: Exercise): string {
  return (e.kind === "pick" ? `${e.prompt} | ${e.options.join(" / ")}` : e.sentence).slice(0, 300);
}

export function practiceItems(lesson: Lesson): PracticeItem[] {
  return lesson.exercises.map((exercise) => ({
    slug: lesson.slug,
    lessonTitle: lesson.title,
    key: exerciseKey(exercise),
    exercise,
  }));
}

/** Bank items whose answer is `lesson`'s tense. */
export function bankItems(lesson: Lesson): PracticeItem[] {
  return BANK.filter((b) => b.slug === lesson.slug).map((b) => {
    const exercise: Exercise = { kind: "choice", sentence: b.sentence, options: b.options, answer: b.answer, explain: b.explain };
    return { slug: lesson.slug, lessonTitle: lesson.title, key: exerciseKey(exercise), exercise, credit: b.source };
  });
}

/** Resolves a stored review item: a lesson exercise or a bank item of that lesson. */
export function findItem(slug: string, key: string): PracticeItem | undefined {
  const lesson = getLesson(slug);
  if (!lesson) return undefined;
  return practiceItems(lesson).find((i) => i.key === key) ?? bankItems(lesson).find((i) => i.key === key);
}

export function checkpointSlug(level: GrammarLevel): string {
  return `checkpoint-${level.toLowerCase()}`;
}

/** "a1" (route param) → "A1". */
export function levelFromParam(param: string): GrammarLevel | undefined {
  const upper = param.toUpperCase();
  return (LEVELS as string[]).includes(upper) ? (upper as GrammarLevel) : undefined;
}

/** "checkpoint-a1" (progress slug, time-log ref) → "A1". */
export function checkpointLevel(slug: string): GrammarLevel | undefined {
  return slug.startsWith("checkpoint-") ? levelFromParam(slug.slice("checkpoint-".length)) : undefined;
}

/** Everything a level checkpoint may ask: its lessons' exercises and their bank items. */
export function checkpointPool(level: GrammarLevel): PracticeItem[] {
  return LESSONS.filter((l) => l.level === level).flatMap((l) => [...practiceItems(l), ...bankItems(l)]);
}

export function buildCheckpoint(level: GrammarLevel, seed: string): PracticeItem[] {
  const rand = seeded(seed);
  const lessons = LESSONS.filter((l) => l.level === level);
  return pickCheckpoint(
    lessons.flatMap(practiceItems),
    lessons.flatMap(bankItems),
    CHECKPOINT_SIZE,
    (items) => shuffle(items, rand),
  );
}
