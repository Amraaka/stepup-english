// Word lookup over a dictionary value, with no data of its own, so client components can use it (ADR 0016).
// The full dictionary stays on the server (`glossary.ts`); pages pass a slice built by `glossaryFor`.

import type { GlossEntry, PartOfSpeech } from "@/lib/dictionary/types";

type Entry = Omit<GlossEntry, "lemma">;

/** The dictionary shape: `src/content/dictionary/glossary.json`, or a slice of it. */
export type Glossary = {
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

/** "States." → "states", "country’s" → "country's", "U.S." → "u.s." (not the pronoun "us") */
export function wordKey(token: string): string {
  const key = token.toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9.'-]/g, "");
  if (/^(?:[a-z]\.){2,}$/.test(key)) return key;
  return key.replace(/\./g, "").replace(/^['-]+|['-]+$/g, "");
}

export function makeLookup(g: Glossary) {
  function lemmaOf(key: string): string | null {
    if (g.lemmas[key]) return key;
    if (g.forms[key]) return g.forms[key];
    if (key.endsWith("'s")) return lemmaOf(key.slice(0, -2));
    return null;
  }

  // Longest phrases first, so "is home to" wins over a shorter overlap.
  const phrases = Object.keys(g.phrases)
    .map((p) => p.split(" "))
    .sort((a, b) => b.length - a.length);

  return {
    lemmaOf,

    lookupWord(key: string): GlossEntry | null {
      const lemma = lemmaOf(key);
      return lemma && g.lemmas[lemma] ? { lemma, ...g.lemmas[lemma] } : null;
    },

    /**
     * Entry for a saved lemma — a word ("serve") or a phrase ("give up"). A lemma that later became a form
     * ("tips" → "tip") gets its base entry, so words saved before the change still show a meaning.
     */
    entryForLemma(lemma: string): GlossEntry | null {
      const e = g.lemmas[lemma] ?? g.phrases[lemma];
      if (e) return { lemma, ...e };
      const base = g.forms[lemma];
      return base && g.lemmas[base] ? { lemma: base, ...g.lemmas[base] } : null;
    },

    /** The dictionary phrase covering token `i`, as a [start, end) token range. Inflected words match too ("national parks"). */
    phraseAt(keys: string[], i: number): { start: number; end: number; entry: GlossEntry } | null {
      const matches = (key: string | undefined, w: string) => key !== undefined && (key === w || lemmaOf(key) === w);
      for (const words of phrases) {
        for (let s = Math.max(0, i - words.length + 1); s <= i; s++) {
          if (words.every((w, j) => matches(keys[s + j], w))) {
            const lemma = words.join(" ");
            return { start: s, end: s + words.length, entry: { lemma, ...g.phrases[lemma] } };
          }
        }
      }
      return null;
    },
  };
}
