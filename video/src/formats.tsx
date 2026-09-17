import { interpolate } from "remotion";
import type { Look } from "./looks";
import { answerSlot, placeAnswer } from "./order";
import { THINK, ipaFontFamily } from "./theme";
import type { FormatName, QuizItem } from "./types";

/** Shared motion values handed down by QuizCard. */
export type Motion = {
  enter: number;
  revealed: boolean;
  reveal: number;
  underline: number;
  bump: number;
  think: number;
  fps: number;
};

export type BodyProps = { item: QuizItem; look: Look; m: Motion; index: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The question line above each card, per format. */
const QUESTIONS: Partial<Record<FormatName, string>> = {
  "fix-mistake": "Зөв нь аль нь вэ?",
  "silent-letter": "Аль үсэг нь дуудагдахгүй вэ?",
  "word-stress": "Өргөлт хаана байна вэ?",
  "gap-fill": "Аль нь зөв бэ?",
  opposites: "Эсрэг утгатай үг нь юу вэ?",
  "sound-pair": "Аль үгийг хэлсэн бэ?",
  "mini-dialogue": "Юу гэж хариулах вэ?",
  "odd-one-out": "Аль нь илүүц вэ?",
  unscramble: "Энэ ямар үг вэ?",
  "where-is-it": "Бөмбөг хаана байна вэ?",
};

export const defaultQuestion = (format: FormatName): string =>
  QUESTIONS[format] ?? "Үүнийг англиар юу гэдэг вэ?";

/** What the voice clip should say for this format (generate.ts mirrors this). */
export const spokenText = (item: QuizItem): string => item.en;

/* ------------------------------------------------------------------ *
 * fix-mistake — the wrong sentence struck through, then the correction
 * ------------------------------------------------------------------ */
export const FixMistakeBody = ({ item, look, m, index }: BodyProps) => {
  // The question asks which sentence is correct, so BOTH candidates have to be on
  // screen during the thinking time — showing only the wrong one gave the learner
  // nothing to choose between.
  const strike = m.revealed ? interpolate(m.reveal, [0, 1], [0, 1], clamp) : 0;

  // Rotate per card so the correct sentence isn't always in the same slot. Hashing
  // the sentence alone degenerated twice (every card in fix-mistake-2 landed on the
  // same slot), so the card's position is mixed in — that makes an all-same run
  // impossible no matter how the words hash.
  const rows =
    answerSlot(item.en, index, 2) === 0
      ? [{ text: item.en, ok: true }, { text: item.wrong ?? "", ok: false }]
      : [{ text: item.wrong ?? "", ok: false }, { text: item.en, ok: true }];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 40 }}>
        {rows.map((r, i) => (
          <Line
            key={i}
            mark={m.revealed ? (r.ok ? "✓" : "✕") : "AB"[i]}
            markColor={m.revealed ? (r.ok ? "#1fb57a" : "#ff5a3c") : look.word}
            text={r.text}
            look={look}
            muted={m.revealed && !r.ok}
            strike={m.revealed && !r.ok ? strike : 0}
          />
        ))}

        {m.revealed && item.mn && (
          <div
            style={{
              marginLeft: 76,
              fontSize: 32,
              fontWeight: 500,
              color: look.surfaceMuted,
              opacity: m.reveal,
            }}
          >
            {item.mn}
          </div>
        )}
      </div>

      {/* keep the think rhythm every other format has */}
      {!m.revealed && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <Countdown look={look} m={m} />
        </div>
      )}
    </div>
  );
};

const Line = ({
  mark,
  markColor,
  text,
  look,
  muted,
  strike = 0,
}: {
  mark: string;
  markColor: string;
  text: string;
  look: Look;
  muted?: boolean;
  strike?: number;
}) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 24 }}>
    <span style={{ fontSize: 52, fontWeight: 800, color: markColor, lineHeight: 1.1, width: 52, flex: "none" }}>{mark}</span>
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          fontSize: text.length > 30 ? 46 : 54,
          fontWeight: muted ? 500 : 800,
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          color: muted ? look.surfaceMuted : look.surfaceText,
        }}
      >
        {text}
      </span>
      {muted && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "52%",
            height: 6,
            width: `${strike * 100}%`,
            borderRadius: 999,
            background: "#ff5a3c",
            opacity: 0.85,
          }}
        />
      )}
    </span>
  </div>
);

/* ------------------------------------------------------------------ *
 * silent-letter — one big word as tiles, the silent one fades out
 * ------------------------------------------------------------------ */
export const SilentLetterBody = ({ item, look, m }: BodyProps) => {
  const letters = [...item.en];
  const silent = item.silentIndex ?? -1;

  // The card is 820 wide with 48 padding each side, so tiles must shrink for long
  // words — "receipt" at a fixed 104 would overflow the card.
  const GAP = 14;
  const avail = 820 - 96;
  const size = Math.min(104, Math.floor((avail - GAP * (letters.length - 1)) / letters.length));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>
        <div style={{ display: "flex", gap: GAP }}>
          {letters.map((ch, i) => {
            const isSilent = m.revealed && i === silent;
            return (
              <span
                key={i}
                style={{
                  width: size,
                  height: Math.round(size * 1.27),
                  borderRadius: Math.round(size * 0.23),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: Math.round(size * 0.69),
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  // tiles sit on look.surface — pillBg/pillText are white on the
                  // bold look and the whole word would vanish against the card
                  background: isSilent ? "transparent" : look.ringTrack,
                  border: isSilent ? `4px dashed ${look.placeholderBorder}` : "4px solid transparent",
                  color: isSilent ? look.surfaceMuted : look.word,
                  opacity: isSilent ? 0.5 : 1,
                  transform: isSilent ? `scale(${1 - m.reveal * 0.08})` : "scale(1)",
                }}
              >
                {ch.toUpperCase()}
              </span>
            );
          })}
        </div>

        {m.revealed && (
          <div style={{ textAlign: "center", opacity: m.reveal, transform: `translateY(${(1 - m.reveal) * 20}px)` }}>
            <div style={{ fontSize: 40, fontWeight: 500, color: look.surfaceMuted }}>
              {item.ipa && <span style={{ fontFamily: ipaFontFamily }}>{item.ipa}</span>}
              {item.ipa && item.mn && <span style={{ margin: "0 16px", opacity: 0.6 }}>·</span>}
              {item.mn && <span style={{ color: look.surfaceText }}>{item.mn}</span>}
            </div>
          </div>
        )}
      </div>

      {!m.revealed && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <Countdown look={look} m={m} />
        </div>
      )}
    </div>
  );
};

