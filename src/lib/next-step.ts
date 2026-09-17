import "server-only";
import { cefrFor } from "@/lib/levels";
import { getProfile } from "@/lib/activity";
import { LEVEL_NAME, TENSE_PATH, nextPathEntry } from "@/lib/grammar/lessons";
import { dueReviewCount, progressBySlug } from "@/lib/grammar/progress";
import { dueWordCount } from "@/lib/vocab/words";
import type { LessonProgress } from "@/lib/grammar/types";

/** The home page's "what to do now": one main lesson and any reviews due today. */
export type NextStep = {
  main: {
    href: string;
    /** "Эхлэх" for a fresh lesson, "Үргэлжлүүлэх" once the learner has tried it */
    action: string;
    /** skill, level and path position, shown under the title */
    meta: string;
    title: string;
    subtitle: string;
    /** lessons finished out of the path, for the progress line */
    done: number;
    total: number;
  };
  reviews: { href: string; label: string; count: number; tone: "teal" | "rose" }[];
};

export async function getNextStep(userId: string | null): Promise<NextStep> {
  const profile = userId ? await getProfile(userId) : null;
  const tz = profile?.timezone ?? "Asia/Ulaanbaatar";
  const [progress, grammarDue, wordsDue] = userId
    ? await Promise.all([progressBySlug(userId), dueReviewCount(userId, tz), dueWordCount(userId, tz)])
    : [{} as Record<string, LessonProgress>, 0, 0];

  const done = TENSE_PATH.filter((p) => progress[p.slug]?.completed).length;
  const next = nextPathEntry(progress, cefrFor(profile?.englishLevel));
  const main: NextStep["main"] = next
    ? {
        href: `/grammar/${next.slug}`,
        action: progress[next.slug] ? "Үргэлжлүүлэх" : "Эхлэх",
        meta: `Дүрэм · ${next.level} ${LEVEL_NAME[next.level]}`,
        title: next.title,
        subtitle: next.mn,
        done,
        total: TENSE_PATH.length,
      }
    : {
        href: "/reading",
        action: "Эх унших",
        meta: "Унших",
        title: "Бүх цагийг дуусгалаа",
        subtitle: "Одоо эх уншиж сурснаа хэрэглээрэй",
        done,
        total: TENSE_PATH.length,
      };

  const reviews: NextStep["reviews"] = [];
  if (wordsDue > 0) reviews.push({ href: "/vocabulary/review", label: "Үг давтах", count: wordsDue, tone: "teal" });
  if (grammarDue > 0) reviews.push({ href: "/grammar/review", label: "Алдаа давтах", count: grammarDue, tone: "rose" });
  return { main, reviews };
}
