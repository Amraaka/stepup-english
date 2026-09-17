import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Brand } from "./Brand";
import type { Look } from "./looks";

export const EndCard = ({ look }: { look: Look }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  const left = look.name === "editorial";

  // Sits above the bottom overlay zone rather than dead center
  return (
    <AbsoluteFill
      style={{
        alignItems: left ? "flex-start" : "center",
        justifyContent: "center",
        gap: 44,
        padding: left ? "0 150px 260px 90px" : "0 130px 260px",
      }}
    >
      <div style={{ opacity: enter }}>
        <Brand look={look} />
      </div>
      <div style={{ textAlign: left ? "left" : "center", opacity: enter, transform: `translateY(${(1 - enter) * 80}px)` }}>
        <h1 style={{ margin: 0, fontSize: 88, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, color: look.text }}>
          Хэдийг нь зөв{" "}
          <span style={{ color: look.name === "bold" ? look.text : look.word, textDecoration: look.name === "bold" ? "underline" : "none", textDecorationThickness: 8, textUnderlineOffset: 12 }}>
            таасан
          </span>{" "}
          бэ?
        </h1>
        <p style={{ margin: "32px 0 0", fontSize: 46, fontWeight: 500, color: look.muted }}>
          Хариултаа коммент хэсэгт үлдээгээрэй
        </p>
      </div>
    </AbsoluteFill>
  );
};
