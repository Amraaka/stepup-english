import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { Countdown, type BodyProps, type Motion } from "./formats";
import type { Look } from "./looks";
import { placeAnswer, scramble } from "./order";
import { ipaFontFamily } from "./theme";
import type { QuizItem } from "./types";

// Every colour below is painted on look.surface, so it comes from the surface-safe
// set (ringFill / ringTrack / word / surface*). pill* tokens are white on the bold
// look and would vanish against the card.

const INNER = 724; // card width 820 minus 48px padding each side

/** Font size that keeps `text` on one line within `width` (Manrope 800 ≈ 0.6em per char). */
const fit = (text: string, max: number, width = INNER) =>
  Math.min(max, Math.floor(width / (Math.max(1, text.length) * 0.6)));

type ChipState = "idle" | "right" | "dim";
const stateOf = (m: Motion, isAnswer: boolean): ChipState => (!m.revealed ? "idle" : isAnswer ? "right" : "dim");

/** Content area plus the shared 3-2-1 ring while the learner is thinking. */
const Shell = ({ look, m, gap = 44, children }: { look: Look; m: Motion; gap?: number; children: ReactNode }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap, width: "100%" }}>
      {children}
    </div>
    {!m.revealed && (
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
        <Countdown look={look} m={m} />
      </div>
    )}
  </div>
);

const Chip = ({ text, state, look, size }: { text: string; state: ChipState; look: Look; size: number }) => (
  <span
    style={{
      padding: `${Math.round(size * 0.42)}px ${Math.round(size * 0.75)}px`,
      borderRadius: 20,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
      background: state === "right" ? look.ringFill : look.ringTrack,
      color: state === "right" ? look.surface : look.word,
      opacity: state === "dim" ? 0.35 : 1,
    }}
  >
    {text}
  </span>
);

/** "/ipa/ · монгол" under the answer. */
const Meaning = ({ item, look, m }: { item: QuizItem; look: Look; m: Motion }) =>
  m.revealed && (item.ipa || item.mn) ? (
    <div style={{ textAlign: "center", fontSize: 38, fontWeight: 500, color: look.surfaceMuted, opacity: m.reveal }}>
      {item.ipa && <span style={{ fontFamily: ipaFontFamily }}>{item.ipa}</span>}
      {item.ipa && item.mn && <span style={{ margin: "0 16px", opacity: 0.6 }}>·</span>}
      {item.mn && <span style={{ color: look.surfaceText }}>{item.mn}</span>}
    </div>
  ) : null;

const MnLine = ({ text, look, m }: { text?: string; look: Look; m: Motion }) =>
  m.revealed && text ? (
    <div
      style={{
        textAlign: "center",
        fontSize: 36,
        fontWeight: 600,
        lineHeight: 1.3,
        color: look.surfaceText,
        opacity: m.reveal,
        transform: `translateY(${(1 - m.reveal) * 14}px)`,
      }}
    >
      {text}
    </div>
  ) : null;

/* ------------------------------------------------------------------ *
 * opposites — a word, an arrow, the opposite revealed in a box
 * ------------------------------------------------------------------ */
