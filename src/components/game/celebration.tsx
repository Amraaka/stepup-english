"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { WeekDay } from "@/lib/tracker";
import { Mascot } from "@/components/mascot";
import { WeekStrip } from "@/components/game/week-strip";
import { BoltIcon } from "@/components/icons";

export type CelebrationData = {
  /** first log of the day — the streak moment */
  firstToday: boolean;
  streak: number;
  earned: number;
  todayMinutes: number;
  /** day history; the strip shows its current calendar week */
  days: WeekDay[];
  isGuest: boolean;
};

export function Celebration({ data, onClose }: { data: CelebrationData; onClose: () => void }) {
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    button.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebrate-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-ink-950 text-ink-100"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(50%_50%_at_50%_40%,rgb(255_90_60/0.42),transparent_70%)]"
      />
      <div className="relative mx-auto flex min-h-dvh max-w-sm flex-col items-center px-5 pb-8 pt-14 text-center">
        <Mascot mood="cheer" className="animate-rise size-44" />

        {data.firstToday ? (
          <>
            <p className="animate-pop mt-2 text-[112px] font-extrabold leading-none tracking-[-0.04em] text-coral-a tabular-nums">
              {data.streak}
            </p>
            <h2 id="celebrate-title" className="text-[26px] font-extrabold tracking-[-0.02em]">
              хоног дараалан!
            </h2>
            <p className="mt-2 text-sm text-ink-400">Өдөр бүр жаахан ахих нь хамгийн том ялалт.</p>
          </>
        ) : (
          <>
            <p className="animate-pop mt-2 text-[96px] font-extrabold leading-none tracking-[-0.04em] text-sun tabular-nums">
              +{data.earned}
            </p>
            <h2 id="celebrate-title" className="text-[26px] font-extrabold tracking-[-0.02em]">
              оноо нэмэгдлээ
            </h2>
            <p className="mt-2 text-sm text-ink-400">
              Өнөөдөр нийт {data.todayMinutes} минут суралцлаа.
            </p>
          </>
        )}

        <div className="mt-7 w-full rounded-[22px] bg-white/6 p-3.5">
          <WeekStrip days={data.days} dark />
        </div>

        {data.firstToday && data.earned > 0 && (
          <p className="mt-4 flex h-9 items-center gap-2 rounded-full bg-sun/15 px-3.5 text-[13px] font-extrabold text-sun">
            <BoltIcon className="size-4 fill-current" />+{data.earned} оноо
          </p>
        )}

        <div className="min-h-8 flex-1" />
        <div className="flex w-full flex-col gap-2.5">
          <button
            ref={button}
            type="button"
            onClick={onClose}
            className="press h-14 rounded-2xl bg-coral-a text-base font-extrabold text-ink-950"
          >
            Үргэлжлүүлэх
          </button>
          {data.isGuest && (
            <Link
              href="/login?mode=signup"
              onClick={onClose}
              className="flex h-13 items-center justify-center rounded-2xl border border-white/20 text-[15px] font-bold"
            >
              Бүртгүүлж явцаа хадгалах
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
