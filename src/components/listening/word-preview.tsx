"use client";

import { speak } from "@/components/vocabulary/cards";
import { PlayIcon, SpeakerIcon } from "@/components/icons";

/** A word the learner probably doesn't know, at its first use in the clip (ADR 0022). */
export type PreviewWord = { lemma: string; meaning: string; sentence: number; token: number };

/**
 * "Look at these words first": the clip's likely-new words before the first listen.
 * Tapping a word opens the usual word sheet (with saving); `onStart` dismisses the card and plays.
 */
export function WordPreview({
  words,
  sentences,
  onTap,
  onStart,
  onDismiss,
}: {
  words: PreviewWord[];
  sentences: string[][];
  onTap: (sentence: number, token: number) => void;
  onStart: () => void;
  onDismiss: () => void;
}) {
  return (
    <section aria-labelledby="preview-h" className="rounded-3xl bg-surface p-4 sm:p-5">
      <p className="text-xs font-extrabold tracking-wide text-sky-text uppercase">Сонсохоос өмнө</p>
      <h2 id="preview-h" className="mt-1 text-lg font-extrabold leading-snug">
        Эхлээд эдгээр үгийг хар
      </h2>
      <p className="mt-0.5 text-sm text-muted">
        Энэ бичлэгт танд шинэ байж магадгүй {words.length} үг байна. Үгийг дарж хадгалж болно.
      </p>

      <ul className="mt-3 flex flex-col gap-2">
        {words.map((w) => {
          const tokens = sentences[w.sentence];
          return (
            <li key={w.lemma} className="rounded-2xl bg-canvas p-3">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onTap(w.sentence, w.token)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block text-[17px] font-extrabold leading-snug">{w.lemma}</span>
                  <span className="block text-[15px] leading-snug">{w.meaning}</span>
                </button>
                <button
                  type="button"
                  onClick={() => speak(w.lemma)}
                  aria-label={`«${w.lemma}» сонсох`}
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-surface text-sky-text transition-colors hover:bg-sky-soft"
                >
                  <SpeakerIcon className="size-5" />
                </button>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm italic text-muted">
                “
                {tokens.map((t, j) => (
                  <span key={j}>
                    {j > 0 && " "}
                    {j === w.token ? <b className="font-extrabold not-italic text-foreground">{t}</b> : t}
                  </span>
                ))}
                ”
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="h-12 flex-1 rounded-2xl bg-canvas px-4 text-sm font-extrabold transition-colors hover:bg-line"
        >
          Мэднэ
        </button>
        <button
          type="button"
          onClick={onStart}
          className="press flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-sky px-4 text-sm font-extrabold text-ink-950 [--press:var(--sky-deep)]"
        >
          Сонсож эхлэх
          <PlayIcon className="size-4" />
        </button>
      </div>
    </section>
  );
}
