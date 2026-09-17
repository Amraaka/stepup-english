"use client";

import { useState } from "react";
import { POS_LABEL } from "@/lib/dictionary/lookup";
import type { GlossEntry } from "@/lib/dictionary/types";
import { shortMeaning, type Card } from "@/lib/vocab/review";
import { checkTypedWord, type TypedResult } from "@/lib/vocab/answer";
import { hasCyrillic, latinGuesses } from "@/lib/text/keyboard";
import { useSentenceAudio } from "@/components/listening/use-sentence-audio";
import { CheckIcon, XIcon } from "@/components/icons";

// Card types for the word review (ADR 0010, 0018). Each card calls `onAnswer` once, when the learner moves on.

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

function SpeakerIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 7.5v5h3l4 3.5v-12l-4 3.5h-3Z" />
      <path d="M13.5 7a4 4 0 0 1 0 6M15.8 4.8a7 7 0 0 1 0 10.4" />
    </svg>
  );
}

const WORD_CHAR = /[\p{L}\p{N}]/u;

/** Where `surface` stands as a whole word in `sentence` (any case), or -1: "art" is not inside "Start". */
function findWord(sentence: string, surface: string): number {
  const hay = sentence.toLowerCase();
  const needle = surface.toLowerCase();
  if (!needle) return -1;
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) {
    if (!WORD_CHAR.test(hay[i - 1] ?? "") && !WORD_CHAR.test(hay[i + needle.length] ?? "")) return i;
  }
  return -1;
}

/** The sentence with the saved word marked, or hidden behind a blank. */
function Sentence({ card, blank = false }: { card: Card; blank?: boolean }) {
  const i = findWord(card.sentence, card.surface);
  if (i < 0) return <>{card.sentence}</>;
  return (
    <>
      {card.sentence.slice(0, i)}
      {blank ? (
        <span aria-label="хоосон зай" className="mx-0.5 inline-block w-16 border-b-2 border-teal align-baseline">
          &nbsp;
        </span>
      ) : (
        <mark className="rounded bg-teal-soft px-0.5 font-bold text-teal-text">
          {card.sentence.slice(i, i + card.surface.length)}
        </mark>
      )}
      {card.sentence.slice(i + card.surface.length)}
    </>
  );
}

/** The sentence with a button that plays it from the clip, or with TTS. */
function SentenceLine({ card, blank = false }: { card: Card; blank?: boolean }) {
  const clipAudio = useSentenceAudio(card.audio?.src ?? "");
  if (!card.sentence) return null;
  return (
    <p lang="en" className="mt-4 text-[17px] leading-relaxed text-muted">
      <Sentence card={card} blank={blank} />
      {!blank && (
        <button
          type="button"
          onClick={() => {
            const a = card.audio;
            if (a) clipAudio.playRange(a.start, a.end);
            else speak(card.sentence);
          }}
          className="ml-2 text-sm font-bold text-teal-text underline"
        >
          {card.audio ? "бичлэгээс сонсох" : "өгүүлбэрийг сонсох"}
        </button>
      )}
    </p>
  );
}

function Meaning({ entry, card }: { entry: GlossEntry | null; card: Card }) {
  if (!entry) return <p className="text-[15px] text-muted">Энэ үгийн тайлбар одоохондоо алга.</p>;
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-teal-text">
        {POS_LABEL[entry.pos]}
        {entry.lemma !== card.surface.toLowerCase() && entry.pos !== "name" && ` · ${entry.lemma}`}
      </p>
      <p className="mt-1 text-xl font-extrabold">{entry.mn}</p>
      {entry.en && <p className="mt-1 text-sm text-muted">{entry.en}</p>}
    </>
  );
}

function WordHeading({ card }: { card: Card }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <p lang="en" className="text-[34px] font-extrabold leading-tight tracking-[-0.02em]">
        {card.surface}
      </p>
      <button
        type="button"
        onClick={() => speak(card.surface)}
        aria-label="Дуудлагыг сонсох"
        className="grid size-12 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-text"
      >
        <SpeakerIcon className="size-6" />
      </button>
    </div>
  );
}

const cardClass = "flex min-h-[340px] flex-col rounded-[28px] bg-surface p-6";
const continueClass =
  "press h-14 w-full rounded-2xl bg-teal text-base font-extrabold text-ink-950 [--press:var(--teal-deep)]";