/** The same 3-2-1 ring the picture quiz uses, so every format shares one rhythm. */
export const Countdown = ({ look, m }: { look: Look; m: Motion }) => {
  const size = 150;
  const r = 64;
  const circumference = 2 * Math.PI * r;
  const t = Math.max(0, m.think);
  const number = Math.max(1, 3 - Math.floor(t / m.fps));
  const progress = interpolate(t, [0, THINK], [0, 1], clamp);
  const pulse = interpolate(t % m.fps, [0, 6, 14], [1.15, 1.15, 1], clamp);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={look.ringTrack} strokeWidth={11} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={look.ringFill}
          strokeWidth={11}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * progress}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          fontWeight: 800,
          color: look.surfaceText,
          transform: `scale(${pulse})`,
        }}
      >
        {number}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * word-stress — syllables as blocks, the stressed one rises
 * ------------------------------------------------------------------ */
export const WordStressBody = ({ item, look, m }: BodyProps) => {
  const syls = item.syllables ?? [item.en];
  const hit = item.stressIndex ?? -1;

  const GAP = 16;
  const avail = 820 - 96;
  const w = Math.min(160, Math.floor((avail - GAP * (syls.length - 1)) / syls.length));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: GAP }}>
          {syls.map((s, i) => {
            const on = m.revealed && i === hit;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: on ? look.ringFill : look.dotOff,
                    opacity: on ? 1 : 0.55,
                    transform: `scale(${on ? 1 + m.reveal * 0.25 : 1})`,
                  }}
                />
                <span
                  style={{
                    width: w,
                    height: on ? 150 + m.reveal * 34 : 150,
                    borderRadius: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: Math.min(56, Math.round(w * 0.42)),
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    // same surface-safe pair as the other bodies
                    background: on ? look.ringFill : look.ringTrack,
                    color: on ? look.surface : look.word,
                  }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        {m.revealed && (
          <div style={{ textAlign: "center", opacity: m.reveal, fontSize: 38, fontWeight: 500, color: look.surfaceMuted }}>
            {item.ipa && <span style={{ fontFamily: ipaFontFamily }}>{item.ipa}</span>}
            {item.ipa && item.mn && <span style={{ margin: "0 16px", opacity: 0.6 }}>·</span>}
            {item.mn && <span style={{ color: look.surfaceText }}>{item.mn}</span>}
          </div>
        )}
      </div>

      {!m.revealed && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <Countdown look={look} m={m} />
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ *
 * gap-fill — a sentence with a blank, three options below
 * ------------------------------------------------------------------ */
export const GapFillBody = ({ item, look, m, index }: BodyProps) => {
  const options = item.options ?? [];
  const answer = options[0];
  const [before, after] = (item.sentence ?? "").split("___");

  // options[0] is the answer in the data; placeAnswer moves it to a per-card slot
  const shown = placeAnswer(options, answer, index);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 52, width: "100%" }}>
        <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.32, letterSpacing: "-0.02em", color: look.surfaceText, textAlign: "center" }}>
          {before}
          <span
            style={{
              display: "inline-block",
              minWidth: 168,
              padding: "0 14px",
              borderRadius: 14,
              background: m.revealed ? look.ringFill : "transparent",
              border: m.revealed ? "3px solid transparent" : `3px dashed ${look.placeholderBorder}`,
              color: m.revealed ? look.surface : "transparent",
              fontWeight: 800,
              transform: `translateY(6px) scale(${m.revealed ? 0.94 + m.reveal * 0.06 : 1})`,
            }}
          >
            {m.revealed ? answer : " "}
          </span>
          {after}
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          {/* options[0] is the answer in the data, so rotate the display order by a
              per-word seed — otherwise the answer sits first on every card and the
              quiz gives itself away. Deterministic, so re-renders are identical. */}
          {shown.map((o) => {
            const correct = m.revealed && o === answer;
            return (
              <span
                key={o}
                style={{
                  padding: "20px 34px",
                  borderRadius: 18,
                  fontSize: 40,
                  fontWeight: 700,
                  // These pills sit on look.surface, so they must take surface-safe
                  // tokens. pillBg/pillText are white on the bold look and the whole
                  // row disappeared against the white card.
                  background: correct ? look.ringFill : look.ringTrack,
                  color: correct ? look.surface : look.word,
                  opacity: m.revealed && !correct ? 0.4 : 1,
                }}
              >
                {o}
              </span>
            );
          })}
        </div>
      </div>

      {!m.revealed && (
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <Countdown look={look} m={m} />
        </div>
      )}
    </div>
  );
};

// The format → layout registry lives in bodies.ts.
