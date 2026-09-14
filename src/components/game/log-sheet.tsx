"use client";

import { useEffect, useRef, useState } from "react";
import { LOG_MODULES } from "@/lib/game";
import { pointsForStudyLog } from "@/lib/tracker";
import { BoltIcon, XIcon } from "@/components/icons";

const MINUTES = [5, 10, 15, 20, 30, 45, 60];

export function LogSheet({
  initialModule,
  isGuest,
  pending,
  error,
  onClose,
  onSubmit,
}: {
  initialModule: string;
  isGuest: boolean;
  pending: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (module: string, minutes: number) => void;
}) {
  const [module, setModule] = useState(initialModule);
  const [minutes, setMinutes] = useState(15);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const chip =
    "h-11 rounded-full px-4 text-sm font-bold transition-colors aria-pressed:bg-ink-900 aria-pressed:text-ink-100 dark:aria-pressed:bg-ink-100 dark:aria-pressed:text-ink-950";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Хаах"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/55"
      />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="log-title"
        className="animate-sheet relative w-full max-w-md rounded-t-[28px] bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 outline-none sm:rounded-[28px] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="log-title" className="text-xl font-extrabold tracking-[-0.02em]">
              Суралцсан цагаа бүртгэх
            </h2>
            <p className="mt-1 text-[13px] text-muted">Бага ч болов — өдөр бүр тоологдоно.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-canvas text-muted transition-colors hover:text-foreground"
          >
            <XIcon />
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2.5 text-sm font-extrabold">Юу хийсэн бэ?</legend>
          <div className="flex flex-wrap gap-2">
            {LOG_MODULES.map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={module === id}
                onClick={() => setModule(id)}
                className={`${chip} bg-canvas text-foreground`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-5">
          <legend className="mb-2.5 text-sm font-extrabold">Хэдэн минут?</legend>
          <div className="grid grid-cols-4 gap-2">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={minutes === m}
                onClick={() => setMinutes(m)}
                className="h-12 rounded-2xl bg-canvas text-[15px] font-extrabold tabular-nums transition-colors aria-pressed:bg-coral-a aria-pressed:text-ink-950"
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>

        <p className="mt-5 flex items-center gap-2 rounded-2xl bg-sun-soft px-4 py-3 text-sm font-bold text-sun-text">
          <BoltIcon className="size-5 fill-current" />
          +{pointsForStudyLog(minutes)} оноо авна
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm font-semibold text-coral-a-text">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={pending}
          onClick={() => onSubmit(module, minutes)}
          className="press mt-5 h-14 w-full rounded-2xl bg-coral-a text-base font-extrabold text-ink-950 disabled:opacity-60"
        >
          {pending ? "Бүртгэж байна…" : "Бүртгэх"}
        </button>
        {isGuest && (
          <p className="mt-3 text-center text-xs text-muted">
            Бүртгэлгүй үед зөвхөн энэ төхөөрөмжид хадгалагдана.
          </p>
        )}
      </div>
    </div>
  );
}
