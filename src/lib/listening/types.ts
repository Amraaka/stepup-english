// Listening content model. Decisions: docs/decisions/0009-listening-module-content-and-player.md

/** CEFR band shown on a clip card. */
export type ClipLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export type ClipSource = {
  name: string;
  url: string;
  license: "public-domain" | "cc-by" | "permission";
  /** Credit line shown under the transcript. */
  credit: string;
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

export type PartOfSpeech = "n" | "v" | "adj" | "adv" | "prep" | "conj" | "pron" | "det" | "num" | "name" | "phrase";

export type GlossEntry = {
  /** Dictionary form ("serve" for "served"). */
  lemma: string;
  pos: PartOfSpeech;
  /** Plain Mongolian meaning. */
  mn: string;
  /** Short learner-English definition, when useful. */
  en?: string;
};
