"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { checkDictation, type DictationResult, type Mark, type PracticeItem } from "@/lib/listening/exercises";
import { saveWordAction } from "@/app/(site)/vocabulary/actions";
import { useStats } from "@/components/stats-provider";
import { useMeasuredTime } from "@/components/use-measured-time";
import { useSentenceAudio } from "@/components/listening/use-sentence-audio";
import { ProgressBar } from "@/components/game/progress-bar";
import { Mascot } from "@/components/mascot";
import { CheckIcon, PauseIcon, PlayIcon, XIcon } from "@/components/icons";

type ClipInfo = { slug: string; title: string; audio: string };
type Outcome = { correct: boolean; dictation?: DictationResult; typed?: string };

const LABEL: Record<PracticeItem["kind"], string> = {
  question: "Ойлгосноо шалгаарай",
  gap: "Сонсоод зөв үгийг сонгоорой",
  dictation: "Сонссон өгүүлбэрээ бичээрэй",
};

const MARK_CLASS: Record<Mark, string> = {
  ok: "",
  close: "rounded bg-sun-soft px-0.5 text-sun-text",
  missed: "rounded bg-coral-soft px-0.5 font-bold text-coral-a-text",
};

export function PracticeSession({ clip, items }: { clip: ClipInfo; items: PracticeItem[] }) {
  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [score, setScore] = useState(0);
  const [slow, setSlow] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(() => new Set());
  const { isGuest } = useStats();
  const { playing, playRange, stop } = useSentenceAudio(clip.audio);

  const item = items[idx] as PracticeItem | undefined;
  const finished = !item;

  // Practice counts as listening time for this clip (same cumulative points window).
  const finishedRef = useRef(finished);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  const flush = useMeasuredTime({ module: "listening", ref: clip.slug }, { counting: () => !finishedRef.current });
  useEffect(() => {
    if (finished) flush(true);
  }, [finished, flush]);

  // Play the sentence when a listening item appears; the tap that got here counts as the gesture.
  // Keyed by id so a server re-render mid-session doesn't replay it.
  const audioKey = item && item.kind !== "question" ? item.id : null;
  const range = item && item.kind !== "question" ? { start: item.start, end: item.end } : null;
  const rangeRef = useRef(range);
  useEffect(() => {
    rangeRef.current = range;
  });
  useEffect(() => {
    if (audioKey && rangeRef.current) playRange(rangeRef.current.start, rangeRef.current.end);
    return stop;
  }, [audioKey, playRange, stop]);

  function replay() {
    if (!range) return;
    if (playing) stop();
    else playRange(range.start, range.end, slow ? 0.75 : 1);
  }

  const canCheck = !!item && !outcome && (item.kind === "dictation" ? typed.trim() !== "" : choice !== null);

  function check(skip = false) {
    if (!item || outcome) return;
    let result: Outcome;
    if (item.kind === "dictation") {
      const d = checkDictation(item.tokens, skip ? "" : typed);
      result = { correct: d.correct && !skip, dictation: d, typed: skip ? "" : typed.trim() };
    } else {
      result = { correct: choice === item.answer };
    }
    if (result.correct) setScore((s) => s + 1);
    setOutcome(result);
    stop();
  }

  function next() {
    setIdx((i) => i + 1);
    setChoice(null);
    setTyped("");
    setOutcome(null);
  }

  function restart() {
    next();
    setIdx(0);
    setScore(0);
  }

  async function saveGapWord() {
    if (!item || item.kind !== "gap") return;
    const { lemma } = item;
    const ok = await saveWordAction({
      lemma,
      surface: item.answer,
      sentence: item.sentence,
      clip: clip.slug,
      seg: item.seg,
    }).catch(() => false);
    if (ok) setSaved((s) => new Set(s).add(lemma));
  }

  if (!item) {
    const ratio = items.length ? score / items.length : 0;
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-surface px-6 py-10 text-center">
        <Mascot mood={ratio >= 0.7 ? "cheer" : "think"} className="size-24" />
        <h1 className="mt-4 text-3xl font-extrabold tabular-nums tracking-[-0.02em]">
          {score}/{items.length} зөв
        </h1>
        <p className="mt-1 max-w-[36ch] text-[15px] text-muted">
          {score === items.length
            ? "Бүгдийг нь зөв хийлээ, гоё байна!"
            : ratio >= 0.7
              ? "Сайн байна! Алдсан хэсгээ бичлэг дээрээ дахин сонсоорой."
              : "Бичлэгээ дахин нэг сонсоод, дахин оролдоод үзээрэй."}
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link
            href={`/listening/${clip.slug}`}
            className="press flex h-14 items-center justify-center rounded-2xl bg-sky text-base font-extrabold text-ink-950 [--press:var(--sky-deep)]"
          >
            Бичлэг рүү буцах
          </Link>
          <button type="button" onClick={restart} className="h-12 rounded-2xl text-sm font-extrabold text-sky-text hover:bg-canvas">
            Дахин хийх
          </button>
        </div>
      </div>
    );
  }

  const optionClass = (i: number, answer: number) => {
    const base = "rounded-2xl border-2 px-4 py-3 text-left text-[15px] font-bold transition-colors disabled:cursor-default";
    if (!outcome) return `${base} ${choice === i ? "border-sky bg-sky-soft" : "border-line hover:bg-canvas"}`;
    if (i === answer) return `${base} border-mint bg-mint-soft text-mint-text`;
    if (i === choice) return `${base} border-coral-a bg-coral-soft text-coral-a-text`;
    return `${base} border-line opacity-60`;
  };

  const correctText =
    item.kind === "question" ? item.options[item.answer] : item.kind === "gap" ? item.answer : item.tokens.join(" ");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href={`/listening/${clip.slug}`}
          aria-label="Дасгалаас гарах"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-muted hover:text-foreground"
        >
          <XIcon />
        </Link>
        <ProgressBar value={idx} max={items.length} label="Дасгалын явц" fill="bg-sky" className="h-2.5 flex-1" />
        <span className="w-12 text-right text-sm font-extrabold tabular-nums text-muted">
          {idx + 1}/{items.length}
        </span>
      </div>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-sky-text">{LABEL[item.kind]}</p>

        {item.kind !== "question" && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={replay}
              aria-label={playing ? "Зогсоох" : "Өгүүлбэрийг сонсох"}
              className="press grid size-16 place-items-center rounded-full bg-sky text-ink-950 [--press:var(--sky-deep)]"
            >
              {playing ? <PauseIcon className="size-7" /> : <PlayIcon className="ml-1 size-7" />}
            </button>
            <button
              type="button"
              aria-pressed={slow}
              onClick={() => setSlow((s) => !s)}
              className="h-11 w-16 rounded-full bg-canvas text-sm font-extrabold tabular-nums transition-colors aria-pressed:bg-ink-900 aria-pressed:text-ink-100 dark:aria-pressed:bg-ink-100 dark:aria-pressed:text-ink-950"
            >
              {slow ? "0.75x" : "1x"}
            </button>
          </div>
        )}

        {item.kind === "question" && (
          <>
            <h1 className="mt-3 text-[22px] font-extrabold leading-snug">{item.prompt}</h1>
            <div className="mt-4 flex flex-col gap-2.5">
              {item.options.map((o, i) => (
                <button
                  key={o}
                  type="button"
                  disabled={!!outcome}
                  aria-pressed={choice === i}
                  onClick={() => setChoice(i)}
                  className={`min-h-14 ${optionClass(i, item.answer)}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {item.kind === "gap" && (
          <>
            <p className="mt-5 text-[19px] leading-10">
              {item.before}{" "}
              <span
                className={`inline-block min-w-24 border-b-2 px-1 text-center font-extrabold ${
                  outcome ? (outcome.correct ? "border-mint text-mint-text" : "border-coral-a text-coral-a-text") : "border-sky"
                }`}
              >
                {outcome ? item.answer : choice !== null ? item.options[choice] : " "}
              </span>
              {item.trail} {item.after}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {item.options.map((o, i) => (
                <button
                  key={o}
                  type="button"
                  disabled={!!outcome}
                  aria-pressed={choice === i}
                  onClick={() => setChoice(i)}
                  className={`min-h-14 text-center ${optionClass(i, item.options.indexOf(item.answer))}`}
                >
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {item.kind === "dictation" &&
          (outcome?.dictation ? (
            <div className="mt-5">
              <p className="text-[19px] leading-9">
                {item.tokens.map((tok, i) => (
                  <span key={i}>
                    <span className={MARK_CLASS[outcome.dictation!.marks[i]]}>{tok}</span>{" "}
                  </span>
                ))}
              </p>
              {outcome.typed && <p className="mt-2 text-sm text-muted">Таны бичсэн: {outcome.typed}</p>}
              {outcome.dictation.extra.length > 0 && (
                <p className="mt-1 text-sm text-muted">Илүү бичсэн үг: {outcome.dictation.extra.join(", ")}</p>
              )}
              {!outcome.correct || outcome.dictation.marks.includes("close") ? (
                <p className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
                  <span className={MARK_CLASS.close}>шар: үсгийн алдаа</span>
                  <span className={MARK_CLASS.missed}>улаан: алдсан үг</span>
                </p>
              ) : null}
            </div>
          ) : (
            <textarea
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canCheck) check();
                }
              }}
              rows={3}
              lang="en"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Сонссон өгүүлбэрээ энд бичээрэй"
              aria-label="Сонссон өгүүлбэр"
              className="mt-5 w-full resize-none rounded-2xl border-2 border-line bg-canvas px-4 py-3 text-[17px] outline-none transition-colors focus:border-sky focus:bg-surface"
            />
          ))}
      </section>

      <div aria-hidden className="h-44 lg:hidden" />

      <div className="fixed inset-x-0 bottom-[calc(65px+env(safe-area-inset-bottom))] z-30 px-3 pb-2 lg:sticky lg:bottom-6 lg:px-0 lg:pb-0">
        <div
          className={`mx-auto max-w-md rounded-[24px] border p-3 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-md lg:max-w-none ${
            !outcome ? "border-line bg-surface/95" : outcome.correct ? "border-mint bg-mint-soft" : "border-coral-a/40 bg-coral-soft"
          }`}
        >
          {outcome && (
            <div className="px-1 pb-3">
              <p className={`flex items-center gap-2 text-lg font-extrabold ${outcome.correct ? "text-mint-text" : "text-coral-a-text"}`}>
                {outcome.correct ? <CheckIcon className="size-5 [stroke-width:2.6]" /> : <XIcon className="size-5" />}
                {outcome.correct
                  ? outcome.dictation?.marks.includes("close")
                    ? "Бараг зөв! Үсгийн алдаагаа хараарай."
                    : "Зөв байна!"
                  : item.kind === "dictation"
                    ? "Алдсан үгээ хараарай"
                    : "Буруу байна"}
              </p>
              {!outcome.correct && item.kind !== "dictation" && (
                <p className="mt-1 text-sm">
                  Зөв хариулт: <b>{correctText}</b>
                </p>
              )}
              {item.kind === "question" && <p className="mt-1 text-sm text-muted">{item.explain}</p>}
              {item.kind === "gap" && !outcome.correct && !isGuest && (
                <button
                  type="button"
                  onClick={saveGapWord}
                  disabled={saved.has(item.lemma)}
                  className="mt-2 text-sm font-extrabold text-teal-text underline disabled:no-underline"
                >
                  {saved.has(item.lemma) ? "Үгийн санд хадгалсан" : `"${item.answer}" үгийг хадгалах`}
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2.5">
            {!outcome && item.kind === "dictation" && (
              <button
                type="button"
                onClick={() => check(true)}
                className="h-14 rounded-2xl px-4 text-sm font-extrabold text-muted hover:bg-canvas"
              >
                Алгасах
              </button>
            )}
            {outcome ? (
              <button
                type="button"
                onClick={next}
                className={`press h-14 flex-1 rounded-2xl text-base font-extrabold text-ink-950 ${
                  outcome.correct ? "bg-mint [--press:var(--mint-deep)]" : "bg-coral-a"
                }`}
              >
                {idx + 1 === items.length ? "Дуусгах" : "Үргэлжлүүлэх"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => check()}
                disabled={!canCheck}
                className="press h-14 flex-1 rounded-2xl bg-sky text-base font-extrabold text-ink-950 [--press:var(--sky-deep)] disabled:opacity-40"
              >
                Шалгах
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
