import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Brand } from "./Brand";
import { EndCard } from "./EndCard";
import { getLook, type Look } from "./looks";
import { QuizCard } from "./QuizCard";
import { CARD_IN, END, ITEM, MUSIC_LOOP_FRAMES, MUSIC_VOLUME, SAFE, THINK, accents, fontFamily } from "./theme";
import type { Quiz } from "./types";

export const quizDuration = (quiz: Quiz) => quiz.items.length * ITEM + END;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Fade in and out, and duck under each answer so the chime and voice stay clear. */
const musicVolume = (frame: number, total: number, itemFrames: number) => {
  const fade = interpolate(frame, [0, 20, total - 45, total], [0, 1, 1, 0], clamp);
  const local = frame % ITEM;
  const duck =
    frame < itemFrames
      ? interpolate(local, [CARD_IN + THINK - 4, CARD_IN + THINK + 4, ITEM - 10, ITEM], [1, 0.45, 0.45, 1], clamp)
      : 1;
  return MUSIC_VOLUME * fade * duck;
};

export const VocabQuiz = ({ topic, items, accent = "coral", look: lookName = "card", format, question }: Quiz) => {
  const look = getLook(lookName, accents[accent]);
  const itemFrames = items.length * ITEM;
  const total = itemFrames + END;

  return (
    <AbsoluteFill style={{ fontFamily, color: look.text, background: look.background }}>
      {/* Copies of the loop placed back to back instead of `loop`, because a looped Audio's
          volume callback restarts its frame count each pass and would break the fades and ducking. */}
      {Array.from({ length: Math.ceil(total / MUSIC_LOOP_FRAMES) }, (_, k) => {
        const from = k * MUSIC_LOOP_FRAMES;
        return (
          <Sequence key={k} name={`Music ${k + 1}`} from={from} durationInFrames={Math.min(MUSIC_LOOP_FRAMES, total - from)} layout="none">
            <Audio src={staticFile("music/loop.wav")} volume={(f) => musicVolume(from + f, total, itemFrames)} />
          </Sequence>
        );
      })}

      {/* Header stays put across cards; only the card animates */}
      <Sequence name="Header" durationInFrames={itemFrames}>
        <Header topic={topic} total={items.length} look={look} />
      </Sequence>

      {items.map((item, i) => (
        <Sequence key={item.en} name={item.en} from={i * ITEM} durationInFrames={ITEM}>
          <QuizCard item={item} index={i} look={look} format={format} question={question} />
        </Sequence>
      ))}

      <Sequence name="End" from={itemFrames} durationInFrames={END}>
        <EndCard look={look} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Header = ({ topic, total, look }: { topic: string; total: number; look: Look }) => {
  const frame = useCurrentFrame();
  const current = Math.min(total - 1, Math.floor(frame / ITEM));
  const left = look.name === "editorial";

  return (
    <AbsoluteFill style={{ top: SAFE.top, alignItems: left ? "flex-start" : "center", paddingLeft: left ? 90 : 0, gap: 26 }}>
      <Brand look={look} />
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span
          style={{
            padding: left ? 0 : "12px 28px",
            borderRadius: 999,
            background: look.pillBg,
            color: look.pillText,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: left ? "0.08em" : 0,
            textTransform: left ? "uppercase" : "none",
          }}
        >
          {topic}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {Array.from({ length: total }, (_, i) => {
            // the active dot stretches in as its card arrives
            const grow = i === current ? interpolate(frame - i * ITEM, [0, CARD_IN], [0, 1], clamp) : 0;
            return (
              <span
                key={i}
                style={{
                  width: 20 + grow * 28,
                  height: 20,
                  borderRadius: 999,
                  background: i <= current ? look.dotOn : look.dotOff,
                  opacity: i < current ? 0.45 : 1,
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
