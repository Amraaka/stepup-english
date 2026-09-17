// Renders quizzes to out/<slug>.mp4 plus out/<slug>-cover.png.
//
//   npm run render [slug|file.json ...] [--force]    (no args = every quiz)
//
// Bundles once, and skips any video already newer than its text, voice, pictures
// and the layout code. --force renders anyway.
import { bundle } from "@remotion/bundler";
import { openBrowser, renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { existsSync, readdirSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inPublic, loadQuiz, parseArgs, quizPath, resolveSlugs, root } from "./lib.ts";

// Keep in sync with src/theme.ts (theme.ts loads a web font, so it can't be imported here)
const CARD_IN = 15;

const outDir = path.join(root, "out");
export const videoPath = (slug: string) => path.join(outDir, `${slug}.mp4`);
const coverPath = (slug: string) => path.join(outDir, `${slug}-cover.png`);

const newestIn = (dir: string): number =>
  readdirSync(dir, { withFileTypes: true }).reduce((max, e) => {
    const p = path.join(dir, e.name);
    return Math.max(max, e.isDirectory() ? newestIn(p) : statSync(p).mtimeMs);
  }, 0);

/** Why a quiz needs rendering, or null if its video is current. */
export function staleReason(slug: string): string | null {
  if (!existsSync(videoPath(slug)) || !existsSync(coverPath(slug))) return "not rendered yet";
  const builtAt = Math.min(statSync(videoPath(slug)).mtimeMs, statSync(coverPath(slug)).mtimeMs);

  const inputs: [string, string][] = [[quizPath(slug), "text changed"]];
  for (const it of loadQuiz(slug).items) {
    if (it.audio) inputs.push([inPublic(it.audio), "voice changed"]);
    if (it.image) inputs.push([inPublic(it.image), "picture changed"]);
  }
  for (const [file, why] of inputs) if (existsSync(file) && statSync(file).mtimeMs > builtAt) return why;
  if (newestIn(path.join(root, "src")) > builtAt) return "layout code changed";
  return null;
}

export async function render(slugs: string[], { force = false } = {}): Promise<string[]> {
  const todo: [string, string][] = [];
  for (const slug of slugs) {
    const why = force ? "forced" : staleReason(slug);
    if (why) todo.push([slug, why]);
    else console.log(`skip   ${slug} (up to date)`);
  }
  if (todo.length === 0) return [];

  console.log("bundling…");
  const serveUrl = await bundle({
    entryPoint: path.join(root, "src/index.ts"),
    rootDir: root,
    publicDir: path.join(root, "public"),
  });
  await mkdir(outDir, { recursive: true });

  // One browser for every video, and fewer tabs on small machines: a long run of
  // renders on an 8 GB Mac was killed for running out of memory.
  const concurrency = Number(process.env.RENDER_CONCURRENCY) || (os.totalmem() <= 8 * 2 ** 30 ? 2 : null);
  const browser = await openBrowser("chrome");

  const done: string[] = [];
  try {
    for (const [slug, why] of todo) {
      const quiz = loadQuiz(slug);
      const missing = quiz.items.filter((it) => !it.audio || !existsSync(inPublic(it.audio))).length;
      if (missing) {
        console.log(`skip   ${slug}: ${missing} voice clip(s) missing — run generate first`);
        continue;
      }

      console.log(`render ${slug} (${why})`);
      const composition = await selectComposition({ serveUrl, id: "VocabQuiz", inputProps: quiz });
      let last = -1;
      await renderMedia({
        serveUrl,
        composition,
        inputProps: quiz,
        codec: "h264",
        puppeteerInstance: browser,
        concurrency,
        outputLocation: videoPath(slug),
        onProgress: ({ progress }) => {
          const pct = Math.floor(progress * 4) * 25;
          if (pct !== last) process.stdout.write(`  ${(last = pct)}%${pct === 100 ? "\n" : ""}`);
        },
      });
      // Cover: the first question with the countdown showing, for the Reel's cover image
      await renderStill({ serveUrl, composition, inputProps: quiz, frame: CARD_IN + 5, output: coverPath(slug), puppeteerInstance: browser });
      done.push(slug);
    }
  } finally {
    await browser.close({ silent: true });
  }
  return done;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { flags, rest } = parseArgs(process.argv.slice(2));
  const slugs = resolveSlugs(rest, { all: flags.has("all") || rest.length === 0 });
  const done = await render(slugs, { force: flags.has("force") });
  for (const s of done) console.log(`→ out/${s}.mp4`);
}
