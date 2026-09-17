import type { PracticeItem } from "@/lib/grammar/types";

/** Most bank items one lesson may add, so a tense with a big bank doesn't fill the checkpoint. */
export const BANK_PER_LESSON = 2;

/**
 * Picks a mixed set for a level checkpoint: up to half from the Tatoeba bank (at most
 * BANK_PER_LESSON per lesson), the rest spread evenly across the level's lessons, then shuffled.
 * `shuffle` is injected so the set is seeded.
 */
export function pickCheckpoint(
  lessonItems: PracticeItem[],
  bankItems: PracticeItem[],
  size: number,
  shuffle: <T>(items: T[]) => T[],
): PracticeItem[] {
  const bank = shuffle(bankItems);
  const perLesson = new Map<string, number>();
  const fromBank: PracticeItem[] = [];
  for (const item of bank) {
    if (fromBank.length >= Math.floor(size / 2)) break;
    const n = perLesson.get(item.slug) ?? 0;
    if (n < BANK_PER_LESSON) {
      fromBank.push(item);
      perLesson.set(item.slug, n + 1);
    }
  }

  // Round-robin over lessons so every tense of the level shows up.
  const bySlug = new Map<string, PracticeItem[]>();
  for (const item of shuffle(lessonItems)) bySlug.set(item.slug, [...(bySlug.get(item.slug) ?? []), item]);
  const queues = shuffle([...bySlug.values()]);
  const fromLessons: PracticeItem[] = [];
  while (fromBank.length + fromLessons.length < size && queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next && fromBank.length + fromLessons.length < size) fromLessons.push(next);
    }
  }

  // A level with few lesson items takes more from the bank.
  const extra = bank.slice(fromBank.length, fromBank.length + size - fromBank.length - fromLessons.length);
  return shuffle([...fromBank, ...fromLessons, ...extra]);
}
