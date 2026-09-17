import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { getCurrentUser } from "@/lib/auth";
import { timedSecondsByRef } from "@/lib/activity";
import { CLIPS, shadowingSegments } from "@/lib/listening/clips";
import { pronunciationAvailable } from "@/lib/pronunciation/provider";
import { TONE } from "@/lib/tones";
import { SkillIcon } from "@/components/skill-icon";
import { LogButton } from "@/components/game/widgets";
import { SpeakingMinutes } from "@/components/speaking/speaking-minutes";
import { ChevronRightIcon, ClockIcon, MicIcon } from "@/components/icons";

const skill = getSkill("speaking");
const t = TONE[skill.tone];

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

export default async function Page() {
  const user = await getCurrentUser();
  // Shadowing logs speaking time with the clip slug as ref (ADR 0011).
  const secByClip = user ? await timedSecondsByRef(user.id, "speaking") : {};
  const ai = pronunciationAvailable();

  const tips = [
    "Өгүүлбэрийг эхлээд сонсоод, дараа нь чангаар дагаж хэлээрэй.",
    "Эх бичлэг, өөрийн бичлэгээ ээлжлэн сонсоод ялгааг нь олоорой.",
    ai
      ? "Бичлэг тань хадгалагдахгүй. AI үнэлгээ хүсвэл зөвхөн тэр нэг бичлэг илгээгдэнэ."
      : "Бичлэг тань зөвхөн таны төхөөрөмж дээр үлдэж, хаашаа ч илгээгдэхгүй.",
  ];
  const coming = ai ? skill.planned : [...skill.planned, "AI дуудлагын үнэлгээ, Монгол зөвлөгөөтэй"];

  return (
    <div className="flex flex-col gap-4">
      <section className={`rounded-[28px] ${t.soft} p-5 sm:p-7`}>
        <span className={`grid size-14 place-items-center rounded-2xl bg-surface ${t.icon}`}>
          <SkillIcon id="speaking" className="size-7" />
        </span>
        <h1 className="mt-4 text-[30px] font-extrabold leading-tight tracking-[-0.02em] lg:text-4xl">
          {skill.name} <span className="font-semibold text-muted">· {skill.english}</span>
        </h1>
        <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-muted">
          Бичлэгийн өгүүлбэр бүрийг сонсоод дагаж хэлж, өөрийн бичлэгтэйгээ харьцуулаарай. Дадлага хийсэн хугацаа
          тань автоматаар бүртгэгдэнэ.
        </p>
        <SpeakingMinutes />
        <LogButton module="speaking" className="mt-5">
          Өөр газар ярьсан цагаа бүртгэх
        </LogButton>
      </section>

      <section aria-labelledby="shadow-h">
        <h2 id="shadow-h" className="text-lg font-extrabold">
          Дуудлагын дадлага
        </h2>
        <p className="mt-1 text-sm text-muted">Сонсголын бичлэгүүдээс өгүүлбэр өгүүлбэрээр дагаж хэлнэ.</p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {CLIPS.map((c) => {
            const minutes = Math.floor((secByClip[c.slug] ?? 0) / 60);
            return (
              <li key={c.slug}>
                <Link
                  href={`/listening/${c.slug}/shadowing`}
                  className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${t.soft} ${t.icon}`}>
                    <MicIcon className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-extrabold leading-snug">{c.title}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted">
                      <span className={`rounded-full ${t.soft} px-2 py-0.5 font-extrabold ${t.text}`}>{c.level}</span>
                      <span className="tabular-nums">{shadowingSegments(c).length} өгүүлбэр</span>
                      {minutes > 0 && <span className="tabular-nums">{minutes} мин дадлага хийсэн</span>}
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
        <h2 className="text-lg font-extrabold">Хэрхэн дадлага хийх вэ?</h2>
        <ol className="mt-3 flex flex-col gap-2.5">
          {tips.map((tip, i) => (
            <li key={tip} className="flex items-start gap-3 text-[15px]">
              <span className={`grid size-6 shrink-0 place-items-center rounded-full ${t.soft} text-xs font-extrabold ${t.text}`}>
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-extrabold">Удахгүй нэмэгдэнэ</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {coming.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[15px] text-muted">
              <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${t.soft} ${t.icon}`}>
                <ClockIcon className="size-4" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
