import "server-only";
import { and, asc, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { grammarProgress, grammarReview } from "@/db/schema";
import { PASS_RATIO, findItem } from "@/lib/grammar/lessons";
import type { LessonProgress, PracticeItem } from "@/lib/grammar/types";
import { DAILY_REVIEW_CAP, nextReview } from "@/lib/vocab/review";

// Every query filters by the caller's user id (ADR 0005 access model). Decision: ADR 0013.

export type PracticeResult = { key: string; correct: boolean };

/** Saves a finished lesson practice and queues its wrong answers for review. */
export async function recordPractice(userId: string, slug: string, results: PracticeResult[]) {
  const score = results.filter((r) => r.correct).length;
  const total = results.length;
  const passed = score / total >= PASS_RATIO;

  await db
    .insert(grammarProgress)
    .values({ userId, slug, bestScore: score, lastScore: score, total, completedAt: passed ? new Date() : null })
    .onConflictDoUpdate({
      target: [grammarProgress.userId, grammarProgress.slug],
      set: {
        bestScore: sql`greatest(${grammarProgress.bestScore}, excluded.best_score)`,
        lastScore: sql`excluded.last_score`,
        total: sql`excluded.total`,
        attempts: sql`${grammarProgress.attempts} + 1`,
        completedAt: sql`coalesce(${grammarProgress.completedAt}, excluded.completed_at)`,
        updatedAt: sql`now()`,
      },
    });

  const wrong = results.filter((r) => !r.correct);
  if (wrong.length) {
    // A mistake made again sends the item back to box 0, due now.
    await db
      .insert(grammarReview)
      .values(wrong.map((w) => ({ userId, slug, itemKey: w.key })))
      .onConflictDoUpdate({
        target: [grammarReview.userId, grammarReview.slug, grammarReview.itemKey],
        set: { box: 0, dueAt: sql`now()` },
      });
  }
  return { score, total, passed, added: wrong.length };
}

export async function progressBySlug(userId: string): Promise<Record<string, LessonProgress>> {
  const rows = await db
    .select({
      slug: grammarProgress.slug,
      bestScore: grammarProgress.bestScore,
      total: grammarProgress.total,
      completedAt: grammarProgress.completedAt,
    })
    .from(grammarProgress)
    .where(eq(grammarProgress.userId, userId));
  return Object.fromEntries(
    rows.map((r) => [r.slug, { bestScore: r.bestScore, total: r.total, completed: r.completedAt !== null }]),
  );
}

export async function dueReviewCount(userId: string): Promise<number> {
  const [{ due }] = await db
    .select({ due: count() })
    .from(grammarReview)
    .where(and(eq(grammarReview.userId, userId), lte(grammarReview.dueAt, sql`now()`)));
  return due;
}

/** Due mistakes for today's session, within the daily cap (counted in the learner's timezone). */
export async function grammarReviewQueue(userId: string, timeZone: string): Promise<PracticeItem[]> {
  const startOfDay = sql`(date_trunc('day', now() at time zone ${timeZone}) at time zone ${timeZone})`;
  const [{ reviewedToday }] = await db
    .select({ reviewedToday: count() })
    .from(grammarReview)
    .where(and(eq(grammarReview.userId, userId), gte(grammarReview.lastReviewedAt, startOfDay)));
  const room = Math.max(0, DAILY_REVIEW_CAP - reviewedToday);
  if (!room) return [];

  const rows = await db
    .select({ id: grammarReview.id, slug: grammarReview.slug, itemKey: grammarReview.itemKey })
    .from(grammarReview)
    .where(and(eq(grammarReview.userId, userId), lte(grammarReview.dueAt, sql`now()`)))
    .orderBy(asc(grammarReview.dueAt))
    .limit(room);

  const items: PracticeItem[] = [];
  for (const row of rows) {
    const item = findItem(row.slug, row.itemKey);
    if (item) items.push(item);
    // An exercise that was reworded or removed can't be shown again.
    else await db.delete(grammarReview).where(and(eq(grammarReview.id, row.id), eq(grammarReview.userId, userId)));
  }
  return items;
}

export async function reviewGrammarItem(userId: string, slug: string, key: string, correct: boolean) {
  const where = and(eq(grammarReview.userId, userId), eq(grammarReview.slug, slug), eq(grammarReview.itemKey, key));
  const [row] = await db.select({ box: grammarReview.box }).from(grammarReview).where(where);
  if (!row) return false;
  const next = nextReview(row.box, correct);
  await db.update(grammarReview).set({ box: next.box, dueAt: next.dueAt, lastReviewedAt: new Date() }).where(where);
  return true;
}
