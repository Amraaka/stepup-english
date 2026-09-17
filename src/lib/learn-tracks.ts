import "server-only";
import { getProfile, timedSecondsByRef } from "@/lib/activity";
import { cefrFor, type CefrLevel } from "@/lib/levels";
import { LEVEL_NAME, TENSE_PATH, nextPathEntry } from "@/lib/grammar/lessons";
import { dueReviewCount, progressBySlug } from "@/lib/grammar/progress";
import { CLIPS } from "@/lib/listening/clips";
import { TEXTS } from "@/lib/reading/texts";
import { dueWordCount, savedWordCount } from "@/lib/vocab/words";
import { contentProgressByRef, type ItemProgress } from "@/lib/content-progress";
import type { SkillId } from "@/lib/skills";
import type { LessonProgress } from "@/lib/grammar/types";

const NONE: Record<string, number> = {};
const DONE: Record<string, ItemProgress> = {};

/** One skill's line on the learn page: how far the learner is and what to open next. */
export type Track = {
  id: SkillId;
  /** finished items, e.g. "3/15 хичээл"; null when there's nothing to count */
  progress: { done: number; total: number; unit: string } | null;
  /** absent when there is nothing to open (e.g. writing) */
  next?: { href: string; label: string; title: string } | null;
  /** extra line under the card, e.g. reviews due */
  note: string | null;
};

export type LearnPlan = {
  /** CEFR band from onboarding; null for guests and "unsure" */
  level: CefrLevel | null;
  levelName: string | null;
  isGuest: boolean;
  tracks: Track[];
};

/**
 * First unfinished item, preferring the learner's level; `label` says whether it was already opened.
 * Once everything is finished, the one with the least time (again preferring the level), marked `again`.
 */
function pickNext<T extends { slug: string; level: CefrLevel }>(
  items: T[],
  done: Record<string, ItemProgress>,
  seconds: Record<string, number>,
  level: CefrLevel | null,
): { item: T; again: boolean; started: boolean } | undefined {
  const open = items.filter((i) => !done[i.slug]?.completed);
  const item = open.find((i) => i.level === level) ?? open[0];
  if (item) return { item, again: false, started: !!done[item.slug] || !!seconds[item.slug] };
  const least = (pool: T[]) =>
    pool.reduce<T | undefined>((a, b) => (!a || (seconds[b.slug] ?? 0) < (seconds[a.slug] ?? 0) ? b : a), undefined);
  const again = least(items.filter((i) => i.level === level)) ?? least(items);
  return again && { item: again, again: true, started: true };
}

const finished = (done: Record<string, ItemProgress>, slugs: string[]) => slugs.filter((s) => done[s]?.completed).length;

export async function getLearnPlan(userId: string | null): Promise<LearnPlan> {
  const profile = userId ? await getProfile(userId) : null;
  const tz = profile?.timezone ?? "Asia/Ulaanbaatar";
  const level = cefrFor(profile?.englishLevel);
  const [grammar, grammarDue, readSec, listenSec, speakSec, readDone, listenDone, speakDone, words, wordsDue] = userId
    ? await Promise.all([
        progressBySlug(userId),
        dueReviewCount(userId, tz),
        timedSecondsByRef(userId, "reading"),
        timedSecondsByRef(userId, "listening"),
        timedSecondsByRef(userId, "speaking"),
        contentProgressByRef(userId, "reading"),
        contentProgressByRef(userId, "listening"),
        contentProgressByRef(userId, "speaking"),
        savedWordCount(userId),
        dueWordCount(userId, tz),
      ])
    : [{} as Record<string, LessonProgress>, 0, NONE, NONE, NONE, DONE, DONE, DONE, 0, 0];

  const nextLesson = nextPathEntry(grammar, level);
  const nextText = pickNext(TEXTS, readDone, readSec, level);
  const nextClip = pickNext(CLIPS, listenDone, listenSec, level);
  const nextShadow = pickNext(CLIPS, speakDone, speakSec, level);
  const clipSlugs = CLIPS.map((c) => c.slug);

  const tracks: Track[] = [
    {
      id: "grammar",
      progress: {
        done: TENSE_PATH.filter((p) => grammar[p.slug]?.completed).length,
        total: TENSE_PATH.length,
        unit: "хичээл",
      },
      next: nextLesson
        ? { href: `/grammar/${nextLesson.slug}`, label: `Дараагийнх · ${nextLesson.level} хичээл`, title: nextLesson.title }
        : null,
      note: grammarDue > 0 ? `Давтах алдаа: ${grammarDue}` : null,
    },
    {
      id: "reading",
      progress: { done: finished(readDone, TEXTS.map((t) => t.slug)), total: TEXTS.length, unit: "эх" },
      next: nextText && {
        href: `/reading/${nextText.item.slug}`,
        label: nextText.again ? "Дахин унших" : `${nextText.started ? "Үргэлжлүүлэх" : "Дараагийнх"} · ${nextText.item.level} эх`,
        title: nextText.item.title,
      },
      note: null,
    },
    {
      id: "listening",
      progress: { done: finished(listenDone, clipSlugs), total: CLIPS.length, unit: "бичлэг" },
      next: nextClip && {
        href: `/listening/${nextClip.item.slug}`,
        label: nextClip.again
          ? "Дахин сонсох"
          : `${nextClip.started ? "Үргэлжлүүлэх" : "Дараагийнх"} · ${nextClip.item.level} бичлэг`,
        title: nextClip.item.title,
      },
      note: null,
    },
    {
      id: "speaking",
      progress: { done: finished(speakDone, clipSlugs), total: CLIPS.length, unit: "дадлага" },
      next: nextShadow && {
        href: `/listening/${nextShadow.item.slug}/shadowing`,
        label: nextShadow.again
          ? "Дахин дагаж хэлэх"
          : `${nextShadow.started ? "Үргэлжлүүлэх" : "Дараагийнх"} · Дагаж хэлэх`,
        title: nextShadow.item.title,
      },
      note: null,
    },
    {
      id: "vocabulary",
      progress: null,
      next:
        wordsDue > 0
          ? { href: "/vocabulary/review", label: "Өнөөдрийн давталт", title: `${wordsDue} үг давтах` }
          : null,
      note: userId
        ? words > 0
          ? `Хадгалсан ${words} үг`
          : "Уншиж, сонсохдоо үг дээр дарж хадгалаарай"
        : "Үг хадгалахын тулд нэвтэрнэ үү",
    },
    { id: "writing", progress: null, next: null, note: null },
  ];

  return { level, levelName: level ? LEVEL_NAME[level] : null, isGuest: !userId, tracks };
}
