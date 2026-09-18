// Prints each sentence of a reading text with the meaning a learner sees when tapping each word (ADR 0021).
// Used to review glosses in context: a word whose meaning doesn't fit the sentence needs a better
// entry or a phrase.
//
//   npx tsx --tsconfig tsconfig.json scripts/reading/gloss_view.ts <slug> [--new <glosses.json>]
//
// --new overlays a staged batch (same shape as glossary.json) on the dictionary, so a batch can be
// reviewed before it is merged.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import data from "@/content/dictionary/glossary.json";
import { makeLookup, wordKey, type Glossary } from "@/lib/dictionary/lookup";
import { isTappable } from "@/components/words/tappable-tokens";

const args = process.argv.slice(2);
const slug = args[0];
const overlayAt = args.indexOf("--new");
const base = data as Glossary;
const overlay: Glossary =
  overlayAt >= 0 ? JSON.parse(readFileSync(args[overlayAt + 1], "utf-8")) : { lemmas: {}, forms: {}, phrases: {} };
const g: Glossary = {
  lemmas: { ...base.lemmas, ...overlay.lemmas },
  forms: { ...base.forms, ...overlay.forms },
  phrases: { ...base.phrases, ...overlay.phrases },
};
const { lookupWord, phraseAt } = makeLookup(g);

const catalog = JSON.parse(readFileSync(join(process.cwd(), "src/content/reading/catalog.json"), "utf-8")) as {
  slug: string;
  paragraphs: string[][][];
}[];
const text = catalog.find((t) => t.slug === slug);
if (!text) {
  console.error(`No text "${slug}" in the catalog. Run scripts/reading/build_text.py first.`);
  process.exit(1);
}

text.paragraphs.forEach((paragraph, p) => {
  paragraph.forEach((sentence, s) => {
    console.log(`\n[${p + 1}.${s + 1}] ${sentence.join(" ")}`);
    const keys = sentence.map(wordKey);
    let j = 0;
    while (j < keys.length) {
      const phrase = phraseAt(keys, j);
      if (phrase && phrase.start === j) {
        console.log(`   «${phrase.entry.lemma}» (${phrase.entry.pos}) ${phrase.entry.mn}`);
        j = phrase.end;
        continue;
      }
      if (isTappable(keys[j])) {
        const e = lookupWord(keys[j]);
        console.log(`   ${keys[j]}${e && e.lemma !== keys[j] ? ` → ${e.lemma}` : ""}: ${e ? `(${e.pos}) ${e.mn}` : "?? MISSING"}`);
      }
      j++;
    }
  });
});
