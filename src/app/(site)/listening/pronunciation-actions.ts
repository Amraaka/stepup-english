"use server";

import { and, count, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { pronunciationUsage } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { isPcmWavHeader, SPEECH_SAMPLE_RATE } from "@/lib/audio/wav";
import { getClip } from "@/lib/listening/clips";
import { buildFeedback } from "@/lib/pronunciation/feedback";
import { assessPronunciation, PronunciationError, pronunciationAvailable } from "@/lib/pronunciation/provider";
import type { AssessOutcome } from "@/lib/pronunciation/types";

/** 20 s of 16 kHz mono 16-bit WAV plus header; the recorder stops at 20 s. */
const MAX_WAV_BYTES = 44 + 16000 * 2 * 20 + 16_000;
const MIN_WAV_BYTES = 44 + 16000 * 2 * 0.3;
/** Scored sentences per learner in any 24 hours; each one is a paid call. */
const DAILY_QUOTA = 60;

/** Takes one unit of today's quota; false when it is used up. Locked per user so parallel calls can't overshoot. */
async function takeQuota(userId: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`pronunciation:${userId}`}))`);
    const [{ used }] = await tx
      .select({ used: count() })
      .from(pronunciationUsage)
      .where(
        and(eq(pronunciationUsage.userId, userId), gte(pronunciationUsage.createdAt, sql`now() - interval '1 day'`)),
      );
    if (used >= DAILY_QUOTA) return false;
    await tx.insert(pronunciationUsage).values({ userId });
    return true;
  });
}

/** Scores one recorded sentence of a clip. The reference text comes from the catalog, never the client. */
export async function assessPronunciationAction(form: FormData): Promise<AssessOutcome> {
  if (!pronunciationAvailable()) return { status: "unavailable" };
  const user = await getCurrentUser();
  if (!user) return { status: "signin" };

  const audio = form.get("audio");
  const clip = getClip(String(form.get("slug") ?? ""));
  const segField = form.get("seg");
  const seg = typeof segField === "string" && /^\d+$/.test(segField) ? Number(segField) : -1;
  const segment = clip && seg >= 0 ? clip.segments[seg] : undefined;
  if (!(audio instanceof Blob) || !segment) {
    return { status: "error", message: "Хүсэлт буруу байна. Хуудсаа дахин ачаалаад оролдоорой." };
  }
  if (audio.size < MIN_WAV_BYTES || audio.size > MAX_WAV_BYTES) {
    return { status: "error", message: "Бичлэг хэт богино эсвэл хэт урт байна. Өгүүлбэрээ дахин бичээрэй." };
  }
  if (!isPcmWavHeader(await audio.slice(0, 44).arrayBuffer(), SPEECH_SAMPLE_RATE)) {
    return { status: "error", message: "Хүсэлт буруу байна. Хуудсаа дахин ачаалаад оролдоорой." };
  }
  if (!(await takeQuota(user.id))) {
    return { status: "error", message: "Өнөөдрийн AI үнэлгээний хязгаарт хүрлээ. Маргааш дахин оролдоорой." };
  }

  try {
    const assessed = await assessPronunciation(audio, segment.tokens.join(" "));
    if (!assessed) return { status: "unavailable" };
    return { status: "ok", result: assessed.result, feedback: buildFeedback(assessed.result), sample: assessed.sample };
  } catch (e) {
    if (e instanceof PronunciationError && e.reason === "no-speech") {
      return { status: "error", message: "Яриа сонсогдсонгүй. Микрофондоо ойрхон, тод хэлээд дахин бичээрэй." };
    }
    return { status: "error", message: "AI үнэлгээ түр ажиллахгүй байна. Дараа дахин оролдоорой." };
  }
}
