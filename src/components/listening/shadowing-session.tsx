"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { decodeMono, decodeShapes, shapeOf, type Shape } from "@/components/listening/decode-audio";
import { useRecorder } from "@/components/listening/use-recorder";
import { useSentenceAudio } from "@/components/listening/use-sentence-audio";
import { useRecentInput } from "@/components/listening/use-recent-input";
import { PronunciationPanel } from "@/components/listening/pronunciation-panel";
import { useMeasuredTime } from "@/components/use-measured-time";
import { ProgressBar } from "@/components/game/progress-bar";
import { Mascot } from "@/components/mascot";
import { MicIcon, PauseIcon, PlayIcon, XIcon } from "@/components/icons";

type ClipInfo = { slug: string; title: string; audio: string; durationSec: number };
export type ShadowSentence = { start: number; end: number; text: string };

const BINS = 48;
/** Keeps a take under the pronunciation service's limit and the server action body size. */
const MAX_RECORD_MS = 20_000;

const RECORDER_MESSAGE = {
  denied: "Микрофоны зөвшөөрөл өгөөгүй байна. Хөтчийн тохиргооноос микрофоныг зөвшөөрөөд дахин оролдоорой.",
  unsupported: "Энэ хөтөч дуу бичихийг дэмжихгүй байна. Chrome эсвэл Safari-ийн шинэ хувилбарыг ашиглаарай.",
  error: "Микрофон олдсонгүй. Микрофоноо шалгаад дахин оролдоорой.",
} as const;

function paceHint(original: number, mine: number): string {
  const ratio = mine / original;
  if (ratio > 1.35) return "Арай удаан байна. Эх бичлэгийн хурдыг дагаж үзээрэй.";
  if (ratio < 0.75) return "Арай хурдан байна. Үг бүрээ тодорхой хэлээрэй.";
  return "Хурд тань эх бичлэгтэй ойролцоо байна.";
}

function ShapeRow({ label, shape, bar }: { label: string; shape: Shape | null; bar: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted">
        {label}
        {shape && ` · ${shape.sec.toFixed(1)} сек`}
      </p>
      {shape ? (
        <div className="mt-1 flex h-10 items-center gap-[2px]" aria-hidden>
          {shape.values.map((v, i) => (
            <span key={i} className={`flex-1 rounded-full ${bar}`} style={{ height: `${Math.max(8, v * 100)}%` }} />
          ))}
        </div>
      ) : (
        <div className="mt-1 grid h-10 place-items-center rounded-xl border-2 border-dashed border-line text-xs text-muted">
          Бичсэний дараа энд харагдана
        </div>
      )}
    </div>
  );
}

