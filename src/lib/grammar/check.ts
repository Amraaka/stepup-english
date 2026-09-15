/** Normalises a typed answer: case, curly apostrophes, spacing, trailing punctuation. */
export function normalizeAnswer(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[’‘`]/g, "'")
    .replace(/[.!?,]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Contractions and full forms count the same ("isn't" = "is not"). */
function expand(s: string): string {
  return s
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bcan't\b/g, "can not")
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
