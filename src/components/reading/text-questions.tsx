"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClipQuestion } from "@/lib/listening/types";
import { useMeasuredTime } from "@/components/use-measured-time";
import { ProgressBar } from "@/components/game/progress-bar";
import { Mascot } from "@/components/mascot";
import { CompletionNote } from "@/components/game/completion-note";
import { finishTextAction } from "@/app/(site)/reading/actions";
import { CheckIcon, XIcon } from "@/components/icons";

const primary =
  "press flex h-14 items-center justify-center rounded-2xl bg-mint px-4 text-base font-extrabold text-ink-950 [--press:var(--mint-deep)]";

/** Comprehension questions after a reading text. Time counts as reading for that text (ADR 0017). */
export function TextQuestions({ slug, questions }: { slug: string; questions: ClipQuestion[] }) {
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  // A new attempt remounts the note, so each finished run is saved once.
  const [attempt, setAttempt] = useState(0);

  const q = questions[idx] as ClipQuestion | undefined;
  const finished = !q;
  const finishedRef = useRef(finished);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  const flush = useMeasuredTime({ module: "reading", ref: slug }, { counting: () => !finishedRef.current });
  useEffect(() => {
    if (finished) flush(true);
  }, [finished, flush]);

  function check() {
    if (!q || choice === null || checked) return;
    setChecked(true);
    setAnswers((a) => [...a, q.options[choice]]);
    if (choice === q.answer) setScore((s) => s + 1);
  }

  function next() {
    setIdx((i) => i + 1);
    setChoice(null);
    setChecked(false);
  }

  function restart() {
    setIdx(0);
    setScore(0);
    setAnswers([]);
    setAttempt((n) => n + 1);
    setChoice(null);
    setChecked(false);
  }

  const save = useCallback(() => finishTextAction(slug, answers), [slug, answers]);

  if (!q) {
    const all = score === questions.length;
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-surface px-6 py-10 text-center">
        <Mascot mood={score / questions.length >= 0.7 ? "cheer" : "think"} className="size-24" />
        <h1 className="mt-4 text-3xl font-extrabold tabular-nums tracking-[-0.02em]">
          {score}/{questions.length} зөв
        </h1>
        <p className="mt-1 max-w-[36ch] text-[15px] text-muted">
          {all
            ? "Бүгдийг нь зөв хариуллаа, гоё байна!"
            : "Алдсан асуултынхаа хариултыг эхээс дахин олж уншаарай."}
        </p>
        <CompletionNote key={attempt} save={save} />
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link href={all ? "/reading" : `/reading/${slug}`} className={primary}>
            {all ? "Өөр эх унших" : "Эх рүү буцах"}
          </Link>
          <button type="button" onClick={restart} className="h-12 rounded-2xl text-sm font-extrabold text-mint-text hover:bg-canvas">
            Дахин хийх
          </button>
        </div>
      </div>
    );
  }

  const correct = choice === q.answer;
  const optionClass = (i: number) => {
    const base = "min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-[16px] font-bold transition-colors disabled:cursor-default";
    if (!checked) return `${base} ${choice === i ? "border-mint bg-mint-soft" : "border-line hover:bg-canvas"}`;
    if (i === q.answer) return `${base} border-mint bg-mint-soft text-mint-text`;
    if (i === choice) return `${base} border-coral-a bg-coral-soft text-coral-a-text`;
    return `${base} border-line opacity-60`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/reading/${slug}`}
          aria-label="Асуултаас гарах"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-muted hover:text-foreground"
        >
          <XIcon />
        </Link>
        <ProgressBar value={idx} max={questions.length} label="Асуултын явц" fill="bg-mint" className="h-2.5 flex-1" />
        <span className="w-12 text-right text-sm font-extrabold tabular-nums text-muted">
          {idx + 1}/{questions.length}
        </span>
      </div>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-mint-text">Ойлгосноо шалгаарай</p>
        <h1 lang="en" className="mt-3 text-[20px] font-extrabold leading-snug">
          {q.prompt}
        </h1>
        <div className="mt-4 flex flex-col gap-2.5" lang="en">
          {q.options.map((o, i) => (
            <button
              key={o}
              type="button"
              disabled={checked}
              aria-pressed={choice === i}
              onClick={() => setChoice(i)}
              className={optionClass(i)}
            >
              {o}
            </button>
          ))}
        </div>

        {checked && (
          <div className="mt-4 rounded-2xl bg-canvas px-4 py-3" aria-live="polite">
            <p className={`flex items-center gap-2 text-lg font-extrabold ${correct ? "text-mint-text" : "text-coral-a-text"}`}>
              {correct ? <CheckIcon className="size-5 [stroke-width:2.6]" /> : <XIcon className="size-5" />}
              {correct ? "Зөв байна!" : "Буруу байна"}
            </p>
            <p className="mt-1 text-sm text-muted">{q.explain}</p>
          </div>
        )}

        <div className="mt-5">
          {checked ? (
            <button type="button" onClick={next} autoFocus className={`${primary} w-full`}>
              {idx + 1 === questions.length ? "Дуусгах" : "Үргэлжлүүлэх"}
            </button>
          ) : (
            <button type="button" onClick={check} disabled={choice === null} className={`${primary} w-full disabled:opacity-40`}>
              Шалгах
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
