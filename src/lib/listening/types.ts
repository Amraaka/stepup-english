// Listening content model. Decisions: docs/decisions/0009-listening-module-content-and-player.md

import type { CefrLevel } from "@/lib/levels";

/** CEFR band shown on a clip card. */
export type ClipLevel = CefrLevel;

export type ClipSource = {
  name: string;
  url: string;
  license: "public-domain" | "cc-by" | "permission";
  /** Credit line shown under the transcript. */
  credit: string;
  /** Licence deed, for CC texts. */
  licenseUrl?: string;
  /** The credit or licence line exactly as printed at the source, kept for our records. */
  creditLine?: string;
};

/** One sentence of the transcript, with audio timings in seconds. */
export type Segment = {
  start: number;
  end: number;
  /** Words as published, punctuation attached ("States."). */
  tokens: string[];
};

/** A comprehension question shown in practice; `answer` indexes `options`. */
export type ClipQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  /** Short Mongolian explanation shown after answering. */
  explain: string;
};

export type Clip = {
  slug: string;
  title: string;
  /** One-line Mongolian summary for the clip card. */
  summary: string;
  level: ClipLevel;
  durationSec: number;
  audio: string;
  source: ClipSource;
  segments: Segment[];
  questions: ClipQuestion[];
};
