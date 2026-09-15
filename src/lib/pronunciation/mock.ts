// Development-only stand-in for a speech provider, so the result UI can be built
// and checked without a key. Never enabled in production (see provider.ts), and the
// UI labels its output as sample data.

import type { PhonemeScore, PronunciationResult } from "./types";

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/** Rough letter-based phonemes, only enough to exercise the tips. */
function fakePhonemes(word: string): PhonemeScore[] {
  const out: PhonemeScore[] = [];
  const low = hash(word) % 3 === 0;
  for (let i = 0; i < word.length; i++) {
    const pair = word.slice(i, i + 2);
    if (pair === "th") {
      out.push({ phoneme: i === 0 && word.length <= 4 ? "ð" : "θ", accuracy: low ? 42 : 88 });
      i++;
    } else {
      const ch = word[i];
      const phoneme = ch === "r" ? "ɹ" : ch === "i" ? "ɪ" : ch;
      out.push({ phoneme, accuracy: low && (ch === "w" || ch === "v" || ch === "r") ? 50 : 85 + (hash(word + i) % 15) });
    }
  }
  return out;
}

export function mockAssessment(referenceText: string): PronunciationResult {
  const words = referenceText
    .toLowerCase()
    .replace(/[^a-z' -]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) => {
      const omitted = hash(referenceText) % 5 === 0 && i === 2;
      const phonemes = omitted ? [] : fakePhonemes(word);
      const accuracy = phonemes.length ? phonemes.reduce((s, p) => s + p.accuracy, 0) / phonemes.length : 0;
      return {
        word,
        accuracy: Math.round(accuracy),
        error: omitted ? ("omission" as const) : accuracy < 60 ? ("mispronunciation" as const) : ("none" as const),
        phonemes,
      };
    });
  const spoken = words.filter((w) => w.error !== "omission");
  const accuracy = spoken.reduce((s, w) => s + w.accuracy, 0) / Math.max(1, spoken.length);
  const completeness = (spoken.length / Math.max(1, words.length)) * 100;
  const fluency = 70 + (hash(referenceText) % 30);
  return {
    overall: Math.round(accuracy * 0.6 + fluency * 0.2 + completeness * 0.2),
    accuracy: Math.round(accuracy),
    fluency,
    completeness: Math.round(completeness),
    words,
  };
}
