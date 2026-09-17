import type { Exercise } from "@/lib/grammar/types";

/** Normalises a typed answer: case, curly apostrophes, spacing, punctuation and quotes around it. */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[’‘`]/g, "'")
    .replace(/^[\s"“”'.!?,;:()[\]«»-]+|[\s"“”'.!?,;:()[\]«»-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Contractions and full forms count the same ("isn't" = "is not"). */
function expand(s: string): string {
  return s
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bcan't\b/g, "can not")
    .replace(/\bcannot\b/g, "can not")
    .replace(/n't\b/g, " not")
    .replace(/'ll\b/g, " will")
    .replace(/'ve\b/g, " have")
    .replace(/'m\b/g, " am")
    .replace(/'re\b/g, " are")
    .replace(/\s+/g, " ")
    .trim();
}

export function isTypedCorrect(input: string, answers: string[]): boolean {
  const got = expand(normalizeAnswer(input));
  if (!got) return false;
  return answers.some((a) => expand(normalizeAnswer(a)) === got);
}

/** Grades one answer: typed text for `type` exercises, the chosen option otherwise. */
export function isAnswerCorrect(exercise: Exercise, answer: string): boolean {
  return exercise.kind === "type" ? isTypedCorrect(answer, exercise.answers) : answer === exercise.answer;
}