/** Shadowing (phase 4): hear a sentence, record yourself, compare. Recordings never leave the browser. */
export function ShadowingSession({
  clip,
  sentences,
  aiAvailable,
}: {
  clip: ClipInfo;
  sentences: ShadowSentence[];
  aiAvailable: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [practiced, setPracticed] = useState<Set<number>>(() => new Set());
  const [minePlaying, setMinePlaying] = useState(false);
  const [shapes, setShapes] = useState<Shape[] | null>(null);
  const [mineShape, setMineShape] = useState<(Shape & { url: string }) | null>(null);
  const original = useSentenceAudio(clip.audio);
  const recorder = useRecorder();
  const recentInput = useRecentInput();
  const mine = useRef<HTMLAudioElement | null>(null);
  const alternateTimer = useRef(0);

  const sentence = sentences[idx];
  const rec = recorder.recording;
  const isRecording = recorder.status === "recording" || recorder.status === "requesting";

  // Shadowing time counts toward speaking for this clip, only while the learner is using the page.
  const doneRef = useRef(done);
  const busyRef = useRef(false);
  useEffect(() => {
    doneRef.current = done;
    busyRef.current = original.playing || minePlaying || isRecording;
  }, [done, original.playing, minePlaying, isRecording]);
  const flush = useMeasuredTime(
    { module: "speaking", ref: clip.slug },
    { counting: () => !doneRef.current && (busyRef.current || recentInput()), maxSec: Math.max(1800, clip.durationSec * 8) },
  );
  useEffect(() => {
    if (done) flush(true);
  }, [done, flush]);

  // Loudness shapes of every sentence, computed once; the decoded clip itself isn't kept.
  const sentencesRef = useRef(sentences);
  useEffect(() => {
    let alive = true;
    fetch(clip.audio)
      .then((r) => r.arrayBuffer())
      .then((data) => decodeShapes(data, sentencesRef.current, BINS))
      .then((s) => alive && setShapes(s))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [clip.audio]);

  const originalShape = shapes?.[idx] ?? null;

  useEffect(() => {
    if (!rec) return;
    let alive = true;
    rec.blob
      .arrayBuffer()
      .then(decodeMono)
      .then((audio) => {
        if (!alive) return;
        setMineShape({ ...shapeOf(audio, BINS), url: rec.url });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [rec]);
  const myShape = rec && mineShape?.url === rec.url ? mineShape : null;

  // Play each new sentence once when it appears (the tap that got here is the gesture).
  const rangeRef = useRef(sentence);
  useEffect(() => {
    rangeRef.current = sentence;
  });
  const { playRange, stop, prime } = original;
  useEffect(() => {
    const s = rangeRef.current;
    if (s && !done) playRange(s.start, s.end);
    return stop;
  }, [idx, done, playRange, stop]);

  useEffect(() => {
    const timer = alternateTimer;
    return () => window.clearTimeout(timer.current);
  }, []);

  function stopMine() {
    window.clearTimeout(alternateTimer.current);
    mine.current?.pause();
  }

  function playOriginal() {
    stopMine();
    if (original.playing) stop();
    else playRange(sentence.start, sentence.end);
  }

  function playMine() {
    const a = mine.current;
    if (!rec || !a) return;
    stop();
    if (!a.paused) {
      a.pause();
      return;
    }
    a.currentTime = 0;
    a.play().catch(() => setMinePlaying(false));
  }

  function playBoth() {
    if (!rec) return;
    stopMine();
    playRange(sentence.start, sentence.end);
    alternateTimer.current = window.setTimeout(playMine, (sentence.end - sentence.start) * 1000 + 600);
  }

  function record() {
    if (recorder.status === "recording") {
      recorder.stop();
      return;
    }
    stop();
    stopMine();
    void recorder.start(Math.min(MAX_RECORD_MS, Math.round((sentence.end - sentence.start) * 2000 + 2000)));
  }

  function goTo(next: number) {
    // The new sentence auto-plays from an effect; unlock the audio inside this tap for iOS.
    prime();
    stopMine();
    if (rec) setPracticed((p) => new Set(p).add(idx));
    recorder.reset();
    if (next >= sentences.length) setDone(true);
    else setIdx(next);
  }

  function restart() {
    prime();
    setPracticed(new Set());
    setIdx(0);
    setDone(false);
  }

  if (done || !sentence) {
    return (
      <div className="flex flex-col items-center rounded-[28px] bg-surface px-6 py-10 text-center">
        <Mascot mood="cheer" className="size-24" />
        <h1 className="mt-4 text-2xl font-extrabold tracking-[-0.02em]">Сайн байна!</h1>
        <p className="mt-1 text-[15px] text-muted">
          {practiced.size > 0
            ? `${practiced.size} өгүүлбэрийг давтаж бичлээ. Өдөр бүр жаахан давтвал дуудлага тань мэдэгдэхүйц сайжирна.`
            : "Дараагийн удаа өгүүлбэр бүрийг бичиж, эх бичлэгтэйгээ харьцуулаарай."}
        </p>
        <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
          <Link
            href={`/listening/${clip.slug}`}
            className="press flex h-14 items-center justify-center rounded-2xl bg-violet text-base font-extrabold text-ink-950 [--press:var(--violet-deep)]"
          >
            Бичлэг рүү буцах
          </Link>
          <button type="button" onClick={restart} className="h-12 rounded-2xl text-sm font-extrabold text-violet-text hover:bg-canvas">
            Дахин эхлэх
          </button>
        </div>
      </div>
    );
  }

  const status = recorder.status;
  const message = status === "denied" || status === "unsupported" || status === "error" ? RECORDER_MESSAGE[status] : null;
  const last = idx + 1 === sentences.length;

  return (
    <div className="flex flex-col gap-4">
      <audio
        ref={mine}
        src={rec?.url}
        preload="auto"
        onPlay={() => setMinePlaying(true)}
        onPause={() => setMinePlaying(false)}
        onEnded={() => setMinePlaying(false)}
      />
      <div className="flex items-center gap-3">
        <Link
          href={`/listening/${clip.slug}`}
          aria-label="Дадлагаас гарах"
          // Leaving mid-recording or mid-permission-prompt could leave the mic on; stop first.
          aria-disabled={isRecording}
          tabIndex={isRecording ? -1 : undefined}
          onClick={(e) => isRecording && e.preventDefault()}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-surface text-muted hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          <XIcon />
        </Link>
        <ProgressBar value={idx} max={sentences.length} label="Дадлагын явц" fill="bg-violet" className="h-2.5 flex-1" />
        <span className="w-14 text-right text-sm font-extrabold tabular-nums text-muted">
          {idx + 1}/{sentences.length}
        </span>
      </div>

      <section className="rounded-[28px] bg-surface p-5 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-violet-text">Сонсоод давтаж хэлээрэй</p>
        <p className="mt-2 text-[22px] font-extrabold leading-snug" lang="en">
          {sentence.text}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={playOriginal}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-sky-soft text-sm font-extrabold text-sky-text"
          >
            {original.playing ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
            Эх бичлэг
          </button>
          <button
            type="button"
            onClick={playMine}
            disabled={!rec}
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-violet-soft text-sm font-extrabold text-violet-text disabled:opacity-40"
          >
            {minePlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
            Миний бичлэг
          </button>
        </div>
        {rec && (
          <button type="button" onClick={playBoth} className="mt-2 text-sm font-extrabold text-violet-text underline">
            Ээлжлэн сонсох
          </button>
        )}

        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-canvas p-4">
          <ShapeRow label="Эх бичлэг" shape={originalShape} bar="bg-sky" />
          <ShapeRow label="Таны бичлэг" shape={myShape} bar="bg-violet" />
          {originalShape && myShape && (
            <p className="text-sm font-semibold">{paceHint(originalShape.sec, myShape.sec)}</p>
          )}
        </div>

        {message && (
          <p role="alert" className="mt-4 rounded-2xl bg-coral-soft px-4 py-3 text-sm font-semibold text-coral-a-text">
            {message}
          </p>
        )}
      </section>

      <PronunciationPanel
        key={rec?.url ?? `none-${idx}`}
        slug={clip.slug}
        seg={idx}
        recording={rec?.blob ?? null}
        available={aiAvailable}
      />

      <p className="px-1 text-xs text-muted">Таны бичлэг зөвхөн энэ төхөөрөмж дээр байна, хаана ч хадгалагдахгүй.</p>

      <div aria-hidden className="h-40 lg:hidden" />

      <div className="fixed inset-x-0 bottom-[calc(65px+env(safe-area-inset-bottom))] z-30 px-3 pb-2 lg:sticky lg:bottom-6 lg:px-0 lg:pb-0">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2 rounded-[24px] border border-line bg-surface/95 p-3 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-md lg:max-w-none">
          <button
            type="button"
            onClick={() => goTo(idx - 1)}
            disabled={idx === 0 || isRecording}
            className="h-12 w-24 rounded-2xl text-sm font-extrabold text-muted hover:bg-canvas disabled:opacity-40"
          >
            Өмнөх
          </button>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={record}
              disabled={status === "requesting"}
              aria-label={status === "recording" ? "Бичихийг зогсоох" : rec ? "Дахин бичих" : "Бичиж эхлэх"}
              className={`press grid size-16 place-items-center rounded-full text-ink-950 [--press:var(--violet-deep)] ${
                status === "recording" ? "animate-pulse bg-coral-a" : "bg-violet"
              }`}
            >
              {status === "recording" ? <span className="size-5 rounded-md bg-ink-950" /> : <MicIcon className="size-7" />}
            </button>
            <span className="mt-1 text-[11px] font-bold text-muted">
              {status === "recording" ? "Бичиж байна…" : rec ? "Дахин бичих" : "Бичих"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => goTo(idx + 1)}
            disabled={isRecording}
            className="h-12 w-24 rounded-2xl bg-canvas text-sm font-extrabold disabled:opacity-40"
          >
            {last ? "Дуусгах" : "Дараагийнх"}
          </button>
        </div>
      </div>
    </div>
  );
}
