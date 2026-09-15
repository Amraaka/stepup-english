import "server-only";
import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { savedWords, type SavedWordSource } from "@/db/schema";
import { DAILY_REVIEW_CAP, nextReview, type Card } from "@/lib/vocab/review";

// Every query filters by the caller's user id (ADR 0005 access model).

function toCard(row: typeof savedWords.$inferSelect): Card {
  return { id: row.id, lemma: row.lemma, surface: row.surface, sentence: row.sentence, clip: row.source.clip ?? null };
}

/** Saves a word; saving the same lemma again keeps the first save. */
export async function saveWord(
  userId: string,
  word: { lemma: string; surface: string; sentence: string; source: SavedWordSource },
) {
  await db
    .insert(savedWords)
    .values({ userId, ...word })
    .onConflictDoNothing({ target: [savedWords.userId, savedWords.lemma] });
}

export async function savedLemmas(userId: string): Promise<string[]> {
  const rows = await db.select({ lemma: savedWords.lemma }).from(savedWords).where(eq(savedWords.userId, userId));
  return rows.map((r) => r.lemma);
}

export async function listSavedWords(userId: string) {
  const rows = await db
    .select()
    .from(savedWords)
    .where(eq(savedWords.userId, userId))
    .orderBy(desc(savedWords.createdAt));
  return rows.map((r) => ({ ...toCard(r), box: r.box }));
}

/** Due cards for today's session, within the daily cap (counted in the learner's timezone). */
export async function reviewQueue(userId: string, timeZone: string) {
  const startOfDay = sql`(date_trunc('day', now() at time zone ${timeZone}) at time zone ${timeZone})`;
  const [[{ reviewedToday }], [{ due }]] = await Promise.all([
    db
      .select({ reviewedToday: count() })
      .from(savedWords)
      .where(and(eq(savedWords.userId, userId), gte(savedWords.lastReviewedAt, startOfDay))),
    db
      .select({ due: count() })
      .from(savedWords)
      .where(and(eq(savedWords.userId, userId), lte(savedWords.dueAt, sql`now()`))),
  ]);
  const room = Math.max(0, DAILY_REVIEW_CAP - reviewedToday);
  const rows = room
    ? await db
        .select()
        .from(savedWords)
        .where(and(eq(savedWords.userId, userId), lte(savedWords.dueAt, sql`now()`)))
        .orderBy(asc(savedWords.dueAt))
        .limit(room)
    : [];
  return { cards: rows.map(toCard), reviewedToday, due };
}

export async function reviewWord(userId: string, id: number, remembered: boolean) {
  const [row] = await db
    .select({ box: savedWords.box })
    .from(savedWords)
    .where(and(eq(savedWords.id, id), eq(savedWords.userId, userId)));
  if (!row) return false;
  const next = nextReview(row.box, remembered);
  await db
    .update(savedWords)
    .set({ box: next.box, dueAt: next.dueAt, lastReviewedAt: new Date() })
    .where(and(eq(savedWords.id, id), eq(savedWords.userId, userId)));
  return true;
}

export async function deleteWord(userId: string, id: number) {
  await db.delete(savedWords).where(and(eq(savedWords.id, id), eq(savedWords.userId, userId)));
}
