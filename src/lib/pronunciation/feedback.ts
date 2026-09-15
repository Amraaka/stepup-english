// Turns scores into short Mongolian advice (ADR 0011). Pure, provider-neutral.
// The sound tips target common trouble spots for Mongolian speakers; have an
// English teacher review the wording before this feature launches.

import type { Feedback, PronunciationResult, Tip } from "./types";

const LOW = 60;
const RETRY_BELOW = 80;

type SoundTip = { id: string; phonemes: string[]; title: string; body: string };

const SOUND_TIPS: SoundTip[] = [
  {
    id: "th-voiceless",
    phonemes: ["θ"],
    title: "\"th\" авиа (think)",
    body: "Хэлнийхээ үзүүрийг дээд, доод шүдний завсар зөөлөн хавчуулаад амьсгалаа үлээгээрэй. \"с\" эсвэл \"ф\" болгож хэлэхгүй байхыг анхаараарай.",
  },
  {
    id: "th-voiced",
    phonemes: ["ð"],
    title: "\"th\" авиа (the, this)",
    body: "Хэлээ шүдний завсар хавчуулаад хоолойгоо чичирхийлүүлж хэлээрэй. \"з\" эсвэл \"д\" шиг сонсогдох ёсгүй.",
  },
  {
    id: "w",
    phonemes: ["w"],
    title: "\"w\" авиа",
    body: "Уруулаа дугуйлж урагш сунгаад эхлээрэй. Доод уруулаа шүдэндээ хүргэвэл \"v\" болчихно.",
  },
  {
    id: "v",
    phonemes: ["v"],
    title: "\"v\" авиа",
    body: "Дээд шүдээ доод уруул дээрээ зөөлөн тавиад дуугаргаарай. Уруулаа дугуйлбал \"w\" болчихно.",
  },
  {
    id: "r",
    phonemes: ["ɹ", "r"],
    title: "\"r\" авиа",
    body: "Англи \"r\"-г монгол \"р\" шиг чичирхийлүүлж хэлдэггүй. Хэлээ бага зэрэг дээш нугалаад тагнайд хүргэлгүйгээр хэлээрэй.",
  },
  {
    id: "l",
    phonemes: ["l"],
    title: "\"l\" авиа",
    body: "Хэлнийхээ үзүүрийг дээд шүдний ард тулгаад хэлээрэй.",
  },
  {
    id: "i-length",
    phonemes: ["iː", "i", "ɪ"],
    title: "Урт, богино \"и\"",
    body: "sheep (урт) болон ship (богино) хоёрыг ялгаарай. Богино \"ɪ\"-г сул, товч хэлнэ.",
  },
  {
    id: "ae",
    phonemes: ["æ"],
    title: "\"æ\" авиа (cat, bad)",
    body: "Амаа \"э\" хэлэхээс илүү том ангайж, \"а\", \"э\" хоёрын дунд хэлээрэй.",
  },
];

const VOWEL = /[aeiouæɑɒɔəɚɛɜɝɪʊʌ]/;

function add(map: Map<string, Set<string>>, id: string, word: string) {
  (map.get(id) ?? map.set(id, new Set()).get(id)!).add(word);
}

export function buildFeedback(result: PronunciationResult, maxTips = 3): Feedback {
  const level = result.overall >= 85 ? "great" : result.overall >= 65 ? "good" : "practice";
  const summary = {
    great: "Маш сайн! Дуудлага тань ойлгомжтой байна.",
    good: "Сайн байна. Шар, улаанаар тэмдэглэсэн үгсээ дахин нэг хэлээд үзээрэй.",
    practice: "Эх бичлэгээ дахин сонсоод, доорх зөвлөгөөг дагаж давтаарай.",
  }[level];

  const spoken = result.words.filter((w) => w.error !== "insertion");
  const retry = spoken
    .filter((w) => w.error === "omission" || w.accuracy < RETRY_BELOW)
    .sort((a, b) => (a.error === "omission" ? -1 : a.accuracy) - (b.error === "omission" ? -1 : b.accuracy))
    .map((w) => w.word)
    .filter((w, i, all) => all.indexOf(w) === i)
    .slice(0, 5);

  const hits = new Map<string, Set<string>>();
  for (const w of spoken) {
    if (w.error === "omission") {
      add(hits, "omission", w.word);
      continue;
    }
    w.phonemes.forEach((p, i) => {
      if (p.accuracy >= LOW) return;
      const tip = SOUND_TIPS.find((t) => t.phonemes.includes(p.phoneme));
      if (tip) add(hits, tip.id, w.word);
      else if (i === w.phonemes.length - 1 && !VOWEL.test(p.phoneme)) add(hits, "final", w.word);
    });
  }

  const tips: Tip[] = [];
  const words = (id: string) => [...(hits.get(id) ?? [])].slice(0, 3);
  if (hits.has("omission")) {
    tips.push({
      id: "omission",
      title: "Алгассан үг байна",
      body: "Зарим үгийг хэлээгүй байна. Өгүүлбэрээ арай удаан, үг бүрийг тодорхой хэлээд үзээрэй.",
      words: words("omission"),
    });
  }
  SOUND_TIPS.filter((t) => hits.has(t.id))
    .sort((a, b) => hits.get(b.id)!.size - hits.get(a.id)!.size)
    .forEach((t) => tips.push({ id: t.id, title: t.title, body: t.body, words: words(t.id) }));
  if (hits.has("final")) {
    tips.push({
      id: "final",
      title: "Үгийн төгсгөлийн авиа",
      body: "Үгийн сүүлийн гийгүүлэгчийг (жишээ нь -d, -t, -s) залгилгүй, тод хэлээрэй.",
      words: words("final"),
    });
  }
  if (result.fluency < LOW) {
    tips.push({
      id: "fluency",
      title: "Урсгал",
      body: "Үг хооронд удаан завсарлахгүйгээр, эх бичлэг шиг холбож хэлээрэй.",
      words: [],
    });
  }

  return { level, summary, retry, tips: tips.slice(0, maxTips) };
}
