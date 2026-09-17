import "server-only";
import { logTimedSession } from "@/lib/activity";
import { getClip } from "@/lib/listening/clips";
import { checkpointLevel, getLesson } from "@/lib/grammar/lessons";
import { getText, readingCapSec } from "@/lib/reading/texts";
import { MIN_TIMED_SEC, type TimedTarget } from "@/lib/tracker";

// Rules for time a module measured, shared by the server action and the page-close beacon (ADR 0015).

/** Longest review or shadowing session one flush may claim, in seconds. */
const MAX_SESSION_SEC = 3600;

/**
 * Which refs each module may log time for, and the most seconds one flush may claim.
 * A new module adds one entry here and one member to `TimedTarget` (ADR 0015).
 */
const TIMED_CAPS: { [M in TimedTarget["module"]]: (ref: string) => number | null } = {
  // Replaying is fine, but one flush can't claim more than twice the clip.
  listening: (ref) => {
    const clip = getClip(ref);
    return clip ? clip.durationSec * 2 : null;
  },
  // Shadowing repeats every sentence, so it can run longer than the clip.
  speaking: (ref) => (getClip(ref) ? MAX_SESSION_SEC : null),
  // A lesson (reading or its practice), a level checkpoint or the mistake review.
  grammar: (ref) => (ref === "review" || getLesson(ref) || checkpointLevel(ref) ? MAX_SESSION_SEC : null),
  vocabulary: (ref) => (ref === "review" ? MAX_SESSION_SEC : null),
  // A text or its questions, capped from the text's length.
  reading: (ref) => {
    const text = getText(ref);
    return text ? readingCapSec(text) : null;
  },
};

/**
 * Checks a timed log from the client and records it for `userId`. Returns false when the
 * target or seconds are invalid, or nothing was left to log (elapsed-time and daily limits).
 * Points follow the cumulative rule in `logTimedSession`.
 */
export async function recordTimed(userId: string, target: unknown, seconds: unknown): Promise<boolean> {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < MIN_TIMED_SEC) return false;
  const t = (target ?? {}) as { module?: unknown; ref?: unknown };
  if (typeof t.module !== "string" || typeof t.ref !== "string" || !Object.hasOwn(TIMED_CAPS, t.module)) return false;
  const mod = t.module as TimedTarget["module"];
  const cap = TIMED_CAPS[mod](t.ref);
  if (cap === null) return false;
  return logTimedSession({ userId, module: mod, seconds: Math.min(seconds, cap), ref: t.ref });
}
