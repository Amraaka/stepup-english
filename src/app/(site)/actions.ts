"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getProfile, logStudySession, logTimedSession } from "@/lib/activity";
import { ACTIVITY_MODULES, type ActivityModule } from "@/db/schema";
import { getClip } from "@/lib/listening/clips";
import { getLesson } from "@/lib/grammar/lessons";
import { MIN_TIMED_SEC, type TimedTarget, type TrackerStats } from "@/lib/tracker";

/** Longest review or shadowing session one flush may claim, in seconds. */
const MAX_SESSION_SEC = 3600;

/** Logs time a module measured (listening, word review); returns fresh stats, or null if rejected. */
export async function logTimedAction(target: TimedTarget, seconds: number): Promise<TrackerStats | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !Number.isFinite(seconds) || seconds < MIN_TIMED_SEC) return null;

  let cap: number;
  if (target.module === "listening") {
    const clip = getClip(target.ref);
    if (!clip) return null;
    // Replaying is fine, but one flush can't claim more than twice the clip.
    cap = clip.durationSec * 2;
  } else if (target.module === "speaking") {
    // Shadowing repeats every sentence, so it can run longer than the clip.
    if (!getClip(target.ref)) return null;
    cap = MAX_SESSION_SEC;
  } else if (target.module === "grammar") {
    if (!getLesson(target.ref)) return null;
    cap = MAX_SESSION_SEC;
  } else if (target.module === "vocabulary" && target.ref === "review") {
    cap = MAX_SESSION_SEC;
  } else {
    return null;
  }

  await logTimedSession({ userId: user.id, module: target.module, seconds: Math.min(seconds, cap), ref: target.ref });
  const profile = await getProfile(user.id);
  revalidatePath("/", "layout");
  return getDashboardStats(user.id, profile?.timezone ?? "Asia/Ulaanbaatar");
}

/** Logs a study session and returns fresh stats, or null if not allowed. */
export async function logStudyAction(
  moduleRaw: string,
  durationMin: number,
): Promise<TrackerStats | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const mod: ActivityModule = (ACTIVITY_MODULES as readonly string[]).includes(moduleRaw)
    ? (moduleRaw as ActivityModule)
    : "general";
  if (!Number.isFinite(durationMin) || durationMin <= 0) return null;

  await logStudySession({ userId: user.id, module: mod, durationMin });
  const profile = await getProfile(user.id);
  revalidatePath("/", "layout");
  return getDashboardStats(user.id, profile?.timezone ?? "Asia/Ulaanbaatar");
}
