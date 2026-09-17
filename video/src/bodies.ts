import type { ReactNode } from "react";
import { FixMistakeBody, GapFillBody, SilentLetterBody, WordStressBody, type BodyProps } from "./formats";
import { MiniDialogueBody, OddOneOutBody, OppositesBody, SoundPairBody, UnscrambleBody, WhereIsItBody } from "./formats-more";
import type { FormatName } from "./types";

/** Card body per format. "picture" has none: QuizCard draws its own picture layout. */
export const BODIES: Partial<Record<FormatName, (p: BodyProps) => ReactNode>> = {
  "fix-mistake": FixMistakeBody,
  "silent-letter": SilentLetterBody,
  "word-stress": WordStressBody,
  "gap-fill": GapFillBody,
  opposites: OppositesBody,
  "sound-pair": SoundPairBody,
  "mini-dialogue": MiniDialogueBody,
  "odd-one-out": OddOneOutBody,
  unscramble: UnscrambleBody,
  "where-is-it": WhereIsItBody,
};
