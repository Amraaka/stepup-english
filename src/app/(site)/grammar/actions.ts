"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { isAnswerCorrect } from "@/lib/grammar/check";
import {
  CHECKPOINT_SIZE,
  checkpointPool,
  checkpointSlug,
  findItem,
  getLesson,
  levelFromParam,
  practiceItems,
} from "@/lib/grammar/lessons";
import type { PracticeAnswer, PracticeItem } from "@/lib/grammar/types";
import { recordPractice, reviewGrammarItem, type PracticeResult } from "@/lib/grammar/progress";

type Saved = { score: number; total: number; passed: boolean; added: number } | null;

const MAX_ANSWER = 200;

/**
 * Grades exactly `expected` answers, one per item, against `allowed`; otherwise null.
 * An item no longer in `allowed` (reworded by a deploy mid-session) is skipped so the rest still count.
 */
function gradeResults(results: unknown, allowed: PracticeItem[], expected: number): PracticeResult[] | null {
  if (!Array.isArray(results) || results.length !== expected) return null;
  const pool = new Map(allowed.map((i) => [`${i.slug}|${i.key}`, i]));
  const seen = new Set<string>();
  const graded: PracticeResult[] = [];
  for (const r of results as Partial<PracticeAnswer>[]) {
    if (!r || typeof r.slug !== "string" || typeof r.key !== "string" || typeof r.answer !== "string") return null;
    const id = `${r.slug}|${r.key}`;
    if (seen.has(id)) return null;
    seen.add(id);
    const item = pool.get(id);
    if (!item) continue;
    graded.push({ slug: r.slug, key: r.key, correct: isAnswerCorrect(item.exercise, r.answer.slice(0, MAX_ANSWER)) });
  }
  return graded.length ? graded : null;
}

/** Saves a finished lesson practice. Returns null for guests or a result that doesn't match the lesson. */
export async function finishPracticeAction(slug: string, results: PracticeAnswer[]): Promise<Saved> {
  const user = await getCurrentUser();
  const lesson = user ? getLesson(slug) : undefined;
  if (!user || !lesson) return null;
  const items = practiceItems(lesson);
  const graded = gradeResults(results, items, items.length);
  if (!graded) return null;
  const out = await recordPractice(user.id, slug, graded);
  revalidatePath("/grammar");
  return out;
}

/** Saves a finished level checkpoint; wrong answers go to review under their own lesson. */
export async function finishCheckpointAction(levelParam: string, results: PracticeAnswer[]): Promise<Saved> {
  const user = await getCurrentUser();
  const level = user && typeof levelParam === "string" ? levelFromParam(levelParam) : undefined;
  if (!user || !level) return null;
  // The set is seeded by day, so any items from the level's pool are accepted.
  const pool = checkpointPool(level);
  const graded = gradeResults(results, pool, Math.min(CHECKPOINT_SIZE, pool.length));
  if (!graded) return null;
  const out = await recordPractice(user.id, checkpointSlug(level), graded);
  revalidatePath("/grammar");
  return out;
}

/** Grades and saves one review answer; false when it wasn't saved (not due, unknown item, guest). */
export async function reviewGrammarAction(slug: string, key: string, answer: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || typeof slug !== "string" || typeof key !== "string" || typeof answer !== "string") return false;
  const item = findItem(slug, key);
  if (!item) return false;
  return reviewGrammarItem(user.id, slug, key, isAnswerCorrect(item.exercise, answer.slice(0, MAX_ANSWER)));
}
