"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Exercise } from "@/lib/grammar/types";
import { isTypedCorrect } from "@/lib/grammar/check";
import { useMeasuredTime } from "@/components/use-measured-time";
import { ProgressBar } from "@/components/game/progress-bar";
import { Mascot } from "@/components/mascot";
import { CheckIcon, XIcon } from "@/components/icons";

type LessonRef = { slug: string; title: string };

const LABEL: Record<Exercise["kind"], string> = {
  choice: "Хоосон зайд тохирох хариултыг сонгоорой",
  type: "Хаалтанд байгаа үйл үгийг зөв хэлбэрт оруулж бичээрэй",
  pick: "Зөв хариултыг сонгоорой",
};

function Sentence({ text, fill, tone }: { text: string; fill: string; tone: "idle" | "ok" | "bad" }) {
  const [before, after] = text.split("___");
  const cls = tone === "ok" ? "border-mint text-mint-text" : tone === "bad" ? "border-coral-a text-coral-a-text" : "border-rose";
  return (
    <p lang="en" className="text-[20px] leading-10">
      {before}
      <span className={`mx-0.5 inline-block min-w-20 border-b-2 px-1 text-center font-extrabold ${cls}`}>{fill || " "}</span>
      {after}
    </p>
  );
}

export function GrammarPractice({
  lesson,
  exercises,
  next,
}: {
  lesson: LessonRef;
  exercises: Exercise[];
  next: LessonRef | null;
}) {
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const item = exercises[idx] as Exercise | undefined;
  const finished = !item;

  const finishedRef = useRef(finished);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  const flush = useMeasuredTime({ module: "grammar", ref: lesson.slug }, { counting: () => !finishedRef.current });
  useEffect(() => {
    if (finished) flush(true);
  }, [finished, flush]);

  const checked = result !== null;
  const canCheck = !!item && !checked && (item.kind === "type" ? typed.trim() !== "" : choice !== null);

  function check() {
    if (!item || checked) return;
    const ok = item.kind === "type" ? isTypedCorrect(typed, item.answers) : choice === item.answer;
    if (ok) setScore((s) => s + 1);
    setResult(ok);
  }

  function advance() {
    setIdx((i) => i + 1);
    setChoice(null);
    setTyped("");
    setResult(null);
  }

  function restart() {
    advance();
    setIdx(0);
    setScore(0);
  }

  if (!item) {
    const ratio = exercises.length ? score / exercises.length : 0;
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-surface px-6 py-10 text-center">
        <Mascot mood={ratio >= 0.7 ? "cheer" : "think"} className="size-24" />
        <h1 className="mt-4 text-3xl font-extrabold tabular-nums tracking-[-0.02em]">
          {score}/{exercises.length} зөв
        </h1>
        <p className="mt-1 max-w-[36ch] text-[15px] text-muted">
          {score === exercises.length
            ? "Бүгдийг нь зөв хийлээ, гоё байна!"
            : ratio >= 0.7
              ? "Сайн байна! Алдсан дүрмээ хичээл дээрээ дахин хараарай."
              : "Хичээлээ дахин нэг уншаад, дахин оролдоод үзээрэй."}
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          {next && ratio >= 0.7 ? (
            <Link
              href={`/grammar/${next.slug}`}
              className="press flex h-14 items-center justify-center rounded-2xl bg-rose px-4 text-base font-extrabold text-ink-950 [--press:var(--rose-deep)]"
            >
              Дараагийнх: {next.title}
            </Link>
          ) : (
            <Link
              href={`/grammar/${lesson.slug}`}
              className="press flex h-14 items-center justify-center rounded-2xl bg-rose text-base font-extrabold text-ink-950 [--press:var(--rose-deep)]"
            >
              Хичээл рүү буцах
            </Link>
          )}
          <button type="button" onClick={restart} className="h-12 rounded-2xl text-sm font-extrabold text-rose-text hover:bg-canvas">
            Дахин хийх
          </button>
        </div>
      </div>
    );
  }

  const tone = !checked ? "idle" : result ? "ok" : "bad";
  const correctText = item.kind === "type" ? item.answers[0] : item.answer;

  const optionClass = (o: string) => {
    const base = "min-h-14 rounded-2xl border-2 px-4 py-3 text-[16px] font-bold transition-colors disabled:cursor-default";
    if (!checked) return `${base} ${choice === o ? "border-rose bg-rose-soft" : "border-line hover:bg-canvas"}`;
    if (o === correctText) return `${base} border-mint bg-mint-soft text-mint-text`;
    if (o === choice) return `${base} border-coral-a bg-coral-soft text-coral-a-text`;
    return `${base} border-line opacity-60`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/grammar/${lesson.slug}`}
          aria-label="Дасгалаас гарах"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-muted hover:text-foreground"
        >
          <XIcon />
        </Link>
        <ProgressBar value={idx} max={exercises.length} label="Дасгалын явц" fill="bg-rose" className="h-2.5 flex-1" />
        <span className="w-12 text-right text-sm font-extrabold tabular-nums text-muted">
          {idx + 1}/{exercises.length}
        </span>
      </div>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-rose-text">
          {lesson.title} · {LABEL[item.kind]}
        </p>

        {item.kind === "choice" && (
          <>
            <div className="mt-4">
              <Sentence text={item.sentence} fill={checked ? item.answer : (choice ?? "")} tone={tone} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5" lang="en">
              {item.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  disabled={checked}
                  aria-pressed={choice === o}
                  onClick={() => setChoice(o)}
                  className={`text-center ${optionClass(o)}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {item.kind === "type" && (
          <>
            <div className="mt-4">
              <Sentence text={item.sentence} fill={checked ? (result ? typed.trim() : correctText) : ""} tone={tone} />
              <p className="mt-2 text-sm text-muted">
                Үйл үг: <b lang="en">({item.hint})</b>
              </p>
            </div>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canCheck) check();
              }}
              disabled={checked}
              lang="en"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              placeholder="Хариултаа энд бичээрэй"
              aria-label="Хариулт"
              className="mt-4 h-14 w-full rounded-2xl border-2 border-line bg-canvas px-4 text-[17px] outline-none transition-colors focus:border-rose focus:bg-surface disabled:opacity-70"
            />
            {checked && !result && (
              <p className="mt-2 text-sm text-muted">
                Таны бичсэн: <span lang="en">{typed.trim()}</span>
              </p>
            )}
          </>
        )}

        {item.kind === "pick" && (
          <>
            <h1 className="mt-3 text-[20px] font-extrabold leading-snug">{item.prompt}</h1>
            <div className="mt-4 flex flex-col gap-2.5" lang="en">
              {item.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  disabled={checked}
                  aria-pressed={choice === o}
                  onClick={() => setChoice(o)}
                  className={`text-left ${optionClass(o)}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <div aria-hidden className="h-44 lg:hidden" />

      <div className="fixed inset-x-0 bottom-[calc(65px+env(safe-area-inset-bottom))] z-30 px-3 pb-2 lg:sticky lg:bottom-6 lg:px-0 lg:pb-0">
        <div
          className={`mx-auto max-w-md rounded-[24px] border p-3 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-md lg:max-w-none ${
            !checked ? "border-line bg-surface/95" : result ? "border-mint bg-mint-soft" : "border-coral-a/40 bg-coral-soft"
          }`}
        >
          {checked && (
            <div className="px-1 pb-3" aria-live="polite">
              <p className={`flex items-center gap-2 text-lg font-extrabold ${result ? "text-mint-text" : "text-coral-a-text"}`}>
                {result ? <CheckIcon className="size-5 [stroke-width:2.6]" /> : <XIcon className="size-5" />}
                {result ? "Зөв байна!" : "Буруу байна"}
              </p>
              {!result && (
                <p className="mt-1 text-sm">
                  Зөв хариулт: <b lang="en">{correctText}</b>
                </p>
              )}
              <p className="mt-1 text-sm text-muted">{item.explain}</p>
            </div>
          )}
          {checked ? (
            <button
              type="button"
              onClick={advance}
              autoFocus
              className={`press h-14 w-full rounded-2xl text-base font-extrabold text-ink-950 ${
                result ? "bg-mint [--press:var(--mint-deep)]" : "bg-coral-a"
              }`}
            >
              {idx + 1 === exercises.length ? "Дуусгах" : "Үргэлжлүүлэх"}
            </button>
          ) : (
            <button
              type="button"
              onClick={check}
              disabled={!canCheck}
              className="press h-14 w-full rounded-2xl bg-rose text-base font-extrabold text-ink-950 [--press:var(--rose-deep)] disabled:opacity-40"
            >
              Шалгах
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
