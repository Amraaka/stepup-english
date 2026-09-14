"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  ACTIVITY_MODULES,
  ENGLISH_LEVELS,
  LEARNING_GOALS,
  activityEvents,
  profiles,
  type ActivityModule,
  type EnglishLevel,
  type LearningGoal,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { pointsForStudyLog } from "@/lib/tracker";

export type OnboardingState = { error?: string };

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Guest history from localStorage → activity events. Validated and capped like live logs. */
function guestRows(userId: string, raw: string) {
  let events: unknown;
  try {
    events = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(events)) return [];
  const now = Date.now();
  const oldest = now - 400 * 86_400_000;
  return events.slice(0, 500).flatMap((e) => {
    if (typeof e !== "object" || e === null) return [];
    const { day, durationMin, module } = e as Record<string, unknown>;
    const minutes = Math.floor(Number(durationMin));
    if (typeof day !== "string" || !DAY.test(day) || !(minutes > 0 && minutes <= 240)) return [];
    // Guest days are Ulaanbaatar-local; noon keeps them inside that day.
    const occurredAt = new Date(`${day}T12:00:00+08:00`);
    if (Number.isNaN(occurredAt.getTime()) || occurredAt.getTime() > now || occurredAt.getTime() < oldest) return [];
    const mod: ActivityModule = (ACTIVITY_MODULES as readonly string[]).includes(String(module))
      ? (module as ActivityModule)
      : "general";
    return [
      {
        userId,
        module: mod,
        kind: "study",
        durationSec: minutes * 60,
        points: pointsForStudyLog(minutes),
        occurredAt,
        meta: { source: "guest-import" },
      },
    ];
  });
}

export async function completeOnboarding(_prev: OnboardingState, formData: FormData): Promise<OnboardingState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const level = String(formData.get("level") ?? "");
  if (!(ENGLISH_LEVELS as readonly string[]).includes(level)) {
    return { error: "Англи хэлний түвшнээ сонгоно уу." };
  }
  const goals = [...new Set(formData.getAll("goals").map(String))].filter((g) =>
    (LEARNING_GOALS as readonly string[]).includes(g),
  ) as LearningGoal[];
  if (goals.length === 0) {
    return { error: "Дор хаяж нэг зорилго сонгоно уу." };
  }
  const nameField = formData.get("displayName");
  const displayName = nameField === null ? undefined : String(nameField).trim().slice(0, 60);
  if (displayName === "") {
    return { error: "Нэрээ оруулна уу." };
  }

  await db
    .update(profiles)
    .set({
      englishLevel: level as EnglishLevel,
      learningGoals: goals,
      onboardedAt: new Date(),
      ...(displayName !== undefined ? { displayName } : {}),
    })
    .where(eq(profiles.id, user.id));

  const rows = guestRows(user.id, String(formData.get("guestEvents") ?? "[]"));
  if (rows.length > 0) await db.insert(activityEvents).values(rows);

  revalidatePath("/", "layout");
  redirect("/");
}
