import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { contentProgress, type ContentModule } from "@/db/schema";
import { PASS_RATIO } from "@/lib/grammar/lessons";

// Every query filters by the caller's user id (ADR 0005 access model). Decision: ADR 0020.

export type ItemProgress = { bestScore: number; total: number; completed: boolean };

/** Saves a finished attempt; the item counts as finished from the first attempt at the pass mark. */
export async function recordContentResult(
  userId: string,
  module: ContentModule,
  ref: string,
  score: number,
  total: number,
) {
  const passed = total > 0 && score / total >= PASS_RATIO;
  await db
    .insert(contentProgress)
    .values({ userId, module, ref, bestScore: score, lastScore: score, total, completedAt: passed ? new Date() : null })
    .onConflictDoUpdate({
      target: [contentProgress.userId, contentProgress.module, contentProgress.ref],
      set: {
        // A best score out of a different total (the item changed) no longer compares, so it restarts.
        bestScore: sql`case when ${contentProgress.total} = excluded.total then greatest(${contentProgress.bestScore}, excluded.best_score) else excluded.best_score end`,
        lastScore: sql`excluded.last_score`,
        total: sql`excluded.total`,
        attempts: sql`${contentProgress.attempts} + 1`,
        completedAt: sql`coalesce(${contentProgress.completedAt}, excluded.completed_at)`,
        updatedAt: sql`now()`,
      },
    });
  return { score, total, passed };
}

export async function contentProgressByRef(
  userId: string,
  module: ContentModule,
): Promise<Record<string, ItemProgress>> {
  const rows = await db
    .select({
      ref: contentProgress.ref,
      bestScore: contentProgress.bestScore,
      total: contentProgress.total,
      completedAt: contentProgress.completedAt,
    })
    .from(contentProgress)
    .where(and(eq(contentProgress.userId, userId), eq(contentProgress.module, module)));
  return Object.fromEntries(
    rows.map((r) => [r.ref, { bestScore: r.bestScore, total: r.total, completed: r.completedAt !== null }]),
  );
}
