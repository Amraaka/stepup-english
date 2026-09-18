import "server-only";
import { getProfile } from "@/lib/activity";
import { cefrFor } from "@/lib/levels";
import { savedBoxes } from "@/lib/vocab/words";
import type { Learner } from "@/lib/dictionary/coverage";

/** Assumed level for guests and learners who chose "not sure" (ADR 0022). */
const DEFAULT_LEVEL = "A2";

/** What the coverage estimate needs to know about the current learner; `levelKnown` is false when the level is a guess. */
export async function currentLearner(userId: string | null): Promise<Learner & { levelKnown: boolean }> {
  if (!userId) return { level: DEFAULT_LEVEL, saved: {}, levelKnown: false };
  const [profile, saved] = await Promise.all([getProfile(userId), savedBoxes(userId)]);
  const level = cefrFor(profile?.englishLevel);
  return { level: level ?? DEFAULT_LEVEL, saved, levelKnown: level !== null };
}
