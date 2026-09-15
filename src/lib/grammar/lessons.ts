import type { GrammarLevel, Lesson, PathEntry } from "@/lib/grammar/types";
import { presentSimple } from "@/content/grammar/present-simple";
import { presentContinuous } from "@/content/grammar/present-continuous";
import { pastSimple } from "@/content/grammar/past-simple";
import { pastContinuous } from "@/content/grammar/past-continuous";
import { presentPerfect } from "@/content/grammar/present-perfect";
import { willGoingTo } from "@/content/grammar/will-going-to";

export const LESSONS: Lesson[] = [presentSimple, presentContinuous, pastSimple, pastContinuous, willGoingTo, presentPerfect];

/** The full tense path in teaching order. Entries without a lesson show as "Тун удахгүй". */
export const TENSE_PATH: PathEntry[] = [
  { slug: "present-simple", title: "Present Simple", mn: "Одоо энгийн цаг", level: "A1" },
  { slug: "present-continuous", title: "Present Continuous", mn: "Одоо үргэлжлэх цаг", level: "A1" },
  { slug: "past-simple", title: "Past Simple", mn: "Өнгөрсөн энгийн цаг", level: "A1" },
  { slug: "past-continuous", title: "Past Continuous", mn: "Өнгөрсөн үргэлжлэх цаг", level: "A2" },
  { slug: "will-going-to", title: "will / be going to", mn: "Ирээдүй цаг", level: "A2" },
  { slug: "present-perfect", title: "Present Perfect", mn: "Одоо төгссөн цаг", level: "A2" },
  { slug: "present-perfect-continuous", title: "Present Perfect Continuous", mn: "Одоо төгссөн үргэлжлэх цаг", level: "B1" },
  { slug: "past-perfect", title: "Past Perfect", mn: "Өнгөрсөн төгссөн цаг", level: "B1" },
  { slug: "used-to", title: "used to / would", mn: "Өнгөрсөн дадал", level: "B1" },
  { slug: "future-continuous", title: "Future Continuous", mn: "Ирээдүй үргэлжлэх цаг", level: "B2" },
  { slug: "future-perfect", title: "Future Perfect", mn: "Ирээдүй төгссөн цаг", level: "B2" },
  { slug: "past-perfect-continuous", title: "Past Perfect Continuous", mn: "Өнгөрсөн төгссөн үргэлжлэх цаг", level: "B2" },
  { slug: "future-perfect-continuous", title: "Future Perfect Continuous", mn: "Ирээдүй төгссөн үргэлжлэх цаг", level: "C1" },
  { slug: "future-in-the-past", title: "was going to / would", mn: "Өнгөрсөн дэх ирээдүй", level: "C1" },
];

export const LEVEL_NAME: Record<GrammarLevel, string> = {
  A1: "Beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper-intermediate",
  C1: "Advanced",
};

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

/** The path entry after `slug` that already has a lesson. */
export function nextLesson(slug: string): PathEntry | undefined {
  const i = TENSE_PATH.findIndex((p) => p.slug === slug);
  return TENSE_PATH.slice(i + 1).find((p) => getLesson(p.slug));
}
