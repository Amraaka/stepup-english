"use client";

import Link from "next/link";
import { useState } from "react";
import type { AssessOutcome, WordScore } from "@/lib/pronunciation/types";
import { assessPronunciationAction } from "@/app/(site)/listening/pronunciation-actions";
import { toSpeechWav } from "@/components/listening/decode-audio";

function scoreTone(score: number) {
  if (score >= 80) return { chip: "bg-mint-soft text-mint-text", text: "text-mint-text" };
  if (score >= 60) return { chip: "bg-sun-soft text-sun-text", text: "text-sun-text" };
  return { chip: "bg-coral-soft text-coral-a-text", text: "text-coral-a-text" };
}

function WordChip({ w }: { w: WordScore }) {
  if (w.error === "omission") {
    return (
      <span className="rounded-lg bg-canvas px-2 py-1 text-sm text-muted line-through" title="Алгассан">
        {w.word}
      </span>
    );
  }
  return (
    <span className={`rounded-lg px-2 py-1 text-sm font-bold ${scoreTone(w.accuracy).chip}`}>
      {w.word} <span className="font-semibold opacity-70">{Math.round(w.accuracy)}</span>
    </span>
  );
}

/**
 * AI pronunciation feedback for one recorded sentence (phase 5).
 * Until a provider is configured it only says the feature is coming (honesty rule, ADR 0007).
 */
export function PronunciationPanel({
  slug,
  seg,
  recording,
  available,
}: {
  slug: string;
  seg: number;
  recording: Blob | null;
  available: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [outcome, setOutcome] = useState<AssessOutcome | null>(null);

  if (!available) {
    return (
      <section className="rounded-3xl bg-violet-soft p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-extrabold">AI дуудлагын үнэлгээ</h2>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-extrabold text-violet-text">Тун удахгүй</span>
        </div>
        <p className="mt-1.5 text-sm text-muted">
          Удахгүй AI таны дуудлагыг үг, авиа бүрээр нь үнэлж, юуг нь засах хэрэгтэйг монголоор тайлбарлана.
        </p>
      </section>
    );
  }

  async function assess() {
    if (!recording) return;
    setPending(true);
    try {
      const form = new FormData();
      form.set("audio", await toSpeechWav(recording), "take.wav");
      form.set("slug", slug);
      form.set("seg", String(seg));
      setOutcome(await assessPronunciationAction(form));
    } catch {
      setOutcome({ status: "error", message: "Бичлэгийг боловсруулж чадсангүй. Дахин бичээд үзээрэй." });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-3xl bg-surface p-5">
      <h2 className="text-[15px] font-extrabold">AI дуудлагын үнэлгээ</h2>

      {!outcome && (
        <>
          <p className="mt-1 text-sm text-muted">
            {recording ? "Бичлэгээ илгээгээд үг бүрийн дуудлагын оноогоо хараарай." : "Эхлээд өгүүлбэрээ бичээрэй."}
          </p>
          <button
            type="button"
            onClick={assess}
            disabled={!recording || pending}
            className="press mt-3 h-12 w-full rounded-2xl bg-violet text-sm font-extrabold text-ink-950 [--press:var(--violet-deep)] disabled:opacity-40"
          >
            {pending ? "Шалгаж байна…" : "AI-аар шалгуулах"}
          </button>
        </>
      )}

      {outcome?.status === "unavailable" && (
        <p className="mt-1 text-sm text-muted">AI үнэлгээ одоохондоо ажиллахгүй байна.</p>
      )}
      {outcome?.status === "signin" && (
        <p className="mt-1 text-sm text-muted">
          AI үнэлгээ авахын тулд{" "}
          <Link href="/login" className="font-bold text-violet-text underline">
            нэвтэрнэ үү
          </Link>
          .
        </p>
      )}
      {outcome?.status === "error" && (
        <p role="alert" className="mt-1 text-sm font-semibold text-coral-a-text">
          {outcome.message}
        </p>
      )}

      {outcome?.status === "ok" && (
        <div className="mt-3">
          {outcome.sample && (
            <p className="mb-3 rounded-xl bg-sun-soft px-3 py-2 text-xs font-bold text-sun-text">
              Туршилтын өгөгдөл. Жинхэнэ үнэлгээ биш (зөвхөн хөгжүүлэлтийн орчинд).
            </p>
          )}
          <div className="flex items-center gap-4">
            <span
              className={`grid size-16 shrink-0 place-items-center rounded-full bg-canvas text-2xl font-extrabold tabular-nums ${scoreTone(outcome.result.overall).text}`}
            >
              {Math.round(outcome.result.overall)}
            </span>
            <dl className="grid flex-1 grid-cols-3 gap-2 text-center">
              {(
                [
                  ["Нарийвчлал", outcome.result.accuracy],
                  ["Урсгал", outcome.result.fluency],
                  ["Бүрэн байдал", outcome.result.completeness],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-xl bg-canvas px-1 py-2">
                  <dt className="text-[11px] font-semibold text-muted">{label}</dt>
                  <dd className="text-base font-extrabold tabular-nums">{Math.round(value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-4 text-[15px] font-bold">{outcome.feedback.summary}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {outcome.result.words
              .filter((w) => w.error !== "insertion")
              .map((w, i) => (
                <WordChip key={`${w.word}-${i}`} w={w} />
              ))}
          </div>

          {outcome.feedback.tips.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2.5">
              {outcome.feedback.tips.map((t) => (
                <li key={t.id} className="rounded-2xl bg-violet-soft px-4 py-3">
                  <p className="text-sm font-extrabold">{t.title}</p>
                  <p className="mt-0.5 text-sm">{t.body}</p>
                  {t.words.length > 0 && <p className="mt-1 text-xs text-muted">Жишээ: {t.words.join(", ")}</p>}
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setOutcome(null)}
            className="mt-4 text-sm font-extrabold text-violet-text underline"
          >
            Дахин шалгуулах
          </button>
        </div>
      )}
    </section>
  );
}
