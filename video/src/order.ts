// Deterministic ordering shared by the card layouts (src/) and the checker (scripts/),
// so `npm run check` warns about exactly what the video will show.

/** Placements the where-is-it scene can draw. */
export const WHERE_PREPOSITIONS = ["on", "under", "above", "next to", "behind", "in front of", "in", "between"];

export const hashText = (s: string): number =>
  [...s].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 7);

/** Slot (0..n-1) the correct answer takes on card `index`. Mixing in the index keeps
 *  consecutive cards from all landing on the same slot. */
export const answerSlot = (key: string, index: number, n: number): number =>
  n > 0 ? (hashText(key) + index) % n : 0;

/** The options with the answer moved to its slot; the others keep their order. */
export const placeAnswer = (options: string[], answer: string, index: number): string[] => {
  if (!options.includes(answer)) return options;
  const rest = options.filter((o) => o !== answer);
  const slot = answerSlot(answer, index, options.length);
  return [...rest.slice(0, slot), answer, ...rest.slice(slot)];
};

/** Letters of `word` in a stable shuffled order that is never the word itself
 *  (unless every letter is the same, which the checker rejects). */
export const scramble = (word: string, index: number): string[] => {
  const letters = [...word];
  let seed = (hashText(word) + Math.imul(index + 1, 7919)) >>> 0;
  for (let attempt = 0; attempt < 8; attempt++) {
    const a = [...letters];
    for (let i = a.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;
      const j = seed % (i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.join("") !== word) return a;
  }
  return [...letters.slice(1), letters[0]];
};
