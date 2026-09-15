import data from "@/content/listening/glossary.json";
import type { GlossEntry, PartOfSpeech } from "@/lib/listening/types";

type Entry = Omit<GlossEntry, "lemma">;
const G = data as {
  lemmas: Record<string, Entry>;
  forms: Record<string, string>;
  phrases: Record<string, Entry>;
};

export const POS_LABEL: Record<PartOfSpeech, string> = {
  n: "нэр үг",
  v: "үйл үг",
  adj: "тэмдэг нэр",
  adv: "дайвар үг",
  prep: "угтвар үг",
  conj: "холбоос үг",
  pron: "төлөөний үг",
  det: "тодотгогч",
  num: "тооны нэр",
  name: "оноосон нэр",
  phrase: "хэллэг",
};

/** "States." → "states", "country’s" → "country's", "U.S." → "us" */
export function wordKey(token: string): string {
  return token
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/[^a-z0-9'-]/g, "")
    .replace(/^['-]+|['-]+$/g, "");
}

function lemmaOf(key: string): string | null {
  if (G.lemmas[key]) return key;
  if (G.forms[key]) return G.forms[key];
  if (key.endsWith("'s")) return lemmaOf(key.slice(0, -2));
  return null;
}

export function lookupWord(key: string): GlossEntry | null {
  const lemma = lemmaOf(key);
  return lemma ? { lemma, ...G.lemmas[lemma] } : null;
}

/** Entry for a saved lemma — a word ("serve") or a phrase ("give up"). */
export function entryForLemma(lemma: string): GlossEntry | null {
  const e = G.lemmas[lemma] ?? G.phrases[lemma];
  return e ? { lemma, ...e } : null;
}

// Longest phrases first, so "is home to" wins over a shorter overlap.
const PHRASES = Object.keys(G.phrases)
  .map((p) => p.split(" "))
  .sort((a, b) => b.length - a.length);

/** The glossary phrase covering token `i`, as a [start, end) token range. */
export function phraseAt(keys: string[], i: number): { start: number; end: number; entry: GlossEntry } | null {
  for (const words of PHRASES) {
    for (let s = Math.max(0, i - words.length + 1); s <= i; s++) {
      if (words.every((w, j) => keys[s + j] === w)) {
        const lemma = words.join(" ");
        return { start: s, end: s + words.length, entry: { lemma, ...G.phrases[lemma] } };
      }
    }
  }
  return null;
}
