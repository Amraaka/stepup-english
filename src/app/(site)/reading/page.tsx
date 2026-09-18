import type { Metadata } from "next";
import Link from "next/link";
import { getSkill } from "@/lib/skills";
import { getCurrentUser } from "@/lib/auth";
import { getProfile, timedSecondsByRef } from "@/lib/activity";
import { CEFR_LEVELS, cefrFor, type CefrLevel } from "@/lib/levels";
import { TEXTS, readingMinutes } from "@/lib/reading/texts";
import { TOPICS, getTopic } from "@/lib/reading/topics";
import type { ReadingText } from "@/lib/reading/types";
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

type SearchParams = Promise<{ topic?: string; level?: string }>;

/** `/reading` with the topic and level chips set; either may be left out. */
function filterHref(topic: string | null, level: CefrLevel | null): string {
  const q = new URLSearchParams();
  if (topic) q.set("topic", topic);
  if (level) q.set("level", level);
  const s = q.toString();
  return s ? `/reading?${s}` : "/reading";
}

const CHIP = "shrink-0 rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap transition-colors";
const chipTone = (on: boolean) => (on ? "bg-foreground text-background" : "bg-surface text-foreground hover:bg-line");

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const topic = getTopic(params.topic ?? "")?.id ?? null;
  const level = CEFR_LEVELS.find((l) => l === params.level) ?? null;

  const user = await getCurrentUser();
  const [profile, secByText, progress] = user
    ? await Promise.all([getProfile(user.id), timedSecondsByRef(user.id, "reading"), contentProgressByRef(user.id, "reading")])
    : [null, {} as Record<string, number>, {} as Record<string, ItemProgress>];
  // The learner's own level first, then the rest from the easiest (ADR 0015).
  const mine = cefrFor(profile?.englishLevel);
  const rank = (l: CefrLevel) => (l === mine ? -1 : CEFR_LEVELS.indexOf(l));
  const sorted = [...TEXTS].sort((a, b) => rank(a.level) - rank(b.level));

  const inLevel = sorted.filter((text) => !level || text.level === level);
  // Without a topic, texts are grouped under every topic that has some; with one, just that topic.
  const groups = TOPICS.filter((tp) => !topic || tp.id === topic)
    .map((tp) => ({ topic: tp, texts: inLevel.filter((text) => text.topic === tp.id) }))
    .filter((g) => g.texts.length > 0);
  const countIn = (id: string) => TEXTS.filter((text) => text.topic === id && (!level || text.level === level)).length;

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
          Сонирхсон сэдвээ, түвшиндээ тохирсон эхээ сонгоод уншаарай. Мэдэхгүй үг дээрээ дарахад утга нь гарна. Уншсан
          хугацаа тань автоматаар бүртгэгдэнэ.
        </p>
      </section>

      <nav aria-label="Шүүлтүүр" className="flex flex-col gap-2">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href={filterHref(null, level)} aria-current={!topic ? "page" : undefined} className={`${CHIP} ${chipTone(!topic)}`}>
            Бүх сэдэв
          </Link>
          {TOPICS.map((tp) => {
            const n = countIn(tp.id);
            if (!n && topic !== tp.id) return null;
            const on = topic === tp.id;
            return (
              <Link key={tp.id} href={filterHref(tp.id, level)} aria-current={on ? "page" : undefined} className={`${CHIP} ${chipTone(on)}`}>
                {tp.name} <span className={on ? "opacity-70" : "text-muted"}>{n}</span>
              </Link>
            );
          })}
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <Link href={filterHref(topic, null)} aria-current={!level ? "page" : undefined} className={`${CHIP} ${chipTone(!level)}`}>
            Бүх түвшин
          </Link>
          {CEFR_LEVELS.map((l) => (
            <Link
              key={l}
              href={filterHref(topic, l)}
              aria-current={level === l ? "page" : undefined}
              className={`${CHIP} ${chipTone(level === l)}`}
            >
              {l}
              {l === mine && <span className={level === l ? "opacity-70" : "text-muted"}> · таны</span>}
            </Link>
          ))}
        </div>
      </nav>

      {groups.length === 0 && (
        <section className="rounded-3xl bg-surface p-5 text-[15px] sm:p-6">
          <p className="font-extrabold">Энд тохирох эх одоохондоо алга.</p>
          <p className="mt-1 text-muted">Удахгүй нэмэгдэнэ. Өөр түвшин эсвэл сэдэв сонгоод үзээрэй.</p>
          <Link href={filterHref(topic, null)} className="mt-3 inline-block font-bold underline">
            Бүх түвшнийг харах
          </Link>
        </section>
      )}

      {groups.map((g) => (
        <section key={g.topic.id} aria-labelledby={`topic-${g.topic.id}`}>
          <h2 id={`topic-${g.topic.id}`} className="flex items-baseline gap-2 text-lg font-extrabold">
            {g.topic.name} <span className="text-sm font-semibold text-muted">· {g.topic.english}</span>
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {g.texts.map((text) => (
              <TextCard key={text.slug} text={text} mine={mine} secRead={secByText[text.slug] ?? 0} prog={progress[text.slug]} />
            ))}
          </ul>
        </section>
      ))}

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

function TextCard({
  text,
  mine,
  secRead,
  prog,
}: {
  text: ReadingText;
  mine: CefrLevel | null;
  secRead: number;
  prog: ItemProgress | undefined;
}) {
  const minutesRead = Math.floor(secRead / 60);
  return (
    <li>
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
}
