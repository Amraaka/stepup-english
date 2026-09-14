export type Tone = "coral" | "sky" | "mint" | "sun" | "violet" | "teal" | "rose";

/** Static class strings per tone (kept whole so Tailwind can see them). */
export const TONE: Record<
  Tone,
  { solid: string; soft: string; text: string; icon: string; press: string }
> = {
  coral: {
    solid: "bg-coral-a",
    soft: "bg-coral-soft",
    text: "text-coral-a-text",
    icon: "text-coral-a",
    press: "[--press:var(--coral-deep)]",
  },
  sky: {
    solid: "bg-sky",
    soft: "bg-sky-soft",
    text: "text-sky-text",
    icon: "text-sky",
    press: "[--press:var(--sky-deep)]",
  },
  mint: {
    solid: "bg-mint",
    soft: "bg-mint-soft",
    text: "text-mint-text",
    icon: "text-mint",
    press: "[--press:var(--mint-deep)]",
  },
  sun: {
    solid: "bg-sun",
    soft: "bg-sun-soft",
    text: "text-sun-text",
    icon: "text-sun-icon",
    press: "[--press:var(--sun-deep)]",
  },
  violet: {
    solid: "bg-violet",
    soft: "bg-violet-soft",
    text: "text-violet-text",
    icon: "text-violet",
    press: "[--press:var(--violet-deep)]",
  },
  teal: {
    solid: "bg-teal",
    soft: "bg-teal-soft",
    text: "text-teal-text",
    icon: "text-teal",
    press: "[--press:var(--teal-deep)]",
  },
  rose: {
    solid: "bg-rose",
    soft: "bg-rose-soft",
    text: "text-rose-text",
    icon: "text-rose",
    press: "[--press:var(--rose-deep)]",
  },
};
