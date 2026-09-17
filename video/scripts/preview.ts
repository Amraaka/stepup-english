// Two stills per quiz — the first card while thinking, and after the reveal — so a
// layout can be checked in seconds instead of rendering the whole video. Free: no
// voice needed.
//
//   npm run preview <slug|file.json ...> [--item=N]    → out/preview/<slug>-think.png, -reveal.png
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { loadQuiz, parseArgs, resolveSlugs, root } from "./lib.ts";

// Keep in sync with src/theme.ts
const CARD_IN = 15;
const THINK = 90;
const ITEM = 165;

const argv = process.argv.slice(2);
const { rest } = parseArgs(argv);
const itemArg = argv.find((a) => a.startsWith("--item="));
const item = Math.max(1, Number(itemArg?.split("=")[1] ?? 1)) - 1;

if (rest.length === 0) {
  console.log("usage: npm run preview <slug|file.json ...> [--item=N]");
  process.exit(1);
}
const slugs = resolveSlugs(rest);

const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  rootDir: root,
  publicDir: path.join(root, "public"),
});
const dir = path.join(root, "out", "preview");
await mkdir(dir, { recursive: true });

for (const slug of slugs) {
  const quiz = loadQuiz(slug);
  const i = Math.min(item, quiz.items.length - 1);
  const composition = await selectComposition({ serveUrl, id: "VocabQuiz", inputProps: quiz });
  const shots: [string, number][] = [
    ["think", i * ITEM + CARD_IN + 30],
    ["reveal", i * ITEM + CARD_IN + THINK + 30],
  ];
  for (const [name, frame] of shots) {
    const output = path.join(dir, `${slug}-${name}.png`);
    await renderStill({ serveUrl, composition, inputProps: quiz, frame, output, scale: 0.5 });
  }
  console.log(`→ out/preview/${slug}-think.png, ${slug}-reveal.png  (item ${i + 1})`);
}
