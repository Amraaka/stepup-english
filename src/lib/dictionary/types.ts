// Shared word data for every module that shows or saves words (ADR 0016).

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
