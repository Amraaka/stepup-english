// Text in, video out: check → voice → render, in one command.
//
//   npm run make fix-mistake-3                 a quiz in quizzes/
//   npm run make ~/Desktop/my-quiz.json        any quiz file (copied into quizzes/)
//   npm run make a b c                         several at once, bundled once
//   npm run make -- --all                      every quiz
//   npm run make -- --force <slug>             re-render even if up to date
//
// Nothing is bought or rendered if any quiz has errors.
import { describe, generate } from "./generate.ts";
import { loadQuiz, parseArgs, printReport, resolveSlugs, validate } from "./lib.ts";
import { render } from "./render.ts";

const { flags, rest } = parseArgs(process.argv.slice(2));
if (rest.length === 0 && !flags.has("all")) {
  console.log("usage: npm run make <slug|file.json ...>   (or: npm run make -- --all)");
  console.log("new quiz from a template: npm run new <format> <slug>");
  process.exit(1);
}

let slugs: string[];
try {
  slugs = resolveSlugs(rest, { all: flags.has("all") });
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}

console.log("1/3 check");
let failed = 0;
for (const s of slugs) {
  const r = validate(loadQuiz(s));
  printReport(s, r);
  if (r.errors.length) failed++;
}
if (failed) {
  console.error(`\n${failed} quiz(zes) have errors. Nothing was bought or rendered.`);
  process.exit(1);
}

console.log("\n2/3 voice");
const voice = await generate(slugs);
console.log(describe(voice));

console.log("\n3/3 video");
const done = await render(slugs, { force: flags.has("force") });

console.log(`\n${done.length} rendered, ${slugs.length - done.length} already up to date`);
for (const s of done) console.log(`  out/${s}.mp4`);
