import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { LEVEL_NAME, TENSE_PATH, getLesson } from "@/lib/grammar/lessons";
import type { GrammarLevel } from "@/lib/grammar/types";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { ChevronRightIcon } from "@/components/icons";

const skill = getSkill("grammar");
const t = TONE[skill.tone];

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

const LEVELS: GrammarLevel[] = ["A1", "A2", "B1", "B2", "C1"];

export default function Page() {
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
      </section>

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
                const body = (
                  <>
                    <span
                      className={`grid size-12 shrink-0 place-items-center rounded-2xl text-base font-extrabold tabular-nums ${
                        ready ? `${t.soft} ${t.text}` : "bg-canvas text-muted"
                      }`}
                    >
                      {n}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold leading-snug">{p.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{p.mn}</span>
                    </span>
                  </>
                );
                return (
                  <li key={p.slug}>
                    {ready ? (
                      <Link
                        href={`/grammar/${p.slug}`}
                        className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
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
          </section>
        );
      })}
    </div>
  );
}
