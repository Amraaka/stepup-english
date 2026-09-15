"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { entryForLemma, POS_LABEL } from "@/lib/listening/glossary";
import { MIN_TIMED_SEC } from "@/lib/tracker";
import type { Card } from "@/lib/vocab/review";
import { reviewWordAction } from "@/app/(site)/vocabulary/actions";
import { useStats } from "@/components/stats-provider";
import { Mascot } from "@/components/mascot";
import { ProgressBar } from "@/components/game/progress-bar";
import { XIcon } from "@/components/icons";

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

/** The sentence with the saved word marked. */
function Sentence({ card }: { card: Card }) {
  const i = card.sentence.toLowerCase().indexOf(card.surface.toLowerCase());
  if (i < 0) return <>{card.sentence}</>;
  return (
    <>
      {card.sentence.slice(0, i)}
      <mark className="rounded bg-teal-soft px-0.5 font-bold text-teal-text">
        {card.sentence.slice(i, i + card.surface.length)}
      </mark>
      {card.sentence.slice(i + card.surface.length)}
    </>
  );
}

export function ReviewSession({ cards }: { cards: Card[] }) {
  const [queue, setQueue] = useState(cards);
  const [revealed, setRevealed] = useState(false);
  const [remembered, setRemembered] = useState(0);
  const [done, setDone] = useState(0);
  // Fixed at mount: a mid-session revalidation re-renders with an empty queue.
  const [total] = useState(cards.length);
  const card = queue[0];

  // Review time logs like listening time: visible tab only (ADR 0010).
  const { logTimed } = useStats();
  const logRef = useRef(logTimed);
  useEffect(() => {
    logRef.current = logTimed;
  }, [logTimed]);
  const pending = useRef(0);

  const flush = useCallback((celebrate: boolean) => {
    const seconds = pending.current;
    if (seconds < MIN_TIMED_SEC) return;
    pending.current = 0;
    logRef.current({ module: "vocabulary", ref: "review" }, seconds, celebrate);
  }, []);

  const finished = !card;
  useEffect(() => {
    if (finished) return;
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible") pending.current += 1;
    }, 1000);
    return () => window.clearInterval(tick);
  }, [finished]);

  useEffect(() => {
    if (finished) flush(true);
  }, [finished, flush]);

  useEffect(() => {
    const onVisibility = () => document.visibilityState === "hidden" && flush(false);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      flush(false);
    };
  }, [flush]);

  function answer(ok: boolean) {
    if (!card) return;
    void reviewWordAction(card.id, ok);
    setRevealed(false);
    if (ok) {
      setRemembered((n) => n + 1);
      setDone((n) => n + 1);
      setQueue((q) => q.slice(1));
    } else {
      // Forgotten cards come back at the end of this session.
      setQueue((q) => [...q.slice(1), q[0]]);
    }
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-surface px-6 py-10 text-center">
        <Mascot mood="cheer" className="size-24" />
        <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.02em]">
          {total > 0 ? "Өнөөдрийн давталт дууслаа!" : "Өнөөдөр давтах үг алга"}
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {total > 0
            ? `${total} үгийг давтлаа. Дараагийн давталтын өдөр нь ирэхэд эдгээр үг дахин гарч ирнэ.`
            : "Бичлэг сонсохдоо шинэ үг хадгалаад үзээрэй."}
        </p>
        <Link
          href="/vocabulary"
          className="press mt-6 flex h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-teal text-base font-extrabold text-ink-950 [--press:var(--teal-deep)]"
        >
          Үгийн сан руу буцах
        </Link>
      </div>
    );
  }

  const entry = entryForLemma(card.lemma);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/vocabulary"
          aria-label="Давталтыг дуусгах"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-muted hover:text-foreground"
        >
          <XIcon />
        </Link>
        <ProgressBar value={done} max={total} label="Давталтын явц" fill="bg-teal" className="h-2.5 flex-1" />
        <span className="w-12 text-right text-sm font-extrabold tabular-nums text-muted">
          {done}/{total}
        </span>
      </div>

      <section className="flex min-h-[340px] flex-col rounded-[28px] bg-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[34px] font-extrabold leading-tight tracking-[-0.02em]">{card.surface}</p>
          <button
            type="button"
            onClick={() => speak(card.surface)}
            aria-label="Дуудлагыг сонсох"
            className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-text"
          >
            <svg viewBox="0 0 20 20" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3.5 7.5v5h3l4 3.5v-12l-4 3.5h-3Z" />
              <path d="M13.5 7a4 4 0 0 1 0 6M15.8 4.8a7 7 0 0 1 0 10.4" />
            </svg>
          </button>
        </div>

        {card.sentence && (
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            <Sentence card={card} />
            <button
              type="button"
              onClick={() => speak(card.sentence)}
              className="ml-2 text-sm font-bold text-teal-text underline"
            >
              өгүүлбэрийг сонсох
            </button>
          </p>
        )}

        <div className="mt-auto pt-6">
          {revealed ? (
            <div className="rounded-2xl bg-canvas px-4 py-3">
              {entry ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-wide text-teal-text">
                    {POS_LABEL[entry.pos]}
                    {entry.lemma !== card.surface.toLowerCase() && entry.pos !== "name" && ` · ${entry.lemma}`}
                  </p>
                  <p className="mt-1 text-xl font-extrabold">{entry.mn}</p>
                  {entry.en && <p className="mt-1 text-sm text-muted">{entry.en}</p>}
                </>
              ) : (
                <p className="text-[15px] text-muted">Энэ үгийн тайлбар одоохондоо алга.</p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="h-14 w-full rounded-2xl border-2 border-line text-base font-extrabold transition-colors hover:bg-canvas"
            >
              Утгыг харах
            </button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => answer(false)}
          disabled={!revealed}
          className="press h-14 rounded-2xl bg-coral-soft text-base font-extrabold text-coral-a-text disabled:opacity-40"
        >
          Мартсан
        </button>
        <button
          type="button"
          onClick={() => answer(true)}
          disabled={!revealed}
          className="press h-14 rounded-2xl bg-teal text-base font-extrabold text-ink-950 [--press:var(--teal-deep)] disabled:opacity-40"
        >
          Санасан
        </button>
      </div>
      <p className="text-center text-xs text-muted">{remembered} үг санасан</p>
    </div>
  );
}
