import data from "@/content/dictionary/glossary.json";
import type { GlossEntry, PartOfSpeech } from "@/lib/dictionary/types";
import { makeLookup, wordKey, type Glossary } from "@/lib/dictionary/lookup";
import { editDistance } from "@/lib/vocab/answer";

// The shared dictionary for listening, reading and the word review (ADR 0010, 0016).
// Server side only: importing this from a client component would ship the whole file to the browser.
// Client components get a slice from `glossaryFor` and look words up with `makeLookup`.

const G = data as Glossary;
const full = makeLookup(G);

export { POS_LABEL, wordKey } from "@/lib/dictionary/lookup";
export const { lookupWord, phraseAt, entryForLemma } = full;

/** Dictionary words (lemmas and forms) one edit away from `word`, leaving out forms of `lemma` itself. */
export function nearbyWords(word: string, lemma: string): string[] {
  return [...Object.keys(G.lemmas), ...Object.keys(G.forms)].filter(
    (k) => Math.abs(k.length - word.length) <= 1 && k !== word && full.lemmaOf(k) !== lemma && editDistance(k, word) <= 1,
  );
}

/** Single-word entries with this part of speech (e.g. distractors for a listen card). */
export function entriesByPos(pos: PartOfSpeech): GlossEntry[] {
  return Object.entries(G.lemmas)
    .filter(([, e]) => e.pos === pos)
    .map(([lemma, e]) => ({ lemma, ...e }));
}

/**
 * Just the entries needed to tap every word and dictionary phrase in these sentences (ADR 0016).
 * Phrases keep the full dictionary's order, so a slice picks the same phrase as the whole file.
 */
export function glossaryFor(sentences: string[][]): Glossary {
  const lemmas = new Set<string>();
  const forms = new Set<string>();
  const phrases = new Set<string>();

  function addWord(key: string) {
    if (G.lemmas[key]) {
      lemmas.add(key);
    } else if (G.forms[key]) {
      forms.add(key);
      if (G.lemmas[G.forms[key]]) lemmas.add(G.forms[key]);
    } else if (key.endsWith("'s")) {
      addWord(key.slice(0, -2));
    }
  }

  for (const tokens of sentences) {
    const keys = tokens.map(wordKey);
    keys.forEach((key, i) => {
      addWord(key);
      const phrase = full.phraseAt(keys, i);
      if (phrase) phrases.add(phrase.entry.lemma);
    });
  }

  const pick = <T,>(source: Record<string, T>, keep: Set<string>) =>
    Object.fromEntries(Object.entries(source).filter(([k]) => keep.has(k)));
  return { lemmas: pick(G.lemmas, lemmas), forms: pick(G.forms, forms), phrases: pick(G.phrases, phrases) };
}
