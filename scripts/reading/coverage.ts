// Lists words in reading texts that the dictionary can't explain (ADR 0017).
//
//   npx tsx --tsconfig tsconfig.json scripts/reading/coverage.ts [slug ...]
//
// Every tappable word should have an entry (directly, through `forms`, or inside a tagged
// phrase). Exits with 1 when something is missing, so it can run before publishing.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { lookupWord, phraseAt, wordKey } from "@/lib/dictionary/glossary";
import { isTappable } from "@/components/words/tappable-tokens";

const DIR = join(process.cwd(), "src/content/reading");
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync(DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.slice(0, -5));

let missingTotal = 0;
for (const slug of slugs) {
  const paragraphs = JSON.parse(readFileSync(join(DIR, `${slug}.json`), "utf-8")) as string[][][];
  const missing = new Map<string, { count: number; example: string }>();
  for (const sentence of paragraphs.flat()) {
    const keys = sentence.map(wordKey);
    keys.forEach((key, j) => {
      if (!isTappable(key) || lookupWord(key) || phraseAt(keys, j)) return;
      const m = missing.get(key) ?? { count: 0, example: sentence.join(" ") };
      m.count += 1;
      missing.set(key, m);
    });
  }
  missingTotal += missing.size;
  console.log(`\n${slug}: ${missing.size} words without an entry`);
  for (const [key, m] of [...missing].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))) {
    console.log(`  ${key.padEnd(18)} ${String(m.count).padStart(2)}  ${m.example.slice(0, 90)}`);
  }
}
process.exit(missingTotal ? 1 : 0);
