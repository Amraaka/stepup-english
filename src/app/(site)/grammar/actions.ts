"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { findItem, getLesson, practiceItems } from "@/lib/grammar/lessons";
import { recordPractice, reviewGrammarItem, type PracticeResult } from "@/lib/grammar/progress";

/** Saves a finished lesson practice. Returns null for guests or a result that doesn't match the lesson. */
export async function finishPracticeAction(
  slug: string,
  results: PracticeResult[],
): Promise<{ score: number; total: number; passed: boolean; added: number } | null> {
  const user = await getCurrentUser();
  const lesson = user ? getLesson(slug) : undefined;
  if (!user || !lesson || !Array.isArray(results)) return null;

  const keys = new Set(practiceItems(lesson).map((i) => i.key));
  const seen = new Map<string, boolean>();
  for (const r of results) {
    if (r && typeof r.key === "string" && keys.has(r.key) && typeof r.correct === "boolean" && !seen.has(r.key)) {
      seen.set(r.key, r.correct);
    }
  }
  // One answer per exercise, all of them.
  if (seen.size !== keys.size) return null;

  const out = await recordPractice(
    user.id,
    slug,
    [...seen].map(([key, correct]) => ({ key, correct })),
  );
  revalidatePath("/grammar");
  return out;
}

export async function reviewGrammarAction(slug: string, key: string, correct: boolean): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || typeof correct !== "boolean" || !findItem(slug, key)) return false;
  return reviewGrammarItem(user.id, slug, key, correct);
}
