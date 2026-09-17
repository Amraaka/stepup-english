import type { LookName } from "./looks";
import type { AccentName } from "./theme";

/** Which card body renders. "picture" is the original object-naming quiz. */
export type FormatName =
  | "picture"
  | "fix-mistake"
  | "silent-letter"
  | "gap-fill"
  | "word-stress"
  | "opposites"
  | "odd-one-out"
  | "sound-pair"
  | "unscramble"
  | "where-is-it"
  | "mini-dialogue";

export type QuizItem = {
  en: string;
  mn: string;
  /** US pronunciation, e.g. /ˈhed.laɪt/ */
  ipa?: string;
  imagePrompt?: string;
  /** Path inside public/, hand-authored SVG */
  image?: string | null;
  audio?: string | null;

  // --- per-format extras; each is only read by its own card body ---
  /** fix-mistake: the sentence as learners wrongly say it */
  wrong?: string;
  /** gap-fill: sentence with "___" marking the blank */
  sentence?: string;
  /** gap-fill (answer first), odd-one-out, sound-pair, where-is-it: the choices shown */
  options?: string[];
  /** where-is-it: the correct option, when `en` is the whole spoken sentence */
  answer?: string;
  /** sound-pair: IPA for each option, same order as `options`, shown at the reveal */
  hints?: string[];
  /** silent-letter: 0-based index of the letter that is not pronounced */
  silentIndex?: number;
  /** word-stress: syllables, and which one carries the stress */
  syllables?: string[];
  stressIndex?: number;
  /** opposites: the word shown (its opposite is `en`); mini-dialogue: what the other person says */
  prompt?: string;
};

export type Quiz = {
  slug: string;
  topic: string;
  /** Brand tone for this topic; defaults to coral */
  accent?: AccentName;
  /** Visual style: card (default), bold, night, editorial */
  look?: LookName;
  /** Card body to render; defaults to the original picture quiz */
  format?: FormatName;
  /** The question line above the card; each format has a sensible default */
  question?: string;
  /** Appended to every imagePrompt so the pictures match */
  style?: string;
  items: QuizItem[];
};
