"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Card } from "@/lib/vocab/review";
import { reviewWordAction } from "@/app/(site)/vocabulary/actions";
import { useMeasuredTime } from "@/components/use-measured-time";
import { FlipCard, ListenCard, TypeCard, speak } from "@/components/vocabulary/cards";
import { Mascot } from "@/components/mascot";
import { ProgressBar } from "@/components/game/progress-bar";
import { XIcon } from "@/components/icons";

function UnsavedNotice({ count, className = "" }: { count: number; className?: string }) {
  if (count === 0) return null;
  return (
    <p role="alert" className={`rounded-2xl bg-sun-soft px-4 py-3 text-sm font-bold ${className}`}>
      {count} хариулт хадгалагдсангүй. Интернэтээ шалгаарай. Эдгээр үг дараагийн давталтад дахин гарна.
    </p>
  );
}

export function ReviewSession({ cards }: { cards: Card[] }) {
  const [queue, setQueue] = useState(cards);
  const [remembered, setRemembered] = useState(0);
  const [done, setDone] = useState(0);
  // Changes on every answer, so a card that comes back later mounts fresh.
  const [turn, setTurn] = useState(0);
  // Fixed at mount: a mid-session revalidation re-renders with an empty queue.
  const [total] = useState(cards.length);
  const card = queue[0];

  // Review time logs like listening time: visible tab only (ADR 0010).
  const finished = !card;
  const finishedRef = useRef(finished);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  const flush = useMeasuredTime({ module: "vocabulary", ref: "review" }, { counting: () => !finishedRef.current });
  useEffect(() => {
    if (finished) flush(true);
  }, [finished, flush]);

  // Answers the server didn't save (offline, expired session): the words keep their old box and come back.
  const [unsaved, setUnsaved] = useState(0);

  function answer(ok: boolean) {
    if (!card) return;
    reviewWordAction(card.id, ok)
      .catch(() => false)
      .then((saved) => {
        if (!saved) setUnsaved((n) => n + 1);
      });
    // iOS Safari only speaks inside a tap: say the next listen card's word now, not when it mounts (ADR 0018).
    const next = queue[1];
    if (next?.mode === "listen" && next.choices) speak(next.surface);
    setTurn((t) => t + 1);
    if (ok) {
      setRemembered((n) => n + 1);
      setDone((n) => n + 1);
      setQueue((q) => q.slice(1));
    } else {
      // Forgotten cards come back at the end of this session, as a flip card (box 0, ADR 0018).
      setQueue((q) => [...q.slice(1), { ...q[0], mode: "flip" }]);
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
            : "Бичлэг сонсох эсвэл эх уншихдаа шинэ үг хадгалаад үзээрэй."}
        </p>
        <UnsavedNotice count={unsaved} className="mt-4" />
        <Link
          href="/vocabulary"
          className="press mt-6 flex h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-teal text-base font-extrabold text-ink-950 [--press:var(--teal-deep)]"
        >
          Үгийн сан руу буцах
        </Link>
      </div>
    );
  }

  const Mode = card.mode === "listen" && card.choices ? ListenCard : card.mode === "type" ? TypeCard : FlipCard;

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

      <UnsavedNotice count={unsaved} />
      <Mode key={turn} card={card} onAnswer={answer} />

      <p className="text-center text-xs text-muted">{remembered} үг санасан</p>
      {/* Room for the card's button bar above the phone tab bar. */}
      <div aria-hidden className="h-24 lg:hidden" />
    </div>
  );
}