/**
 * The card's buttons. On phones they sit in a bar above the tab bar, so "Үргэлжлүүлэх" stays in reach after a
 * long card; from lg they follow the card. Same pattern as grammar practice. The session adds the spacer.
 */
function ActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(65px+env(safe-area-inset-bottom))] z-30 px-3 pb-2 lg:static lg:px-0 lg:pb-0">
      <div className="mx-auto max-w-md rounded-[24px] border border-line bg-surface/95 p-3 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-md lg:max-w-none lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
        {children}
      </div>
    </div>
  );
}

function Verdict({ ok, title, children }: { ok: boolean; title: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${ok ? "bg-mint-soft" : "bg-coral-soft"}`} aria-live="polite">
      <p className={`flex items-center gap-2 text-lg font-extrabold ${ok ? "text-mint-text" : "text-coral-a-text"}`}>
        {ok ? <CheckIcon className="size-5 [stroke-width:2.6]" /> : <XIcon className="size-5" />}
        {title}
      </p>
      {children}
    </div>
  );
}

// ── Flip: see the word, recall the meaning, rate yourself ──────────────────
export function FlipCard({ card, onAnswer }: { card: Card; onAnswer: (ok: boolean) => void }) {
  const [revealed, setRevealed] = useState(false);
  const { entry } = card;
  return (
    <>
      <section className={cardClass}>
        <WordHeading card={card} />
        <SentenceLine card={card} />
        <div className="mt-auto pt-6">
          {revealed ? (
            <div className="rounded-2xl bg-canvas px-4 py-3">
              <Meaning entry={entry} card={card} />
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

      <ActionBar>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onAnswer(false)}
            disabled={!revealed}
            className="press h-14 rounded-2xl bg-coral-soft text-base font-extrabold text-coral-a-text disabled:opacity-40"
          >
            Мартсан
          </button>
          <button
            type="button"
            onClick={() => onAnswer(true)}
            disabled={!revealed}
            className="press h-14 rounded-2xl bg-teal text-base font-extrabold text-ink-950 [--press:var(--teal-deep)] disabled:opacity-40"
          >
            Санасан
          </button>
        </div>
      </ActionBar>
    </>
  );
}

// ── Listen: hear the word, pick its meaning ────────────────────────────────
export function ListenCard({ card, onAnswer }: { card: Card; onAnswer: (ok: boolean) => void }) {
  const { entry } = card;
  const right = entry ? shortMeaning(entry.mn) : "";
  const [picked, setPicked] = useState<string | null>(null);
  const ok = picked === right;
  // No autoplay here: iOS Safari only speaks inside a tap, so the session says the word when it moves to this card.

  const optionClass = (o: string) => {
    const base = "min-h-14 rounded-2xl border-2 px-4 py-3 text-left text-[16px] font-bold transition-colors disabled:cursor-default";
    if (picked === null) return `${base} border-line hover:bg-canvas`;
    if (o === right) return `${base} border-mint bg-mint-soft text-mint-text`;
    if (o === picked) return `${base} border-coral-a bg-coral-soft text-coral-a-text`;
    return `${base} border-line opacity-60`;
  };

  return (
    <>
      <section className={cardClass}>
        <p className="text-xs font-extrabold uppercase tracking-wide text-teal-text">Сонсоод утгыг нь сонгоорой</p>
        {picked === null ? (
          <button
            type="button"
            onClick={() => speak(card.surface)}
            aria-label="Үгийг дахин сонсох"
            className="press mx-auto mt-5 grid size-24 place-items-center rounded-full bg-teal text-ink-950 [--press:var(--teal-deep)]"
          >
            <SpeakerIcon className="size-11" />
          </button>
        ) : (
          <div className="mt-3">
            <WordHeading card={card} />
            <SentenceLine card={card} />
          </div>
        )}
        <div className="mt-5 flex flex-col gap-2.5">
          {(card.choices ?? []).map((o) => (
            <button key={o} type="button" disabled={picked !== null} onClick={() => setPicked(o)} className={optionClass(o)}>
              {o}
            </button>
          ))}
        </div>
        {picked !== null && (
          <div className="mt-4">
            <Verdict ok={ok} title={ok ? "Зөв байна!" : "Буруу байна"}>
              {entry?.en && <p className="mt-1 text-sm text-muted">{entry.en}</p>}
            </Verdict>
          </div>
        )}
      </section>
      {picked !== null && (
        <ActionBar>
          <button type="button" autoFocus onClick={() => onAnswer(ok)} className={continueClass}>
            Үргэлжлүүлэх
          </button>
        </ActionBar>
      )}
    </>
  );
}

// ── Type: see the meaning, type the word ──────────────────────────────────
export function TypeCard({ card, onAnswer }: { card: Card; onAnswer: (ok: boolean) => void }) {
  const { entry } = card;
  const answers = [...new Set([card.surface, card.lemma])];
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState<TypedResult | null>(null);
  const [hint, setHint] = useState(false);
  // undefined: no warning; a string: what the Cyrillic input spells on an English keyboard; null: no guess.
  const [keyboard, setKeyboard] = useState<string | null | undefined>(undefined);

  function check(giveUp = false) {
    if (result) return;
    if (!giveUp && hasCyrillic(typed)) {
      const guesses = latinGuesses(typed);
      setKeyboard(guesses.find((g) => checkTypedWord(g, answers, card.confusable) !== "wrong") ?? guesses[0] ?? null);
      return;
    }
    setKeyboard(undefined);
    setResult(giveUp ? "wrong" : checkTypedWord(typed, answers, card.confusable));
  }

  return (
    <>
      <section className={cardClass}>
        <p className="text-xs font-extrabold uppercase tracking-wide text-teal-text">Утгаар нь англи үгийг бичээрэй</p>
        <div className="mt-3 rounded-2xl bg-canvas px-4 py-3">
          {entry && (
            <>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-text">{POS_LABEL[entry.pos]}</p>
              <p className="mt-1 text-xl font-extrabold">{entry.mn}</p>
            </>
          )}
        </div>
        {result === null ? <SentenceLine card={card} blank /> : <WordHeading card={card} />}
        {result !== null && <SentenceLine card={card} />}

        {result === null ? (
          <div className="mt-auto pt-5">
            <input
              value={typed}
              onChange={(e) => {
                setTyped(e.target.value);
                setKeyboard(undefined);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typed.trim()) check();
              }}
              lang="en"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              placeholder="Англи үгээ энд бичээрэй"
              aria-label="Хариулт"
              className="h-14 w-full rounded-2xl border-2 border-line bg-canvas px-4 text-[17px] outline-none transition-colors focus:border-teal focus:bg-surface"
            />
            {keyboard !== undefined && (
              <div role="alert" className="mt-2 rounded-2xl bg-sun-soft px-4 py-3 text-sm">
                <p className="font-bold">Гар тань кирилл үсэг дээр байна. Англи гар руу шилжүүлээд бичээрэй.</p>
                {keyboard && (
                  <button
                    type="button"
                    onClick={() => {
                      setTyped(keyboard);
                      setKeyboard(undefined);
                    }}
                    className="mt-1.5 font-extrabold text-teal-text underline"
                  >
                    «{keyboard}» гэж бичих гэсэн үү?
                  </button>
                )}
              </div>
            )}
            <div className="mt-2 flex items-center justify-between text-sm">
              <button type="button" onClick={() => setHint(true)} disabled={hint} className="font-bold text-teal-text disabled:text-muted">
                {hint ? `Эхний үсэг: ${card.surface[0]}` : "Сануулга"}
              </button>
              <button type="button" onClick={() => check(true)} className="font-bold text-muted hover:text-foreground">
                Мэдэхгүй байна
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-auto pt-5">
            <Verdict
              ok={result !== "wrong"}
              title={result === "right" ? "Зөв байна!" : result === "almost" ? "Бараг зөв!" : "Буруу байна"}
            >
              {result !== "right" && (
                <p className="mt-1 text-sm">
                  {result === "almost" ? "Зөв бичих нь" : "Зөв хариулт"}: <b lang="en">{card.surface}</b>
                </p>
              )}
              {result !== "right" && typed.trim() && (
                <p className="mt-0.5 text-sm text-muted">
                  Таны бичсэн: <span lang="en">{typed.trim()}</span>
                </p>
              )}
            </Verdict>
          </div>
        )}
      </section>

      <ActionBar>
        {result === null ? (
          <button type="button" onClick={() => check()} disabled={!typed.trim()} className={`${continueClass} disabled:opacity-40`}>
            Шалгах
          </button>
        ) : (
          <button type="button" autoFocus onClick={() => onAnswer(result !== "wrong")} className={continueClass}>
            Үргэлжлүүлэх
          </button>
        )}
      </ActionBar>
    </>
  );
}
