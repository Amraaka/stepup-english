"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { POS_LABEL } from "@/lib/dictionary/lookup";
import type { GlossEntry } from "@/lib/dictionary/types";
import { CheckIcon, XIcon } from "@/components/icons";

export type WordPick = {
  /** Text as it appears in the transcript ("served", "give up"). */
  surface: string;
  entry: GlossEntry | null;
  /** The single tapped word, when the pick expanded to a phrase. */
  word?: { surface: string; entry: GlossEntry | null };
  sentence: string;
};

function Meaning({ surface, entry, size }: { surface: string; entry: GlossEntry | null; size: "lg" | "sm" }) {
  const showLemma = entry && entry.lemma !== surface.toLowerCase();
  return (
    <div>
      <p className={size === "lg" ? "text-[28px] font-extrabold leading-tight tracking-[-0.02em]" : "text-base font-extrabold"}>
        {surface}
        {showLemma && <span className="ml-2 text-sm font-semibold text-muted">← {entry.lemma}</span>}
      </p>
      {entry ? (
        <>
          <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-sky-text">{POS_LABEL[entry.pos]}</p>
          <p className={size === "lg" ? "mt-2 text-lg font-bold" : "mt-1 text-[15px] font-semibold"}>{entry.mn}</p>
          {entry.en && <p className="mt-1 text-sm text-muted">{entry.en}</p>}
        </>
      ) : (
        <p className="mt-2 text-[15px] text-muted">Энэ үгийн тайлбар одоохондоо алга.</p>
      )}
    </div>
  );
}

export type SaveState = "idle" | "saving" | "saved" | "failed" | "guest";

/** Bottom sheet with a tapped word's meaning. The player pauses while it is open. */
export function WordSheet({
  pick,
  onClose,
  save,
  onSave,
}: {
  pick: WordPick;
  onClose: () => void;
  /** null when the word has no glossary entry (nothing to review later). */
  save: SaveState | null;
  onSave: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panel.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Хаах"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/40"
      />
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${pick.surface} — тайлбар`}
        className="animate-sheet relative w-full max-w-md rounded-t-[28px] bg-surface px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 outline-none sm:rounded-[28px] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <Meaning surface={pick.surface} entry={pick.entry} size="lg" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Хаах"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-canvas text-muted transition-colors hover:text-foreground"
          >
            <XIcon />
          </button>
        </div>

        {pick.word && (
          <div className="mt-4 rounded-2xl bg-canvas px-4 py-3">
            <Meaning surface={pick.word.surface} entry={pick.word.entry} size="sm" />
          </div>
        )}

        <p className="mt-4 border-l-4 border-sky pl-3 text-[15px] leading-relaxed text-muted">{pick.sentence}</p>

        {save === "failed" && (
          <p role="alert" className="mt-4 text-sm font-bold text-coral-a-text">
            Хадгалж чадсангүй. Интернэтээ шалгаад дахин оролдоорой.
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          {save === "guest" && (
            <Link
              href="/login"
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-line px-3 text-center text-sm font-extrabold leading-tight"
            >
              Нэвтэрч үгээ хадгалах
            </Link>
          )}
          {(save === "idle" || save === "saving" || save === "saved" || save === "failed") && (
            <button
              type="button"
              onClick={onSave}
              disabled={save === "saving" || save === "saved"}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-teal text-base font-extrabold text-teal-text transition-colors disabled:cursor-default aria-disabled:opacity-60"
              aria-disabled={save === "saving"}
            >
              {save === "saved" ? (
                <>
                  <CheckIcon className="size-5 [stroke-width:2.4]" />
                  Хадгалсан
                </>
              ) : save === "saving" ? (
                "Хадгалж байна…"
              ) : save === "failed" ? (
                "Дахин оролдох"
              ) : (
                "Хадгалах"
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="press h-14 flex-1 rounded-2xl bg-sky text-base font-extrabold text-ink-950 [--press:var(--sky-deep)]"
          >
            Үргэлжлүүлэх
          </button>
        </div>
      </div>
    </div>
  );
}
