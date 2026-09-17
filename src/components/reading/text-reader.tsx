"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { ReadingText } from "@/lib/reading/types";
import type { Glossary } from "@/lib/dictionary/lookup";
import { useMeasuredTime } from "@/components/use-measured-time";
import { useWordPick } from "@/components/words/use-word-pick";
import { TappableTokens } from "@/components/words/tappable-tokens";
import { ChevronLeftIcon, ChevronRightIcon, ClockIcon, TargetIcon } from "@/components/icons";

/**
 * Reading time counts while the tab is visible and the learner did anything in the last 5 minutes.
 * A careful reader can sit on one screen for minutes, so moving the pointer or focusing the tab counts too.
 * There is no whole-visit cap here; the server caps each flush (src/lib/timed.ts).
 */
const IDLE_MS = 300_000;

export function TextReader({
  text,
  glossary,
  savedLemmas,
  minutes,
}: {
  text: ReadingText;
  glossary: Glossary;
  savedLemmas: string[];
  minutes: number;
}) {
  // Sentences in reading order; a saved word stores the paragraph its sentence is in (ADR 0016).
  const { sentences, paraOf, firstOf } = useMemo(() => {
    const sentences: string[][] = [];
    const paraOf: number[] = [];
    const firstOf: number[] = [];
    text.paragraphs.forEach((paragraph, p) => {
      firstOf.push(sentences.length);
      for (const sentence of paragraph) {
        sentences.push(sentence);
        paraOf.push(p);
      }
    });
    return { sentences, paraOf, firstOf };
  }, [text]);

  const words = useWordPick({
    sentences,
    glossary,
    savedLemmas,
    source: (i) => ({ kind: "text", text: text.slug, para: paraOf[i] }),
  });

  // ── Automatic time logging (ADR 0017) ───────────────────────────────────
  const lastActive = useRef(0);
  useEffect(() => {
    const mark = () => {
      lastActive.current = Date.now();
    };
    mark();
    const events = ["scroll", "pointerdown", "pointermove", "touchmove", "wheel", "keydown", "focus"] as const;
    for (const e of events) window.addEventListener(e, mark, { passive: true });
    return () => {
      for (const e of events) window.removeEventListener(e, mark);
    };
  }, []);
  useMeasuredTime({ module: "reading", ref: text.slug }, { counting: () => Date.now() - lastActive.current < IDLE_MS });

  return (
    <div className="flex flex-col gap-4">
      <header>
        <Link
          href="/reading"
          className="-ml-1 inline-flex items-center gap-0.5 text-sm font-bold text-mint-text hover:underline"
        >
          <ChevronLeftIcon className="size-4 [stroke-width:2.2]" />
          Унших
        </Link>
        <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance lg:text-[32px]">
          {text.title}
        </h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="rounded-full bg-mint-soft px-2.5 py-0.5 text-xs font-extrabold text-mint-text">{text.level}</span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3.5" />~{minutes} мин
          </span>
          <span>{text.source.name}</span>
        </p>
        <p className="mt-2 text-sm text-muted">Мэдэхгүй үг дээрээ дарж утгыг нь хараарай.</p>
      </header>

      <article lang="en" className="flex flex-col gap-4 rounded-3xl bg-surface px-5 py-5 text-[17px] leading-9 sm:px-7 sm:py-6">
        {text.paragraphs.map((paragraph, p) => (
          <p key={p}>
            {paragraph.map((sentence, s) => {
              const i = firstOf[p] + s;
              return (
                <TappableTokens
                  key={s}
                  tokens={sentence}
                  keys={words.keys[i]}
                  marked={words.markedIn(i)}
                  onTap={(j) => words.tap(i, j)}
                  hoverClass="hover:bg-mint/25"
                  onClass="bg-mint text-ink-950"
                />
              );
            })}
          </p>
        ))}
      </article>

      <Link
        href={`/reading/${text.slug}/questions`}
        className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-mint-soft text-mint-text">
          <TargetIcon className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold">Ойлгосноо шалгах</span>
          <span className="mt-0.5 block text-sm text-muted">{text.questions.length} асуултад хариулаарай.</span>
        </span>
        <ChevronRightIcon className="size-5 shrink-0 text-muted" />
      </Link>

      <p className="px-1 text-xs text-muted">
        Эх сурвалж:{" "}
        <a href={text.source.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
          {text.source.credit}
        </a>
        . Public domain. Уншсан хугацаа тань автоматаар бүртгэгдэнэ.
      </p>

      {words.sheet}
    </div>
  );
}
