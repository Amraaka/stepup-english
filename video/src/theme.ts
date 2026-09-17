import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont } from "@remotion/google-fonts/Manrope";

// Brand palette — docs/decisions/0004-brand-identity.md
export const colors = {
  ink900: "#1a1a1f",
  ink600: "#5c5c66",
  ink400: "#a0a0aa",
  canvas: "#f6f6f8",
  surface: "#ffffff",
  line: "rgba(160, 160, 170, 0.22)",
  locked: "#e4e4ea",
  coral: "#ff5a3c",
  coralText: "#c8361b",
  coralSoft: "#ffe4dd",
};

// Per-topic accent from the skill tones (ADR 0007). `word` is the large-text
// color: the -deep tone where the bright fill is too light on white.
export const accents = {
  coral: { fill: "#ff5a3c", soft: "#ffe4dd", word: "#ff5a3c", deep: "#c8361b" },
  sky: { fill: "#2f7ff0", soft: "#dcebff", word: "#1d5fc0", deep: "#1d5fc0" },
  mint: { fill: "#1fb57a", soft: "#d5f4e6", word: "#138a5a", deep: "#138a5a" },
  sun: { fill: "#f5a300", soft: "#ffefc7", word: "#b87900", deep: "#b87900" },
  violet: { fill: "#7b5cfa", soft: "#e7e1ff", word: "#5a3ee0", deep: "#5a3ee0" },
} as const;
export type AccentName = keyof typeof accents;
export type Accent = (typeof accents)[AccentName];

// Reels/TikTok overlay the bottom ~25% and the right edge; keep content inside this box
export const SAFE = { top: 170, bottom: 1440, cardWidth: 820 };

export const { fontFamily } = loadFont("normal", {
  weights: ["500", "700", "800"],
  // Ү and Ө live in cyrillic-ext
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

// Manrope has no IPA symbols (ɪ ŋ ɚ ˈ), so pronunciation uses Inter, whose latin-ext covers them
export const { fontFamily: ipaFontFamily } = loadInter("normal", {
  weights: ["500"],
  // θ (think, three) is a Greek code point, so IPA needs the greek subset too
  subsets: ["latin", "latin-ext", "greek"],
});

// Timing, in frames at 30fps
export const FPS = 30;
export const CARD_IN = 15;
export const THINK = 3 * FPS; // the 3-2-1 countdown
export const REVEAL = 2 * FPS;
export const ITEM = CARD_IN + THINK + REVEAL;
export const END = 2 * FPS;

// Background music level (0–1); it ducks lower under each answer
export const MUSIC_VOLUME = 0.18;
// 8 bars at 100 BPM = 19.2s; must match music() in scripts/make-sfx.ts
export const MUSIC_LOOP_FRAMES = Math.round(19.2 * FPS);
