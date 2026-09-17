// Checks quiz text without spending anything. JSON files are checked in place (not copied).
//
//   npm run check [slug|file.json ...]    (no args = every quiz in quizzes/)
//   npm run check -- --ideas              every idea in ideas/
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Quiz } from "../src/types.ts";
import { allSlugs, loadQuiz, parseArgs, printReport, root, validate } from "./lib.ts";

const { flags, rest } = parseArgs(process.argv.slice(2));

const ideaFiles = () => {
  const dir = path.join(root, "ideas");
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(dir, f))
    .sort();
};

const targets: [string, Quiz][] = flags.has("ideas")
  ? ideaFiles().map((f) => [path.relative(root, f), JSON.parse(readFileSync(f, "utf8"))])
  : (rest.length ? rest : allSlugs()).map((a) =>
      a.endsWith(".json") ? [a, JSON.parse(readFileSync(a, "utf8"))] : [a, loadQuiz(a)],
    );

let failed = 0;
for (const [name, quiz] of targets) {
  const r = validate(quiz);
  printReport(name, r);
  if (r.errors.length) failed++;
}
console.log(`\n${targets.length - failed}/${targets.length} ready`);
process.exit(failed ? 1 : 0);
