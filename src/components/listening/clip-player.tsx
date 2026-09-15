"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Clip } from "@/lib/listening/types";
import { fmtClock } from "@/lib/listening/clips";
import { lookupWord, phraseAt, wordKey } from "@/lib/listening/glossary";
import { saveWordAction } from "@/app/(site)/vocabulary/actions";
import { useStats } from "@/components/stats-provider";
import { useMeasuredTime } from "@/components/use-measured-time";
import { WordSheet, type WordPick } from "@/components/listening/word-sheet";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  TargetIcon,
} from "@/components/icons";

const EDGE_PUNCT = /^[“"(‘]+|[.,!?;:”")’…—]+$/g;

function isTappable(key: string): boolean {
  return key !== "" && !/^\d/.test(key);
}

/** Index of the sentence playing at `t` (the last one that has started). */
function activeIndex(clip: Clip, t: number): number {
  let idx = 0;
  for (let i = 0; i < clip.segments.length; i++) {
    if (clip.segments[i].start <= t + 0.05) idx = i;
    else break;
  }
  return idx;
}

export function ClipPlayer({ clip, savedLemmas }: { clip: Clip; savedLemmas: string[] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const segEls = useRef<(HTMLParagraphElement | null)[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [slow, setSlow] = useState(false);
  const [showText, setShowText] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [pick, setPick] = useState<WordPick | null>(null);
  const [marked, setMarked] = useState<{ seg: number; start: number; end: number } | null>(null);
  const resumeAfterPick = useRef(false);

  const keys = useMemo(() => clip.segments.map((s) => s.tokens.map(wordKey)), [clip]);
  const active = activeIndex(clip, time);

  // ── Playback ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!playing) return;
    let id = 0;
    const loop = () => {
      if (audio.current) setTime(audio.current.currentTime);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = slow ? 0.75 : 1;
  }, [slow]);

  const play = useCallback(() => {
    audio.current?.play().catch(() => setPlaying(false));
  }, []);

  function toggle() {
    if (!audio.current) return;
    if (audio.current.paused) play();
    else audio.current.pause();
  }

  function playFrom(i: number) {
    if (!audio.current) return;
    audio.current.currentTime = clip.segments[i].start;
    setTime(clip.segments[i].start);
    play();
  }

  // Keep the playing sentence in view, without fighting a reader who scrolls away briefly.
  useEffect(() => {
    if (!playing || !showText) return;
    const el = segEls.current[active];
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 96 || r.bottom > window.innerHeight - 220) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
    }
  }, [active, playing, showText]);

  // ── Word taps ───────────────────────────────────────────────────────────
  function tap(i: number, j: number) {
    const seg = clip.segments[i];
    const surface = (a: number, b: number) => seg.tokens.slice(a, b).join(" ").replace(EDGE_PUNCT, "");
    const word = { surface: surface(j, j + 1), entry: lookupWord(keys[i][j]) };
    const phrase = phraseAt(keys[i], j);
    setPick(
      phrase
        ? { surface: surface(phrase.start, phrase.end), entry: phrase.entry, word, sentence: seg.tokens.join(" ") }
        : { ...word, sentence: seg.tokens.join(" ") },
    );
    setMarked({ seg: i, start: phrase?.start ?? j, end: phrase?.end ?? j + 1 });
    resumeAfterPick.current = !!audio.current && !audio.current.paused;
    audio.current?.pause();
  }

  // ── Saving words (ADR 0010) ─────────────────────────────────────────────
  const [saved, setSaved] = useState(() => new Set(savedLemmas));
  const [saving, setSaving] = useState(false);

  async function saveCurrent() {
    const lemma = pick?.entry?.lemma;
    if (!pick || !lemma || !marked) return;
    setSaving(true);
    const ok = await saveWordAction({
      lemma,
      surface: pick.surface,
      sentence: pick.sentence,
      clip: clip.slug,
      seg: marked.seg,
    }).catch(() => false);
    setSaving(false);
    if (ok) setSaved((s) => new Set(s).add(lemma));
  }

  const closePick = useCallback(() => {
    setPick(null);
    setMarked(null);
    if (resumeAfterPick.current) play();
  }, [play]);

  // ── Automatic time logging (ADR 0009) ───────────────────────────────────
  // Counts seconds only while audio plays in a visible tab, capped at twice the clip.
  const { isGuest } = useStats();
  const flush = useMeasuredTime(
    { module: "listening", ref: clip.slug },
    { counting: () => !!audio.current && !audio.current.paused, maxSec: clip.durationSec * 2 },
  );

  function onEnded() {
    setPlaying(false);
    flush(true);
  }

  // ── Render ──────────────────────────────────────────────────────────────
  const iconBtn =
    "grid place-items-center rounded-full transition-colors disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky";

  return (
    <div className="flex flex-col gap-4">
      <audio
        ref={audio}
        src={clip.audio}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={onEnded}
        onTimeUpdate={(e) => !playing && setTime(e.currentTarget.currentTime)}
        onError={() => setLoadError(true)}
      />

      <header>
        <Link href="/listening" className="text-sm font-bold text-sky-text hover:underline">
          ← Сонсгол
        </Link>
        <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-balance lg:text-[32px]">
          {clip.title}
        </h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="rounded-full bg-sky-soft px-2.5 py-0.5 text-xs font-extrabold text-sky-text">{clip.level}</span>
          <span>{fmtClock(clip.durationSec)}</span>
          <span>{clip.source.name}</span>
        </p>
      </header>

      {loadError && (
        <p role="alert" className="rounded-2xl bg-coral-soft px-4 py-3 text-sm font-semibold text-coral-a-text">
          Бичлэгийг ачаалж чадсангүй. Сүлжээгээ шалгаад хуудсаа дахин ачаална уу.
        </p>
      )}

      {showText ? (
        <section aria-label="Текст" className="rounded-3xl bg-surface p-2 sm:p-3">
          {clip.segments.map((seg, i) => (
            <p
              key={i}
              ref={(el) => {
                segEls.current[i] = el;
              }}
              className={`rounded-2xl px-3 py-2 text-[17px] leading-9 transition-colors ${
                i === active && (playing || time > 0) ? "bg-sky-soft" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => playFrom(i)}
                aria-label={`${i + 1}-р өгүүлбэрээс сонсох`}
                className={`${iconBtn} mr-1.5 inline-grid size-7 bg-canvas align-[-5px] text-sky-text hover:bg-sky hover:text-ink-950`}
              >
                <PlayIcon className="size-3" />
              </button>
              {seg.tokens.map((tok, j) => {
                const on = marked?.seg === i && j >= marked.start && j < marked.end;
                return (
                  <Fragment key={j}>
                    {isTappable(keys[i][j]) ? (
                      <button
                        type="button"
                        onClick={() => tap(i, j)}
                        className={`-mx-0.5 rounded-md px-0.5 text-left transition-colors hover:bg-sky/25 ${
                          on ? "bg-sky text-ink-950" : ""
                        }`}
                      >
                        {tok}
                      </button>
                    ) : (
                      <span>{tok}</span>
                    )}{" "}
                  </Fragment>
                );
              })}
            </p>
          ))}
        </section>
      ) : (
        <section className="flex flex-col items-center rounded-3xl bg-surface px-5 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-sky-soft text-sky-text">
            <EyeOffIcon className="size-7" />
          </span>
          <p className="mt-3 text-lg font-extrabold">Текст нуугдсан байна</p>
          <p className="mt-1 max-w-[34ch] text-sm text-muted">
            Эхлээд чихээрээ сонсоод үзээрэй. Ойлгоогүй бол өгүүлбэрээ дахин сонсоорой.
          </p>
          <button
            type="button"
            onClick={() => setShowText(true)}
            className="press mt-4 h-12 rounded-2xl bg-sky px-5 text-sm font-extrabold text-ink-950 [--press:var(--sky-deep)]"
          >
            Текстийг харах
          </button>
        </section>
      )}

      <Link
        href={`/listening/${clip.slug}/practice`}
        className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-soft text-sky-text">
          <TargetIcon className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold">Дасгал хийх</span>
          <span className="mt-0.5 block text-sm text-muted">
            Асуултад хариулж, дутуу үгийг нөхөж, сонссон өгүүлбэрээ бичээрэй.
          </span>
        </span>
        <ChevronRightIcon className="size-5 shrink-0 text-muted" />
      </Link>

      <p className="px-1 text-xs text-muted">
        Эх сурвалж:{" "}
        <a href={clip.source.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
          {clip.source.credit}
        </a>
        . Public domain. Сонссон хугацаа тань автоматаар бүртгэгдэнэ.
      </p>

      {/* Room for the fixed control bar above the phone tab bar. */}
      <div aria-hidden className="h-32 lg:hidden" />

      <div className="fixed inset-x-0 bottom-[calc(65px+env(safe-area-inset-bottom))] z-30 px-3 pb-2 lg:sticky lg:bottom-6 lg:px-0 lg:pb-0">
        <div className="mx-auto max-w-md rounded-[24px] border border-line bg-surface/95 p-3 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-md lg:max-w-none">
          <div className="flex items-center gap-2.5 text-xs font-semibold tabular-nums text-muted">
            <span className="w-9 text-right">{fmtClock(time)}</span>
            <input
              type="range"
              min={0}
              max={clip.durationSec}
              step={0.1}
              value={Math.min(time, clip.durationSec)}
              onChange={(e) => {
                const t = Number(e.target.value);
                if (audio.current) audio.current.currentTime = t;
                setTime(t);
              }}
              aria-label="Бичлэгийн байрлал"
              className="h-6 min-w-0 flex-1 accent-[var(--sky)]"
            />
            <span className="w-9">{fmtClock(clip.durationSec)}</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <button
              type="button"
              aria-pressed={slow}
              onClick={() => setSlow((s) => !s)}
              className="h-11 w-16 rounded-full bg-canvas text-sm font-extrabold tabular-nums transition-colors aria-pressed:bg-ink-900 aria-pressed:text-ink-100 dark:aria-pressed:bg-ink-100 dark:aria-pressed:text-ink-950"
            >
              {slow ? "0.75x" : "1x"}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => playFrom(active)}
                aria-label="Өгүүлбэрийг дахин сонсох"
                className={`${iconBtn} size-12 bg-canvas hover:bg-sky-soft`}
              >
                <ReplayIcon className="size-6" />
              </button>
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Зогсоох" : "Тоглуулах"}
                className={`${iconBtn} press size-14 bg-sky text-ink-950 [--press:var(--sky-deep)]`}
              >
                {playing ? <PauseIcon className="size-6" /> : <PlayIcon className="ml-0.5 size-6" />}
              </button>
            </div>

            <button
              type="button"
              aria-pressed={!showText}
              onClick={() => setShowText((s) => !s)}
              aria-label={showText ? "Текстийг нуух" : "Текстийг харах"}
              className="grid h-11 w-16 place-items-center rounded-full bg-canvas transition-colors aria-pressed:bg-ink-900 aria-pressed:text-ink-100 dark:aria-pressed:bg-ink-100 dark:aria-pressed:text-ink-950"
            >
              {showText ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {pick && (
        <WordSheet
          pick={pick}
          onClose={closePick}
          save={
            !pick.entry
              ? null
              : isGuest
                ? "guest"
                : saved.has(pick.entry.lemma)
                  ? "saved"
                  : saving
                    ? "saving"
                    : "idle"
          }
          onSave={saveCurrent}
        />
      )}
    </div>
  );
}
