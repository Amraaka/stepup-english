import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, timedSecondsByRef } from "@/lib/activity";
import { CEFR_LEVELS, cefrFor, type CefrLevel } from "@/lib/levels";
import { TEXTS, readingMinutes } from "@/lib/reading/texts";
import { contentProgressByRef, type ItemProgress } from "@/lib/content-progress";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { CheckIcon, ChevronRightIcon, ClockIcon } from "@/components/icons";

const skill = getSkill("reading");
const t = TONE[skill.tone];

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

const TIPS = [
  "Эхлээд бүтэн эхийг нэг уншаад, гол санааг нь ойлгохыг хичээгээрэй.",
  "Мэдэхгүй үг дээрээ дарахад утга нь гарч ирнэ. Хэрэгтэй үгээ хадгалаад давтаарай.",
  "Уншиж дуусаад асуултад хариулж, ойлгосноо шалгаарай.",
];

export default async function Page() {
  const user = await getCurrentUser();
  const [profile, secByText, progress] = user
    ? await Promise.all([getProfile(user.id), timedSecondsByRef(user.id, "reading"), contentProgressByRef(user.id, "reading")])
    : [null, {} as Record<string, number>, {} as Record<string, ItemProgress>];
  // The learner's own level first, then the rest from the easiest (ADR 0015).
  const mine = cefrFor(profile?.englishLevel);
  const rank = (level: CefrLevel) => (level === mine ? -1 : CEFR_LEVELS.indexOf(level));
  const texts = [...TEXTS].sort((a, b) => rank(a.level) - rank(b.level));

  return (
    <div className="flex flex-col gap-4">
      <section className={`rounded-[28px] ${t.soft} p-5 sm:p-7`}>
        <span className={`grid size-14 place-items-center rounded-2xl bg-surface ${t.icon}`}>
          <SkillIcon id="reading" className="size-7" />
        </span>
        <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">
          {skill.name} <span className="font-semibold text-muted">· {skill.english}</span>
        </h1>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          Түвшиндээ тохирсон эх уншаад, мэдэхгүй үг дээрээ дарж утгыг нь хараарай. Уншсан хугацаа тань автоматаар
          бүртгэгдэнэ.
        </p>
      </section>

      <section aria-labelledby="texts-h">
        <h2 id="texts-h" className="text-lg font-extrabold">
          Эхүүд
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {texts.map((text) => {
            const minutesRead = Math.floor((secByText[text.slug] ?? 0) / 60);
            const prog = progress[text.slug];
            return (
              <li key={text.slug}>
                <Link
                  href={`/reading/${text.slug}`}
                  className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold ${
                      prog?.completed ? "bg-mint text-ink-950" : `${t.soft} ${t.text}`
                    }`}
                  >
                    {prog?.completed ? <CheckIcon className="size-6 [stroke-width:2.6]" aria-label="Дууссан" /> : text.level}
                  </span>
                  <span className="min-w-0 flex-1">
                    {text.level === mine && (
                      <span className={`mb-1 inline-block rounded-full ${t.soft} px-2 py-0.5 text-[11px] font-extrabold ${t.text}`}>
                        Таны түвшин
                      </span>
                    )}
                    <span className="block text-[15px] font-extrabold leading-snug">{text.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{text.summary}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="size-3.5" />~{readingMinutes(text)} мин
                      </span>
                      <span>{text.source.name}</span>
                      {prog?.completed && <span>{text.level}</span>}
                      {minutesRead > 0 && <span className="tabular-nums">{minutesRead} мин уншсан</span>}
                      {prog && (
                        <span className="tabular-nums">
                          шилдэг {prog.bestScore}/{prog.total}
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronRightIcon className="size-5 shrink-0 text-muted" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Хэрхэн унших вэ?</h2>
        <ol className="mt-3 flex flex-col gap-2.5">
          {TIPS.map((tip, i) => (
            <li key={tip} className="flex items-start gap-3 text-[15px]">
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${t.soft} text-xs font-extrabold ${t.text}`}>
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
