"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getClip, shadowingSegments } from "@/lib/listening/clips";
import { buildPractice, checkDictation, type PracticeItem } from "@/lib/listening/exercises";
import { lookupWord, wordKey } from "@/lib/dictionary/glossary";
import { recordContentResult } from "@/lib/content-progress";
import { localDay, prevDay } from "@/lib/tracker";
import type { Finished } from "@/app/(site)/reading/actions";

export type PracticeAnswer = { id: string; answer: string };

const MAX_ANSWER = 300;

function isCorrect(item: PracticeItem, answer: string): boolean {
  if (item.kind === "question") return answer === item.options[item.answer];
  if (item.kind === "gap") return answer === item.answer;
  return checkDictation(item.tokens, answer.slice(0, MAX_ANSWER)).correct;
}

/**
 * Grades a finished listening practice and saves it (ADR 0020). The set is seeded by day, so the
 * server rebuilds today's set, or yesterday's for a session that crossed midnight, and grades by item id.
 */
export async function finishPracticeAction(slug: string, answers: PracticeAnswer[]): Promise<Finished> {
  const user = await getCurrentUser();
  const clip = user && typeof slug === "string" ? getClip(slug) : null;
  if (!user || !clip || !Array.isArray(answers)) return null;
  const ids = answers.map((a) => (a && typeof a.id === "string" && typeof a.answer === "string" ? a.id : null));
  if (ids.includes(null)) return null;

  const today = localDay(new Date(), "Asia/Ulaanbaatar");
  const items = [today, prevDay(today)]
    .map((day) => buildPractice(clip, lookupWord, wordKey, `${clip.slug}:${day}`))
    .find((set) => set.length === ids.length && set.every((item, i) => item.id === ids[i]));
  if (!items) return null;

  const score = items.filter((item, i) => isCorrect(item, answers[i].answer)).length;
  const out = await recordContentResult(user.id, "listening", slug, score, items.length);
  revalidatePath("/listening");
  revalidatePath("/learn");
  return out;
}

/** Saves a finished shadowing run: how many of the clip's sentences the learner recorded (ADR 0020). */
export async function finishShadowingAction(slug: string, practiced: number): Promise<Finished> {
  const user = await getCurrentUser();
  const clip = user && typeof slug === "string" ? getClip(slug) : null;
  if (!user || !clip || !Number.isInteger(practiced) || practiced < 0) return null;
  const total = shadowingSegments(clip).length;
  const out = await recordContentResult(user.id, "speaking", slug, Math.min(practiced, total), total);
  revalidatePath("/speaking");
  revalidatePath("/learn");
  return out;
}
