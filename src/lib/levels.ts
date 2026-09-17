import type { EnglishLevel } from "@/db/schema";

/** CEFR band used by content: clips, grammar lessons, and later texts, word lists and prompts. */
export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export const CEFR_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1"];

const FROM_PROFILE: Record<EnglishLevel, CefrLevel | null> = {
  beginner: "A1",
  elementary: "A2",
  intermediate: "B1",
  advanced: "B2",
  unsure: null,
};

/** The band a learner starts at, from their self-assessed onboarding level; null when unknown. ADR 0015. */
export function cefrFor(level: EnglishLevel | null | undefined): CefrLevel | null {
  return level ? FROM_PROFILE[level] : null;
}
