import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { cefrFor } from "@/lib/levels";
import { CHECKPOINT_SIZE, LEVELS, LEVEL_NAME, TENSE_PATH, checkpointSlug, getLesson, nextPathEntry } from "@/lib/grammar/lessons";
import { dueReviewCount, progressBySlug } from "@/lib/grammar/progress";
import type { GrammarLevel, LessonProgress } from "@/lib/grammar/types";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { CheckIcon, ChevronRightIcon, ReplayIcon, TargetIcon } from "@/components/icons";

const skill = getSkill("grammar");
const t = TONE[skill.tone];

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

/** Mixed test at the end of a level. */
function CheckpointCard({ level, progress }: { level: GrammarLevel; progress?: LessonProgress }) {
  const done = !!progress?.completed;
  return (
    <Link
      href={`/grammar/checkpoint/${level.toLowerCase()}`}
      className="mt-2.5 flex items-center gap-4 rounded-3xl border-2 border-dashed border-rose/40 p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
    >
      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-ink-950 ${done ? "bg-mint" : "bg-rose"}`}>
        {done ? <CheckIcon className="size-6 [stroke-width:2.6]" /> : <TargetIcon className="size-6" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-extrabold">{level} шалгалт</span>
        <span className="mt-0.5 block text-sm text-muted">
          {level} түвшний бүх цагаас {CHECKPOINT_SIZE} асуулт
          {progress && (
            <span className="tabular-nums">
              {" "}
              · шилдэг {progress.bestScore}/{progress.total}
            </span>
          )}
        </span>
      </span>
      <ChevronRightIcon className="size-5 shrink-0 text-muted" />
    </Link>
  );
}

export default async function Page() {
  const user = await getCurrentUser();
  const [progress, profile] = user
    ? await Promise.all([progressBySlug(user.id), getProfile(user.id)])
    : [{} as Record<string, LessonProgress>, null];
  // Same daily cap as the review page, so the card never promises items the session won't show.
  const due = user ? await dueReviewCount(user.id, profile?.timezone ?? "Asia/Ulaanbaatar") : 0;
  // "Next" starts at the learner's onboarding level; lessons below it stay open (ADR 0015).
  const nextSlug = user ? nextPathEntry(progress, cefrFor(profile?.englishLevel))?.slug : undefined;
  const doneCount = TENSE_PATH.filter((p) => progress[p.slug]?.completed).length;

  return (
    <div className="flex flex-col gap-4">
      <section className={`rounded-[28px] ${t.soft} p-5 sm:p-7`}>
        <span className={`grid size-14 place-items-center rounded-2xl bg-surface ${t.icon}`}>
          <SkillIcon id="grammar" className="size-7" />
        </span>
        <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">
          {skill.name} <span className="font-semibold text-muted">· {skill.english}</span>
        </h1>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          Англи хэлний бүх цагийг дарааллаар нь үзээрэй. Хичээл бүр монгол тайлбар, жишээ, дасгалтай.
        </p>
        {user ? (
          <p className="mt-3 text-sm font-extrabold tabular-nums">
            {doneCount}/{TENSE_PATH.length} хичээл дууссан
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">
            <Link href="/login" className="font-extrabold text-rose-text underline">
              Нэвтэрвэл
            </Link>{" "}
            ахиц тань хадгалагдаж, алдсан асуултууд тань давтагдана.
          </p>
        )}
      </section>

      {due > 0 && (
        <Link
          href="/grammar/review"
          className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
        >
          <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${t.solid} text-ink-950`}>
            <ReplayIcon className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-extrabold">Алдаагаа давтах</span>
            <span className="mt-0.5 block text-sm text-muted">Өмнө нь алдсан {due} асуулт давтах</span>
          </span>
          <ChevronRightIcon className="size-5 shrink-0 text-muted" />
        </Link>
      )}

      {LEVELS.map((level) => {
        const entries = TENSE_PATH.filter((p) => p.level === level);
        if (!entries.length) return null;
        return (
          <section key={level} aria-labelledby={`lvl-${level}`}>
            <h2 id={`lvl-${level}`} className="text-lg font-extrabold">
              {level} <span className="font-semibold text-muted">· {LEVEL_NAME[level]}</span>
            </h2>
            <ol className="mt-3 flex flex-col gap-2.5">
              {entries.map((p) => {
                const n = TENSE_PATH.indexOf(p) + 1;
                const ready = !!getLesson(p.slug);
                const prog = progress[p.slug];
                const done = !!prog?.completed;
                const isNext = p.slug === nextSlug;
                const body = (
                  <>
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-2xl text-base font-extrabold tabular-nums ${
                        done ? "bg-mint text-ink-950" : ready ? `${t.soft} ${t.text}` : "bg-canvas text-muted"
                      }`}
                    >
                      {done ? <CheckIcon className="size-6 [stroke-width:2.6]" /> : n}
                    </span>
                    <span className="min-w-0 flex-1">
                      {isNext && (
                        <span className={`mb-1 inline-block rounded-full ${t.soft} px-2 py-0.5 text-[11px] font-extrabold ${t.text}`}>
                          Дараагийнх
                        </span>
                      )}
                      <span className="block text-[15px] font-extrabold leading-snug">{p.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {p.mn}
                        {prog && (
                          <span className="tabular-nums">
                            {" "}
                            · шилдэг {prog.bestScore}/{prog.total}
                          </span>
                        )}
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={p.slug}>
                    {ready ? (
                      <Link
                        href={`/grammar/${p.slug}`}
                        aria-current={isNext ? "step" : undefined}
                        className={`flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5 ${
                          isNext ? "ring-2 ring-rose" : ""
                        }`}
                      >
                        {body}
                        <ChevronRightIcon className="size-5 shrink-0 text-muted" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 rounded-3xl bg-surface/60 p-4 sm:p-5">
                        {body}
                        <span className="shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-extrabold text-muted">
                          Тун удахгүй
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            <CheckpointCard level={level} progress={progress[checkpointSlug(level)]} />
          </section>
        );
      })}
    </div>
  );
}
