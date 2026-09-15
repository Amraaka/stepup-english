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
    questions: [
      {
        prompt: "When was George Washington president?",
        options: ["From 1789 to 1797", "From 1776 to 1789", "From 1797 to 1799"],
        answer: 0,
        explain: "Бичлэгт \"He served from 1789 to 1797\" гэж хэлсэн.",
      },
      {
        prompt: "What did Washington create?",
        options: ["The cabinet and the State Department", "The British army", "The city of New York"],
        answer: 0,
        explain: "Тэр засгийн газрын гишүүдийг (cabinet) томилж, Гадаад хэргийн яамыг байгуулсан.",
      },
      {
        prompt: "What did he do at the end of his second term?",
        options: ["He simply returned home", "He became a general again", "He moved to New York"],
        answer: 0,
        explain: "\"President Washington simply returned home\" гэж хэлсэн. Эрх мэдлээ орхиод гэртээ харьсан.",
      },
    ],
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
    questions: [
      {
        prompt: "Where is most of the park?",
        options: ["In Wyoming", "In California", "In New York"],
        answer: 0,
        explain: "\"Most of the park lies within the western state of Wyoming\" гэж хэлсэн.",
      },
      {
        prompt: "Why is the park unusual?",
        options: ["It sits on top of an ancient super volcano", "It has no wild animals", "It is the smallest park in the U.S."],
        answer: 0,
        explain: "Йеллоустоун эртний супер галт уул дээр оршдог учраас онцгой.",
      },
      {
        prompt: "How often does Old Faithful erupt?",
        options: ["About every 90 minutes", "About every nine hours", "Once a year"],
        answer: 0,
        explain: "\"It erupts about every 90 minutes\" гэж хэлсэн. Ойролцоогоор 90 минут тутам оргилдог.",
      },
    ],
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
