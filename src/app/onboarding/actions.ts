"use server";

import { and, eq, isNull } from "drizzle-orm";
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
import { DAILY_POINTS, DAILY_STUDY_MIN, DAILY_TIMED_SEC } from "@/lib/activity";
import { pointsForStudyLog } from "@/lib/tracker";

export type OnboardingState = { error?: string; done?: boolean; imported?: boolean };

const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Most time one imported guest day may hold: the daily study plus timed limits of live logs. */
const IMPORT_DAY_SEC = DAILY_STUDY_MIN * 60 + DAILY_TIMED_SEC;

/**
 * Guest history from localStorage → activity events. Validated and capped like live logs: an event
 * keeps its stored points (timed repeats earned 0) but never more than the study-log rule, and each
 * day stays within the daily time and points limits.
 */
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
  const perDay = new Map<string, { sec: number; points: number }>();
  return events.slice(0, 500).flatMap((e) => {
    if (typeof e !== "object" || e === null) return [];
    const { day, durationMin, durationSec, points, module } = e as Record<string, unknown>;
    const sec = Math.floor(durationSec !== undefined ? Number(durationSec) : Number(durationMin) * 60);
    if (typeof day !== "string" || !DAY.test(day) || !(sec > 0 && sec <= 14400)) return [];
    // Guest days are Ulaanbaatar-local; noon keeps them inside that day.
    const occurredAt = new Date(`${day}T12:00:00+08:00`);
    if (Number.isNaN(occurredAt.getTime()) || occurredAt.getTime() > now || occurredAt.getTime() < oldest) return [];
    const used = perDay.get(day) ?? { sec: 0, points: 0 };
    const keepSec = Math.min(sec, IMPORT_DAY_SEC - used.sec);
    if (keepSec <= 0) return [];
    const rule = pointsForStudyLog(Math.floor(keepSec / 60));
    const stored = Number(points);
    const pts = Math.max(0, Math.min(Number.isFinite(stored) ? Math.floor(stored) : rule, rule, DAILY_POINTS - used.points));
    perDay.set(day, { sec: used.sec + keepSec, points: used.points + pts });
    const mod: ActivityModule = (ACTIVITY_MODULES as readonly string[]).includes(String(module))
      ? (module as ActivityModule)
      : "general";
    return [
      {
        userId,
        module: mod,
        kind: "study",
        durationSec: keepSec,
        points: pts,
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

  // Onboarding (and the guest import with it) happens once: a repeat submit changes nothing.
  // One transaction, so a failed import leaves the learner free to retry.
  const imported = await db.transaction(async (tx) => {
    const updated = await tx
      .update(profiles)
      .set({
        englishLevel: level as EnglishLevel,
        learningGoals: goals,
        onboardedAt: new Date(),
        ...(displayName !== undefined ? { displayName } : {}),
      })
      .where(and(eq(profiles.id, user.id), isNull(profiles.onboardedAt)))
      .returning({ id: profiles.id });
    if (updated.length === 0) return false;
    const rows = guestRows(user.id, String(formData.get("guestEvents") ?? "[]"));
    if (rows.length > 0) await tx.insert(activityEvents).values(rows);
    return rows.length > 0;
  });

  revalidatePath("/", "layout");
  // The client clears the guest copy only now that the import is saved, then goes home.
  return { done: true, imported };
}
