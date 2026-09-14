"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getProfile, logStudySession } from "@/lib/activity";
import { ACTIVITY_MODULES, type ActivityModule } from "@/db/schema";
import type { TrackerStats } from "@/lib/tracker";

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
