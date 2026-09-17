import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BODIES } from "./bodies";
import { defaultQuestion, type BodyProps, type Motion } from "./formats";
import type { Look } from "./looks";
import { CARD_IN, ITEM, SAFE, THINK, ipaFontFamily } from "./theme";
import type { FormatName, QuizItem } from "./types";

const VOICE_DELAY = 12;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Props = { item: QuizItem; index: number; look: Look; format?: FormatName; question?: string };

export const QuizCard = ({ item, index, look, format = "picture", question }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealAt = CARD_IN + THINK;
  const since = Math.max(0, frame - revealAt);

  const motion: Motion = {
    // The first card is already in place on frame 0: that frame stops the scroll and doubles as the cover.
    enter: index === 0 ? 1 : spring({ frame, fps, config: { damping: 14, mass: 0.8 } }),
    revealed: frame >= revealAt,
    reveal: spring({ frame: since, fps, config: { damping: 12 } }),
    underline: spring({ frame: Math.max(0, since - 4), fps, config: { damping: 20 } }),
    bump: frame >= revealAt ? interpolate(since, [0, 5, 14], [1, 1.05, 1], clamp) : 1,
    think: frame - CARD_IN,
    fps,
  };
  const exit = interpolate(frame, [ITEM - 8, ITEM], [1, 0], clamp);

  const q = question ?? defaultQuestion(format);
  const Body = BODIES[format];

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      {/* Only the original picture quiz has an editorial variant; the other formats
          have their own body and always render inside the card. */}
      {look.name === "editorial" && !Body ? (
        <EditorialLayout item={item} look={look} m={motion} />
      ) : (
        <CardLayout item={item} look={look} m={motion} question={q} Body={Body} index={index} />
      )}

      {[0, 1, 2].map((second) => (
        <Sequence key={second} from={CARD_IN + second * fps} durationInFrames={fps} layout="none">
          <Audio src={staticFile("sfx/tick.wav")} volume={0.6} />
        </Sequence>
      ))}

      <Sequence from={revealAt} layout="none">
        <Audio src={staticFile("sfx/reveal.wav")} volume={0.7} />
      </Sequence>

      {/* voice starts just after the chime so the two don't blur together */}
      {/* sound-pair is a listening task: the word also plays at the start of the thinking time */}
      {item.audio && format === "sound-pair" && (
        <Sequence from={CARD_IN + 4} durationInFrames={THINK - 4} layout="none">
          <Audio src={staticFile(item.audio)} />
        </Sequence>
      )}

      {item.audio && (
        <Sequence from={revealAt + VOICE_DELAY} layout="none">
          <Audio src={staticFile(item.audio)} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

type LayoutProps = { item: QuizItem; look: Look; m: Motion };
type CardLayoutProps = LayoutProps & { question: string; index: number; Body?: (p: BodyProps) => React.ReactNode };

/** card, bold and night: a centered card; bold puts the question on the color above it */
const CardLayout = ({ item, look, m, question, Body, index }: CardLayoutProps) => {
  const outside = look.name === "bold";
  const top = outside ? 520 : 420;

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {outside && (
        <h1
          style={{
            position: "absolute",
            top: 400,
            margin: 0,
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            color: look.text,
            opacity: m.enter,
          }}
        >
          {question}
        </h1>
      )}
      <div
        style={{
          position: "absolute",
          top,
          width: SAFE.cardWidth,
          height: SAFE.bottom - top,
          transform: `translateY(${(1 - m.enter) * 120}px) scale(${0.92 + m.enter * 0.08})`,
          opacity: m.enter,
        }}
      >
        {/* stacked-card shadow */}
        <div style={{ ...cardStyle(look), transform: "translateY(24px) scale(0.95)", opacity: outside ? 0.35 : 0.6 }} />
        <div style={{ ...cardStyle(look), alignItems: "center", padding: outside ? "44px 48px 36px" : "52px 48px 40px" }}>
          {!outside && (
            <h1
              style={{
                margin: 0,
                fontSize: question.length > 24 ? 42 : 50,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                color: look.surfaceText,
              }}
            >
              {question}
            </h1>
          )}

          {Body ? (
            <Body item={item} look={look} m={m} index={index} />
          ) : (
            <>
              <div
                style={{
                  marginTop: outside ? 0 : 32,
                  width: 700,
                  height: outside ? 560 : 580,
                  display: "flex",
                  transform: `scale(${m.bump})`,
                }}
              >
                <Picture item={item} look={look} radius={36} />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {m.revealed ? (
                  <Answer item={item} look={look} m={m} align="center" />
                ) : (
                  <Countdown look={look} m={m} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** editorial: no card, big left-aligned type, a full-width picture band, letter blanks as a hint */
const EditorialLayout = ({ item, look, m }: LayoutProps) => {
  const number = Math.max(1, 3 - Math.floor(Math.max(0, m.think) / m.fps));
  const progress = interpolate(Math.max(0, m.think), [0, THINK], [1, 0], clamp);
  const slide = { transform: `translateX(${(1 - m.enter) * 90}px)`, opacity: m.enter };

  return (
    <AbsoluteFill>
      <h1
        style={{
          position: "absolute",
          top: 380,
          left: 90,
          width: 840,
          margin: 0,
          fontSize: 84,
          lineHeight: 1.04,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          color: look.text,
          ...slide,
        }}
      >
        Үүнийг англиар
        <br />
        юу гэдэг вэ?
      </h1>

      <div style={{ position: "absolute", top: 590, left: 90, width: 840, display: "flex", alignItems: "center", gap: 24, ...slide }}>
        <span style={{ width: 44, fontSize: 52, fontWeight: 800, color: look.word, fontVariantNumeric: "tabular-nums" }}>
          {m.revealed ? "✓" : number}
        </span>
        <div style={{ flex: 1, height: 12, borderRadius: 999, background: look.ringTrack }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 999, background: look.ringFill }} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 680,
          left: 0,
          width: 1080,
          height: 540,
          display: "flex",
          transform: `scale(${m.bump})`,
          opacity: m.enter,
        }}
      >
        <Picture item={item} look={look} radius={0} />
      </div>

      <div style={{ position: "absolute", top: 1250, left: 90, width: 840, height: 190, display: "flex", alignItems: "center", ...slide }}>
        {m.revealed ? <Answer item={item} look={look} m={m} align="left" /> : <Blanks word={item.en} look={look} />}
      </div>
    </AbsoluteFill>
  );
};

const cardStyle = (look: Look): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  borderRadius: 56,
  background: look.surface,
  boxShadow: look.shadow,
});

const Answer = ({ item, look, m, align }: { item: QuizItem; look: Look; m: Motion; align: "center" | "left" }) => {
  const onSurface = look.name !== "editorial";
  const big = align === "left" ? 104 : 92;
  return (
    <div
      style={{
        textAlign: align,
        transform: `scale(${0.7 + m.reveal * 0.3})`,
        transformOrigin: align === "left" ? "left center" : "center",
        opacity: m.reveal,
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{
            fontSize: item.en.length > 12 ? big * 0.85 : big,
            fontWeight: 800,
            color: look.word,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {item.en}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: -16,
            height: 10,
            width: `${m.underline * 100}%`,
            borderRadius: 999,
            background: look.underline,
            opacity: 0.35,
          }}
        />
      </div>
      <div style={{ marginTop: 34, fontSize: 34, fontWeight: 500, color: onSurface ? look.surfaceMuted : look.muted }}>
        {item.ipa && <span style={{ fontFamily: ipaFontFamily }}>{item.ipa}</span>}
        {item.ipa && <span style={{ margin: "0 16px", opacity: 0.6 }}>·</span>}
        <span style={{ color: onSurface ? look.surfaceText : look.text }}>{item.mn}</span>
      </div>
    </div>
  );
};

/** One bar per letter, a wider gap between words: a hint at the word's shape */
const Blanks = ({ word, look }: { word: string; look: Look }) => (
  <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
    {[...word].map((ch, i) =>
      ch === " " ? (
        <span key={i} style={{ width: 22 }} />
      ) : (
        <span key={i} style={{ width: 44, height: 10, borderRadius: 999, background: look.dotOff }} />
      ),
    )}
  </div>
);

const Countdown = ({ look, m }: { look: Look; m: Motion }) => {
  const size = 180;
  const r = 78;
  const circumference = 2 * Math.PI * r;
  const t = Math.max(0, m.think);
  const number = Math.max(1, 3 - Math.floor(t / m.fps));
  const progress = interpolate(t, [0, THINK], [0, 1], clamp);
  const pulse = interpolate(t % m.fps, [0, 6, 14], [1.15, 1.15, 1], clamp);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={look.ringTrack} strokeWidth={12} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={look.ringFill}
          strokeWidth={12}
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
          fontSize: 88,
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

const Picture = ({ item, look, radius }: { item: QuizItem; look: Look; radius: number }) =>
  item.image ? (
    <Img src={staticFile(item.image)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
  ) : (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: radius,
        border: radius ? `4px dashed ${look.placeholderBorder}` : "none",
        background: look.placeholderBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 60,
        textAlign: "center",
        color: look.surfaceMuted,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.12em" }}>IMAGE PLACEHOLDER</div>
      <div style={{ fontSize: 36, fontWeight: 500 }}>{item.imagePrompt}</div>
    </div>
  );
