import type { Clip, Segment } from "@/lib/listening/types";
import georgeWashington from "@/content/listening/timings/george-washington.json";
import yellowstone from "@/content/listening/timings/yellowstone.json";

// The catalog lives in code until clips need an editor (plan: docs/plans/listening-phase-1.md).
// Timings come from scripts/listening/align.py; texts are VOA-produced (public domain, ADR 0009).

export const CLIPS: Clip[] = [
  {
    slug: "george-washington",
    title: "George Washington – First President",
    summary: "АНУ-ын анхны ерөнхийлөгч Жорж Вашингтоны тухай богино түүх.",
    level: "A2",
    durationSec: 162,
    audio: "/listening/george-washington.mp3",
    source: {
      name: "VOA Learning English",
      url: "https://learningenglish.voanews.com/a/george-washington-first-president/7972056.html",
      license: "public-domain",
      credit: "Kelly Jean Kelly, Steve Ember, Jill Robbins · VOA Learning English",
    },
    segments: georgeWashington as Segment[],
  },
  {
    slug: "yellowstone",
    title: "Yellowstone: The World’s First National Park",
    summary: "Дэлхийн анхны үндэсний парк Йеллоустоун: гейзер, галт уул, зэрлэг амьтад.",
    level: "B1",
    durationSec: 240,
    audio: "/listening/yellowstone.mp3",
    source: {
      name: "VOA Learning English",
      url: "https://learningenglish.voanews.com/a/yellowstone-the-world-s-first-national-park/7974034.html",
      license: "public-domain",
      credit: "Andrew Smith · VOA Learning English",
    },
    segments: yellowstone as Segment[],
  },
];

export function getClip(slug: string): Clip | null {
  return CLIPS.find((c) => c.slug === slug) ?? null;
}

/** 162 → "2:42" */
export function fmtClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