export const OppositesBody = ({ item, look, m }: BodyProps) => {
  const size = Math.min(fit(item.prompt ?? "", 104), fit(item.en, 104, 620));
  return (
    <Shell look={look} m={m} gap={36}>
      <div style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.03em", color: look.surfaceText }}>{item.prompt}</div>
      <svg width={64} height={86} viewBox="0 0 64 86">
        <path d="M32 6v68M10 52l22 22 22-22" stroke={look.word} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {m.revealed ? (
        <span
          style={{
            padding: "12px 44px",
            borderRadius: 28,
            background: look.ringFill,
            color: look.surface,
            fontSize: size,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            opacity: m.reveal,
            transform: `scale(${0.8 + m.reveal * 0.2})`,
          }}
        >
          {item.en}
        </span>
      ) : (
        <span
          style={{
            width: 420,
            height: Math.round(size * 1.2) + 24,
            borderRadius: 28,
            border: `5px dashed ${look.placeholderBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.round(size * 0.8),
            fontWeight: 800,
            color: look.surfaceMuted,
          }}
        >
          ?
        </span>
      )}
      <Meaning item={item} look={look} m={m} />
    </Shell>
  );
};

/* ------------------------------------------------------------------ *
 * sound-pair — two near-identical words; the voice says one
 * ------------------------------------------------------------------ */
const Speaker = ({ look, active, scale }: { look: Look; active: boolean; scale: number }) => (
  <svg width={150} height={124} viewBox="0 0 150 124" style={{ transform: `scale(${scale})` }}>
    <path d="M16 44h28l36-30v96L44 80H16z" fill={look.ringFill} />
    <path
      d="M98 40c11 12 11 32 0 44M114 24c20 21 20 55 0 76"
      stroke={look.ringFill}
      strokeWidth={10}
      strokeLinecap="round"
      fill="none"
      opacity={active ? 1 : 0.3}
    />
  </svg>
);

export const SoundPairBody = ({ item, look, m, index }: BodyProps) => {
  const options = item.options ?? [];
  const shown = placeAnswer(options, item.en, index);
  const ipaOf = (o: string) => item.hints?.[options.indexOf(o)];
  // QuizCard plays the word 4 frames into the thinking time; pulse while it speaks
  const speaking = m.think >= 4 && m.think < 40;
  const pulse = speaking ? 1 + 0.07 * Math.abs(Math.sin(m.think / 3)) : 1;
  const size = Math.min(...shown.map((o) => fit(o, 72, 300)));

  return (
    <Shell look={look} m={m} gap={52}>
      <Speaker look={look} active={speaking || m.revealed} scale={pulse} />
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
        {shown.map((o) => (
          <div key={o} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Chip text={o} state={stateOf(m, o === item.en)} look={look} size={size} />
            {/* IPA only after the reveal — before it, it would answer the question without listening */}
            {m.revealed && ipaOf(o) && (
              <span style={{ fontFamily: ipaFontFamily, fontSize: 34, color: look.surfaceMuted, opacity: o === item.en ? 1 : 0.5 }}>
                {ipaOf(o)}
              </span>
            )}
          </div>
        ))}
      </div>
      <MnLine text={item.mn} look={look} m={m} />
    </Shell>
  );
};

/* ------------------------------------------------------------------ *
 * mini-dialogue — their line, then your reply
 * ------------------------------------------------------------------ */
const Bubble = ({ mine, look, style, children }: { mine: boolean; look: Look; style?: CSSProperties; children: ReactNode }) => (
  <div
    style={{
      padding: "26px 34px",
      borderRadius: 36,
      borderBottomLeftRadius: mine ? 36 : 8,
      borderBottomRightRadius: mine ? 8 : 36,
      background: mine ? look.ringFill : look.ringTrack,
      color: mine ? look.surface : look.surfaceText,
      fontSize: 46,
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.01em",
      ...style,
    }}
  >
    {children}
  </div>
);

const Typing = ({ look, m }: { look: Look; m: Motion }) => (
  <span style={{ display: "inline-flex", gap: 12, padding: "8px 6px" }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          background: look.surface,
          opacity: 0.35 + 0.65 * Math.max(0, Math.sin((m.think - i * 5) / 5)),
        }}
      />
    ))}
  </span>
);

export const MiniDialogueBody = ({ item, look, m }: BodyProps) => (
  <Shell look={look} m={m} gap={36}>
    <Bubble mine={false} look={look} style={{ alignSelf: "flex-start", maxWidth: "84%" }}>
      {item.prompt}
    </Bubble>
    {m.revealed ? (
      <div
        style={{
          alignSelf: "flex-end",
          maxWidth: "84%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 16,
          opacity: m.reveal,
          transform: `translateY(${(1 - m.reveal) * 20}px)`,
        }}
      >
        <Bubble mine look={look}>
          {item.en}
        </Bubble>
        {item.mn && <div style={{ fontSize: 32, fontWeight: 500, color: look.surfaceMuted, textAlign: "right" }}>{item.mn}</div>}
      </div>
    ) : (
      <Bubble mine look={look} style={{ alignSelf: "flex-end" }}>
        <Typing look={look} m={m} />
      </Bubble>
    )}
  </Shell>
);

/* ------------------------------------------------------------------ *
 * odd-one-out — a grid of words, one doesn't belong
 * ------------------------------------------------------------------ */
export const OddOneOutBody = ({ item, look, m, index }: BodyProps) => {
  const shown = placeAnswer(item.options ?? [], item.en, index);
  const cols = shown.length === 3 ? 3 : 2;
  const cell = (INNER - 22 * (cols - 1)) / cols;
  const size = Math.min(...shown.map((o) => fit(o, 56, cell - 40)));

  return (
    <Shell look={look} m={m} gap={40}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 22, width: "100%" }}>
        {shown.map((o) => {
          const st = stateOf(m, o === item.en);
          return (
            <div
              key={o}
              style={{
                height: 170,
                borderRadius: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                background: st === "right" ? look.ringFill : look.ringTrack,
                color: st === "right" ? look.surface : look.word,
                opacity: st === "dim" ? 0.35 : 1,
                transform: st === "right" ? `scale(${1 + m.reveal * 0.04})` : "none",
              }}
            >
              {o}
            </div>
          );
        })}
      </div>
      <MnLine text={item.mn} look={look} m={m} />
    </Shell>
  );
};

/* ------------------------------------------------------------------ *
 * unscramble — jumbled letter tiles fall into order
 * ------------------------------------------------------------------ */
export const UnscrambleBody = ({ item, look, m, index }: BodyProps) => {
  const letters = m.revealed ? [...item.en] : scramble(item.en, index);
  const GAP = 12;
  const n = letters.length;
  const size = Math.min(100, Math.floor((INNER - GAP * (n - 1)) / n));

  return (
    <Shell look={look} m={m} gap={44}>
      {item.image ? (
        <Img src={staticFile(item.image)} style={{ width: 320, height: 320, objectFit: "contain" }} />
      ) : (
        // no picture: the Mongolian meaning is the clue
        !m.revealed &&
        item.mn && (
          <span style={{ padding: "16px 34px", borderRadius: 999, background: look.ringTrack, color: look.word, fontSize: 40, fontWeight: 700 }}>
            {item.mn}
          </span>
        )
      )}
      <div style={{ display: "flex", gap: GAP }}>
        {letters.map((ch, i) => (
          <span
            key={i}
            style={{
              width: size,
              height: Math.round(size * 1.2),
              borderRadius: Math.round(size * 0.22),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: Math.round(size * 0.62),
              fontWeight: 800,
              background: m.revealed ? look.ringFill : look.ringTrack,
              color: m.revealed ? look.surface : look.word,
              transform: m.revealed ? `scale(${0.9 + m.reveal * 0.1})` : "none",
            }}
          >
            {ch.toUpperCase()}
          </span>
        ))}
      </div>
      <Meaning item={item} look={look} m={m} />
    </Shell>
  );
};

/* ------------------------------------------------------------------ *
 * where-is-it — a ball placed around a table or boxes, drawn in code
 * ------------------------------------------------------------------ */
const Scene = ({ prep, look }: { prep: string; look: Look }) => {
  const ink = look.surfaceMuted;
  const fill = look.ringTrack;
  const table = (
    <g>
      <rect x={150} y={206} width={260} height={26} rx={8} fill={fill} stroke={ink} strokeWidth={6} />
      <rect x={172} y={232} width={18} height={148} fill={ink} />
      <rect x={370} y={232} width={18} height={148} fill={ink} />
    </g>
  );
  const box = (x: number) => <rect x={x} y={262} width={120} height={118} rx={10} fill={fill} stroke={ink} strokeWidth={6} />;
  const ball = (cx: number, cy: number, r = 36) => <circle cx={cx} cy={cy} r={r} fill={look.ringFill} />;

  const scene: Record<string, ReactNode> = {
    on: <>{table}{ball(280, 170)}</>,
    under: <>{table}{ball(280, 344)}</>,
    above: <>{table}{ball(280, 76)}</>,
    "next to": <>{table}{ball(478, 344)}</>,
    // drawn first so the table top hides its lower half
    behind: <>{ball(300, 194, 30)}{table}</>,
    // closer to the viewer: bigger, on the floor, and hiding part of a table leg.
    // (Centred on the tabletop it read as "on".)
    "in front of": <>{table}{ball(210, 318, 60)}</>,
    in: (
      <>
        <path d="M190 262 L212 230 H348 L370 262" fill={fill} stroke={ink} strokeWidth={6} strokeLinejoin="round" />
        {ball(280, 258, 34)}
        <rect x={190} y={262} width={180} height={118} rx={10} fill={fill} stroke={ink} strokeWidth={6} />
      </>
    ),
    between: <>{box(90)}{box(350)}{ball(280, 344)}</>,
  };

  return (
    <svg viewBox="0 0 560 420" width={456} height={342}>
      <path d="M20 380H540" stroke={look.dotOff} strokeWidth={6} strokeLinecap="round" />
      {scene[prep] ?? table}
    </svg>
  );
};

/** Split `sentence` around the whole-word `answer`. */
const around = (sentence: string, answer: string): [string, string] => {
  const i = ` ${sentence.toLowerCase()} `.indexOf(` ${answer.toLowerCase()} `);
  return i < 0 ? [sentence, ""] : [sentence.slice(0, i), sentence.slice(i + answer.length)];
};

export const WhereIsItBody = ({ item, look, m, index }: BodyProps) => {
  const answer = item.answer ?? "";
  const shown = placeAnswer(item.options ?? [], answer, index);
  const [before, after] = around(item.en, answer);

  return (
    <Shell look={look} m={m} gap={26}>
      <Scene prep={answer} look={look} />
      <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.35, letterSpacing: "-0.01em", color: look.surfaceText, textAlign: "center" }}>
        {before}
        <span
          style={{
            display: "inline-block",
            minWidth: 150,
            padding: "0 12px",
            borderRadius: 12,
            background: m.revealed ? look.ringFill : "transparent",
            border: m.revealed ? "3px solid transparent" : `3px dashed ${look.placeholderBorder}`,
            color: m.revealed ? look.surface : "transparent",
            fontWeight: 800,
          }}
        >
          {m.revealed ? answer : " "}
        </span>
        {after}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {shown.map((o) => (
          <Chip key={o} text={o} state={stateOf(m, o === answer)} look={look} size={34} />
        ))}
      </div>
      <MnLine text={item.mn} look={look} m={m} />
    </Shell>
  );
};
