import { isTypedCorrect, normalizeAnswer } from "@/lib/grammar/check";

/** "almost": one letter off in a word of 5+ letters; it counts as remembered, with the spelling shown (ADR 0018). */
export type TypedResult = "right" | "almost" | "wrong";

/** `confusable`: real words one letter from the answer ("quite" for "quiet"), which are wrong, not typos. */
export function checkTypedWord(input: string, answers: string[], confusable: string[] = []): TypedResult {
  if (isTypedCorrect(input, answers)) return "right";
  const got = normalizeAnswer(input);
  if (!got || confusable.some((w) => normalizeAnswer(w) === got)) return "wrong";
  const close = answers.some((a) => {
    const want = normalizeAnswer(a);
    return want.length >= 5 && editDistance(got, want) <= 1;
  });
  return close ? "almost" : "wrong";
}

/** Levenshtein distance, with a swap of two neighbouring letters counted as one edit. */
export function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}
