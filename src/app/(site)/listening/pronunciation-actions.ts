"use server";

import { getCurrentUser } from "@/lib/auth";
import { getClip } from "@/lib/listening/clips";
import { buildFeedback } from "@/lib/pronunciation/feedback";
import { assessPronunciation, PronunciationError, pronunciationAvailable } from "@/lib/pronunciation/provider";
import type { AssessOutcome } from "@/lib/pronunciation/types";

/** 20 s of 16 kHz mono 16-bit WAV plus header; the recorder stops at 20 s. */
const MAX_WAV_BYTES = 44 + 16000 * 2 * 20 + 16_000;
const MIN_WAV_BYTES = 44 + 16000 * 2 * 0.3;

/** Scores one recorded sentence of a clip. The reference text comes from the catalog, never the client. */
export async function assessPronunciationAction(form: FormData): Promise<AssessOutcome> {
  if (!pronunciationAvailable()) return { status: "unavailable" };
  const user = await getCurrentUser();
  if (!user) return { status: "signin" };

  const audio = form.get("audio");
  const clip = getClip(String(form.get("slug") ?? ""));
  const seg = Number(form.get("seg"));
  const segment = clip && Number.isInteger(seg) ? clip.segments[seg] : undefined;
  if (!(audio instanceof Blob) || !segment) {
    return { status: "error", message: "Хүсэлт буруу байна. Хуудсаа дахин ачаалаад оролдоорой." };
  }
  if (audio.size < MIN_WAV_BYTES || audio.size > MAX_WAV_BYTES) {
    return { status: "error", message: "Бичлэг хэт богино эсвэл хэт урт байна. Өгүүлбэрээ дахин бичээрэй." };
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
