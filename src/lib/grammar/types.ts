import type { CefrLevel } from "@/lib/levels";

export type GrammarLevel = CefrLevel;

/** An English example with its Mongolian meaning. */
export type Example = { en: string; mn: string };

/**
 * One mark on a past · now · future line. Positions run from -1 (past) to 1 (future); 0 is now.
 * dot: a single finished moment; dots: repeated actions; span: an action in progress;
 * arrow: from a past point up to `to` (e.g. now).
 */
export type TimelineMark =
  | { type: "dot"; at: number; label?: string }
  | { type: "dots"; from: number; to: number; label?: string }
  | { type: "span"; from: number; to: number; label?: string }
  | { type: "arrow"; from: number; to: number; label?: string };

export type FormRow = { label: string; pattern: string; example: string };

export type Pitfall = { wrong: string; right: string; note: string };

export type ChoiceExercise = {
  kind: "choice";
  /** sentence with `___` where the answer goes */
  sentence: string;
  options: string[];
  answer: string;
  explain: string;
};

export type TypeExercise = {
  kind: "type";
  /** sentence with `___`; the base verb is shown as a hint */
  sentence: string;
  hint: string;
  /** every accepted answer; checking ignores case, extra spaces and ’ vs ' */
  answers: string[];
  explain: string;
};

export type PickExercise = {
  kind: "pick";
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
};

export type Exercise = ChoiceExercise | TypeExercise | PickExercise;

export type Lesson = {
  slug: string;
  /** English tense name, e.g. "Present Simple" */
  title: string;
  /** Mongolian name, e.g. "Одоо энгийн цаг" */
  mn: string;
  level: GrammarLevel;
  summary: string;
  uses: { title: string; body: string; examples: Example[] }[];
  timeline: { marks: TimelineMark[]; caption: string };
  form: FormRow[];
  signals: string[];
  pitfalls: Pitfall[];
  exercises: Exercise[];
};

/** Attribution for an example sentence taken from Tatoeba. */
export type Credit = { tatoebaId: number; author: string; license: string };

/** A reviewed gap-fill built from a Tatoeba sentence (`scripts/grammar/build_bank.py`). */
export type BankItem = {
  id: string;
  /** the lesson whose tense is the answer */
  slug: string;
  signal: string;
  sentence: string;
  answer: string;
  options: string[];
  explain: string;
  source: Credit;
};

/** One exercise in a session: lesson practice, a level checkpoint or the mistake review. */
export type PracticeItem = { slug: string; lessonTitle: string; key: string; exercise: Exercise; credit?: Credit };

/** What the learner gave for one item: typed text for `type`, the chosen option otherwise. Graded on the server. */
export type PracticeAnswer = { slug: string; key: string; answer: string };

/** Saved result for one lesson (members only). */
export type LessonProgress = { bestScore: number; total: number; completed: boolean };

/** A spot on the path; lessons not written yet show as "Тун удахгүй". */
export type PathEntry = { slug: string; title: string; mn: string; level: GrammarLevel };
