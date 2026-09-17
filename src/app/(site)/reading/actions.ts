"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getText } from "@/lib/reading/texts";
import { recordContentResult } from "@/lib/content-progress";

export type Finished = { score: number; total: number; passed: boolean } | null;

/**
 * Grades a finished question set and saves it (ADR 0020). `answers` are the chosen option texts in
 * question order, so the day's option shuffle doesn't matter. Null for guests or a mismatched set.
 */
export async function finishTextAction(slug: string, answers: string[]): Promise<Finished> {
  const user = await getCurrentUser();
  const text = user && typeof slug === "string" ? getText(slug) : null;
  if (!user || !text || !Array.isArray(answers) || answers.length !== text.questions.length) return null;
  const score = text.questions.filter((q, i) => answers[i] === q.options[q.answer]).length;
  const out = await recordContentResult(user.id, "reading", slug, score, text.questions.length);
  revalidatePath("/reading");
  revalidatePath("/learn");
  return out;
}
