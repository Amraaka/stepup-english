// Starts a quiz from a template.
//
//   npm run new <format> <slug>
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { quizPath, templatesDir } from "./lib.ts";

const [format, slug] = process.argv.slice(2);
const formats = readdirSync(templatesDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.slice(0, -5))
  .sort();

if (!format || !slug) {
  console.log("usage: npm run new <format> <slug>\n\nformats:");
  for (const f of formats) {
    const t = JSON.parse(readFileSync(path.join(templatesDir, `${f}.json`), "utf8"));
    console.log(`  ${f.padEnd(15)} ${t.topic}`);
  }
  process.exit(1);
}
if (!formats.includes(format)) {
  console.error(`unknown format "${format}" — one of: ${formats.join(", ")}`);
  process.exit(1);
}
if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("slug must use only lowercase letters, digits and dashes");
  process.exit(1);
}
if (existsSync(quizPath(slug))) {
  console.error(`quizzes/${slug}.json already exists`);
  process.exit(1);
}

const quiz = JSON.parse(readFileSync(path.join(templatesDir, `${format}.json`), "utf8"));
quiz.slug = slug;
writeFileSync(quizPath(slug), JSON.stringify(quiz, null, 2) + "\n");
console.log(`created quizzes/${slug}.json — replace the example text, then:  npm run make ${slug}`);
