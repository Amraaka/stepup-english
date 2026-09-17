"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getProfile, logStudySession } from "@/lib/activity";
import { ACTIVITY_MODULES, type ActivityModule } from "@/db/schema";
import { recordTimed } from "@/lib/timed";
import type { TimedTarget, TrackerStats } from "@/lib/tracker";

/** Logs time a module measured (listening, word review); returns fresh stats, or null if rejected. */
export async function logTimedAction(target: TimedTarget, seconds: number): Promise<TrackerStats | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // The target comes from the client; `recordTimed` checks its shape and caps (ADR 0015).
  if (!user || !(await recordTimed(user.id, target, seconds))) return null;
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

  const profile = await getProfile(user.id);
  const timeZone = profile?.timezone ?? "Asia/Ulaanbaatar";
  if (!(await logStudySession({ userId: user.id, module: mod, durationMin, timeZone }))) return null;
  revalidatePath("/", "layout");
  return getDashboardStats(user.id, timeZone);
}
