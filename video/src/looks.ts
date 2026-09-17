import { colors, type Accent } from "./theme";

export type LookName = "card" | "bold" | "night" | "editorial";

/** Every color a layout needs, resolved for one look + accent. */
export type Look = {
  name: LookName;
  background: string;
  text: string;
  muted: string;
  surface: string;
  surfaceText: string;
  surfaceMuted: string;
  shadow: string;
  placeholderBg: string;
  placeholderBorder: string;
  ringTrack: string;
  ringFill: string;
  word: string;
  underline: string;
  pillBg: string;
  pillText: string;
  dotOn: string;
  dotOff: string;
  brandBg: string;
  brandBorder: string;
  brandText: string;
  brandMuted: string;
};

const light = (accent: Accent) => ({
  text: colors.ink900,
  muted: colors.ink600,
  surface: colors.surface,
  surfaceText: colors.ink900,
  surfaceMuted: colors.ink600,
  shadow: "0 30px 80px rgba(26, 26, 31, 0.10)",
  placeholderBg: colors.canvas,
  placeholderBorder: colors.ink400,
  ringTrack: accent.soft,
  ringFill: accent.fill,
  word: accent.word,
  underline: accent.fill,
  pillBg: accent.soft,
  pillText: accent.word,
  dotOn: accent.fill,
  dotOff: colors.locked,
  brandBg: colors.surface,
  brandBorder: colors.line,
  brandText: colors.ink900,
  brandMuted: colors.ink600,
});

export const getLook = (name: LookName, accent: Accent): Look => {
  switch (name) {
    case "card":
      return { name, ...light(accent), background: `linear-gradient(180deg, ${colors.surface} 0%, ${accent.soft} 140%)` };

    // Full accent ground, white card; the question sits on the color above the card
    case "bold":
      return {
        name,
        ...light(accent),
        background: `linear-gradient(165deg, ${accent.fill} 0%, ${accent.deep} 100%)`,
        text: "#ffffff",
        muted: "rgba(255, 255, 255, 0.82)",
        shadow: "0 40px 90px rgba(0, 0, 0, 0.28)",
        pillBg: "rgba(255, 255, 255, 0.18)",
        pillText: "#ffffff",
        dotOn: "#ffffff",
        dotOff: "rgba(255, 255, 255, 0.35)",
        brandBorder: "transparent",
      };

    // Dark ground with a soft accent glow; the logo pill stays light so the navy mark reads
    case "night":
      return {
        name,
        background: `radial-gradient(circle at 50% 38%, ${accent.fill}40 0%, #121215 62%)`,
        text: "#ededf0",
        muted: "#a0a0aa",
        surface: "#1c1c22",
        surfaceText: "#ededf0",
        surfaceMuted: "#a0a0aa",
        shadow: "0 0 0 2px rgba(255, 255, 255, 0.06), 0 40px 90px rgba(0, 0, 0, 0.5)",
        placeholderBg: "#26262d",
        placeholderBorder: "#4a4a55",
        ringTrack: "rgba(255, 255, 255, 0.10)",
        ringFill: accent.fill,
        word: accent.fill,
        underline: accent.fill,
        // a near-opaque dark chip: an 18% accent tint sat on the accent glow, and
        // mint text on it was barely readable
        pillBg: "rgba(18, 18, 21, 0.78)",
        pillText: accent.fill,
        dotOn: accent.fill,
        dotOff: "rgba(255, 255, 255, 0.18)",
        brandBg: "#ededf0",
        brandBorder: "transparent",
        brandText: colors.ink900,
        brandMuted: colors.ink600,
      };

    // No card: big left-aligned type, full-width picture band, letter blanks as a hint
    case "editorial":
      return {
        name,
        ...light(accent),
        background: colors.surface,
        placeholderBg: accent.soft,
        placeholderBorder: `${accent.fill}66`,
        pillBg: "transparent",
      };
  }
};
