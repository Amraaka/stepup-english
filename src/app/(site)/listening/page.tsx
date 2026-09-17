import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { CLIPS, fmtClock } from "@/lib/listening/clips";
import { getCurrentUser } from "@/lib/auth";
import { contentProgressByRef } from "@/lib/content-progress";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
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

export default async function Page() {
  const user = await getCurrentUser();
  const progress = user ? await contentProgressByRef(user.id, "listening") : {};
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
          Бичлэгүүд
        </h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {CLIPS.map((c) => {
            const prog = progress[c.slug];
            return (
              <li key={c.slug}>
                <Link
                  href={`/listening/${c.slug}`}
                  className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold ${
                      prog?.completed ? "bg-mint text-ink-950" : `${t.soft} ${t.text}`
                    }`}
                  >
                    {prog?.completed ? <CheckIcon className="size-6 [stroke-width:2.6]" aria-label="Дууссан" /> : c.level}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-extrabold leading-snug">{c.title}</span>
                    <span className="mt-0.5 block text-sm text-muted">{c.summary}</span>
                    <span className="mt-1.5 flex items-center gap-3 text-xs font-semibold text-muted">
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
