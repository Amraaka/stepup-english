// Checks the coverage cutoffs (ADR 0022): median coverage of the graded reading texts and the clips per level.
//
//   npx tsx --tsconfig tsconfig.json scripts/dictionary/calibrate.ts
//
// Graded texts should sit around 95–97% for a learner at their own level.
// Pass five ranks (A1 … C1) to try other cutoffs without editing the code.

import { TEXTS } from "@/lib/reading/texts";
import { CLIPS } from "@/lib/listening/clips";
import { CEFR_LEVELS } from "@/lib/levels";
import { KNOWN_UP_TO, coverage } from "@/lib/dictionary/coverage";

const trial = process.argv.slice(2).map(Number);
if (trial.length === 5) CEFR_LEVELS.forEach((l, i) => (KNOWN_UP_TO[l] = trial[i]));

const median = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

console.log("text level  n   " + CEFR_LEVELS.map((l) => `as ${l}`.padStart(6)).join(""));
for (const level of CEFR_LEVELS) {
  const texts = TEXTS.filter((t) => t.level === level).map((t) => t.paragraphs.flat());
  if (!texts.length) continue;
  const row = CEFR_LEVELS.map((as) => String(median(texts.map((s) => coverage(s, { level: as, saved: {} }).percent))).padStart(6));
  console.log(`${level.padEnd(11)} ${String(texts.length).padEnd(3)} ${row.join("")}`);
}
for (const c of CLIPS) {
  const cov = CEFR_LEVELS.map((as) => coverage(c.segments.map((s) => s.tokens), { level: as, saved: {} }));
  console.log(`clip ${c.slug} (${c.level}): ${cov.map((x) => x.percent).join(" / ")}`);
  const own = cov[CEFR_LEVELS.indexOf(c.level)];
  console.log(`  new at ${c.level}: ${own.newWords.slice(0, 8).map((w) => `${w.lemma}×${w.count}`).join(", ")}`);
}
