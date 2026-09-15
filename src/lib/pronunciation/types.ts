// Provider-neutral pronunciation assessment model (ADR 0011).
// Adapters (e.g. Azure) translate their responses into these types.

export type WordError = "none" | "mispronunciation" | "omission" | "insertion";

/** Phonemes use IPA symbols ("θ", "ð", "v", "w", "ɹ", "iː"). */
export type PhonemeScore = { phoneme: string; accuracy: number };

export type WordScore = {
  word: string;
  /** 0–100 */
  accuracy: number;
  error: WordError;
  phonemes: PhonemeScore[];
};

export type PronunciationResult = {
  /** 0–100 scores */
  overall: number;
  accuracy: number;
  fluency: number;
  completeness: number;
  words: WordScore[];
};

export type Tip = { id: string; title: string; body: string; words: string[] };

export type Feedback = {
  level: "great" | "good" | "practice";
  summary: string;
  /** Words worth saying again, worst first. */
  retry: string[];
  tips: Tip[];
};

export type AssessOutcome =
  | { status: "ok"; result: PronunciationResult; feedback: Feedback; sample: boolean }
  | { status: "unavailable" }
  | { status: "signin" }
  | { status: "error"; message: string };
