// Reading content model. Decision: docs/decisions/0017-reading-module.md

import type { CefrLevel } from "@/lib/levels";
import type { ClipQuestion, ClipSource } from "@/lib/listening/types";

/** One sentence as published: words with punctuation attached, like a clip segment. */
export type Sentence = string[];

export type ReadingText = {
  slug: string;
  title: string;
  /** One-line Mongolian summary for the text card. */
  summary: string;
  level: CefrLevel;
  source: ClipSource;
  /** Paragraphs, each a list of sentences. */
  paragraphs: Sentence[][];
  /** Comprehension questions; `answer` indexes `options`, `explain` is Mongolian. */
  questions: ClipQuestion[];
};
