"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logStudySession } from "@/lib/activity";
import { ACTIVITY_MODULES, type ActivityModule } from "@/db/schema";

export async function logStudy(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const moduleRaw = String(formData.get("module") ?? "general");
  const mod: ActivityModule = (ACTIVITY_MODULES as readonly string[]).includes(moduleRaw)
    ? (moduleRaw as ActivityModule)
    : "general";
  const durationMin = Number(formData.get("durationMin") ?? 0);
  if (!Number.isFinite(durationMin) || durationMin < 0) return;

  await logStudySession({ userId: user.id, module: mod, durationMin });
  revalidatePath("/app");
}
