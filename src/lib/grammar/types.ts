export type GrammarLevel = "A1" | "A2" | "B1" | "B2" | "C1";

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

/** A spot on the path; lessons not written yet show as "Тун удахгүй". */
export type PathEntry = { slug: string; title: string; mn: string; level: GrammarLevel };
