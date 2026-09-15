"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getProfile, logStudySession, logTimedSession } from "@/lib/activity";
import { ACTIVITY_MODULES, type ActivityModule } from "@/db/schema";
import { getClip } from "@/lib/listening/clips";
import { MIN_TIMED_SEC, type TrackerStats } from "@/lib/tracker";

/** Logs time measured while listening to a clip; returns fresh stats, or null if rejected. */
export async function logListeningAction(slug: string, seconds: number): Promise<TrackerStats | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const clip = getClip(slug);
  if (!clip || !Number.isFinite(seconds) || seconds < MIN_TIMED_SEC) return null;

  // Replaying is fine, but one flush can't claim more than twice the clip.
  await logTimedSession({
    userId: user.id,
    module: "listening",
    seconds: Math.min(seconds, clip.durationSec * 2),
    ref: slug,
  });
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
