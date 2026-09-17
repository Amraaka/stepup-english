"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Clip } from "@/lib/listening/types";
import type { Glossary } from "@/lib/dictionary/lookup";
import { fmtClock } from "@/lib/listening/clips";
import { useMeasuredTime } from "@/components/use-measured-time";
import { useWordPick } from "@/components/words/use-word-pick";
import { TappableTokens } from "@/components/words/tappable-tokens";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  MicIcon,
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  TargetIcon,
} from "@/components/icons";

/** Index of the sentence playing at `t` (the last one that has started). */
function activeIndex(clip: Clip, t: number): number {
  let idx = 0;
  for (let i = 0; i < clip.segments.length; i++) {
    if (clip.segments[i].start <= t + 0.05) idx = i;
    else break;
  }
  return idx;
}

export function ClipPlayer({ clip, glossary, savedLemmas }: { clip: Clip; glossary: Glossary; savedLemmas: string[] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const segEls = useRef<(HTMLParagraphElement | null)[]>([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [slow, setSlow] = useState(false);
  const [showText, setShowText] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const resumeAfterPick = useRef(false);
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

  // ── Word taps and saving (ADR 0010, 0016) ───────────────────────────────
  // The player pauses while a word sheet is open and resumes when it closes.
  const sentences = useMemo(() => clip.segments.map((s) => s.tokens), [clip]);
  const words = useWordPick({
    sentences,
    glossary,
    savedLemmas,
    source: (seg) => ({ kind: "clip", clip: clip.slug, seg }),
    onOpen: () => {
      resumeAfterPick.current = !!audio.current && !audio.current.paused;
      audio.current?.pause();
    },
    onClose: () => {
      if (resumeAfterPick.current) play();
    },
  });

  // ── Automatic time logging (ADR 0009) ───────────────────────────────────
  // Counts seconds only while audio plays in a visible tab, capped at twice the clip.
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
        <Link
          href="/listening"
          className="-ml-1 inline-flex items-center gap-0.5 text-sm font-bold text-sky-text hover:underline"
        >
          <ChevronLeftIcon className="size-4 [stroke-width:2.2]" />
          Сонсгол
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
              <TappableTokens
                tokens={seg.tokens}
                keys={words.keys[i]}
                marked={words.markedIn(i)}
                onTap={(j) => words.tap(i, j)}
                hoverClass="hover:bg-sky/25"
                onClass="bg-sky text-ink-950"
              />
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

      <Link
        href={`/listening/${clip.slug}/shadowing`}
        className="flex items-center gap-4 rounded-3xl bg-surface p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-soft text-violet-text">
          <MicIcon className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold">Дуудлагаа дадлагажуулах</span>
          <span className="mt-0.5 block text-sm text-muted">
            Өгүүлбэр бүрийг давтаж бичээд, эх бичлэгтэй харьцуулж сонсоорой.
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

      {words.sheet}
    </div>
  );
}
