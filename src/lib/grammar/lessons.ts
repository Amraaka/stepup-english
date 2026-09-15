import type { Exercise, GrammarLevel, Lesson, PathEntry, PracticeItem } from "@/lib/grammar/types";
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

/** The full tense path in teaching order. */
export const TENSE_PATH: PathEntry[] = LESSONS.map(({ slug, title, mn, level }) => ({ slug, title, mn, level }));

export const LEVEL_NAME: Record<GrammarLevel, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-intermediate",
  C1: "Advanced",
};

/** Share of correct answers that completes a lesson. */
export const PASS_RATIO = 0.7;

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

export function findItem(slug: string, key: string): PracticeItem | undefined {
  const lesson = getLesson(slug);
  return lesson ? practiceItems(lesson).find((i) => i.key === key) : undefined;
}

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

/** The path entry after `slug` that already has a lesson. */
export function nextLesson(slug: string): PathEntry | undefined {
  const i = TENSE_PATH.findIndex((p) => p.slug === slug);
  return TENSE_PATH.slice(i + 1).find((p) => getLesson(p.slug));
}
