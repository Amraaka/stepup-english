import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { CLIPS, fmtClock } from "@/lib/listening/clips";
import { getCurrentUser } from "@/lib/auth";
import { contentProgressByRef, type ItemProgress } from "@/lib/content-progress";
import { coverage, type Fit } from "@/lib/dictionary/coverage";
import { currentLearner } from "@/lib/vocab/learner";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { CoverageRing, FIT_LABEL, FIT_PILL } from "@/components/words/coverage";
import { CheckIcon, ChevronRightIcon, ClockIcon } from "@/components/icons";

const skill = getSkill("listening");
const t = TONE[skill.tone];

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

const TIPS = [
  "Эхлээд текстгүйгээр сонсоод үзээрэй.",
  "Ойлгоогүй үгээ дарахад утга нь гарч ирнэ.",
  "Ойлгоогүй өгүүлбэрээ дахин сонсоорой, хурдыг нь 0.75x болгож болно.",
];

const FIT_ORDER: Fit[] = ["fit", "stretch", "hard"];

export default async function Page() {
  const user = await getCurrentUser();
  const [progress, learner] = await Promise.all([
    user ? contentProgressByRef(user.id, "listening") : ({} as Record<string, ItemProgress>),
    currentLearner(user?.id ?? null),
  ]);
  // Clips that suit the learner first (ADR 0022); the catalog order within each band.
  const clips = CLIPS.map((clip) => ({ clip, cov: coverage(clip.segments.map((s) => s.tokens), learner) })).sort(
    (a, b) => FIT_ORDER.indexOf(a.cov.fit) - FIT_ORDER.indexOf(b.cov.fit),
  );
  return (
    <div className="flex flex-col gap-4">
      <section className={`rounded-[28px] ${t.soft} p-5 sm:p-7`}>
        <span className={`grid size-14 place-items-center rounded-2xl bg-surface ${t.icon}`}>
          <SkillIcon id="listening" className="size-7" />
        </span>
        <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">
          {skill.name} <span className="font-semibold text-muted">· {skill.english}</span>
        </h1>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          Богино бичлэг сонсоод, ойлгоогүй үгээ дарж утгыг нь хараарай. Сонссон хугацаа тань автоматаар бүртгэгдэнэ.
        </p>
      </section>

      <section aria-labelledby="clips-h">
        <h2 id="clips-h" className="text-lg font-extrabold">
          Танд тохирох бичлэг
        </h2>
        <p className="mt-1 text-sm text-muted">
          Хувь нь бичлэгийн үгийн хэдийг нь та мэдэх вэ гэдгийг харуулна. 95%-иас дээш бол ойлгоход амар.
          {!learner.levelKnown && ` Таны түвшинг ${learner.level} гэж тооцлоо.`}
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {clips.map(({ clip: c, cov }) => {
            const prog = progress[c.slug];
            return (
              <li key={c.slug}>
                <Link
                  href={`/listening/${c.slug}`}
                  className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
                >
                  <CoverageRing percent={cov.percent} fit={cov.fit} className="size-14 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-extrabold leading-snug">{c.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{c.summary}</span>
                    <span className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${FIT_PILL[cov.fit]}`}>
                        {FIT_LABEL[cov.fit]}
                        {cov.fit !== "fit" && ` · ${cov.newWords.length} шинэ үг`}
                      </span>
                      {prog?.completed && (
                        <span className="flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-xs font-extrabold text-ink-950">
                          <CheckIcon className="size-3.5 [stroke-width:2.8]" />
                          Дууссан
                        </span>
                      )}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted">
                      <span className={`font-extrabold ${t.text}`}>{c.level}</span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="size-3.5" />
                        {fmtClock(c.durationSec)}
                      </span>
                      <span>{c.source.name}</span>
                      {prog && (
                        <span className="tabular-nums">
                          дасгал {prog.bestScore}/{prog.total}
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
        <h2 className="text-lg font-extrabold">Хэрхэн сонсох вэ?</h2>
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
