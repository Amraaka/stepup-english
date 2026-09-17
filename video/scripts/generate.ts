// Buys missing voice clips with OpenAI TTS. This is the only paid step: pictures are
// hand-drawn SVGs, so no image API is ever called.
//
//   npm run generate [slug|file.json ...]    (no args = every quiz)
//
// - skips clips that already exist
// - reuses a word or sentence already voiced in any quiz instead of buying it again
// - buys up to 4 clips at once and retries rate limits / server errors
// - saves the quiz after each clip, so an interrupted run loses nothing it paid for
import { existsSync } from "node:fs";
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import type { Quiz } from "../src/types.ts";
import { allSlugs, inPublic, loadEnv, loadQuiz, parseArgs, printReport, quizPath, resolveSlugs, slugify, validate, wireImages } from "./lib.ts";

export type GenerateResult = { bought: number; reused: number; seconds: number };

const key = (text: string) => text.trim().toLowerCase();
// gpt-4o-mini-tts returns 128 kbps mp3: 16,000 bytes ≈ 1 second
const secondsOf = (bytes: number) => bytes / 16000;
// OpenAI's published estimate for gpt-4o-mini-tts output
const COST_PER_MINUTE = 0.015;

export async function generate(slugs: string[], concurrency = 4): Promise<GenerateResult> {
  loadEnv();
  const model = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
  const voice = process.env.OPENAI_TTS_VOICE ?? "alloy";
  const instructions =
    process.env.OPENAI_TTS_INSTRUCTIONS ?? "Speak clearly and naturally, at a slightly slow pace, for adult English learners.";

  const tts = async (text: string): Promise<Buffer> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing — copy .env.example to .env and add it");
    const body: Record<string, string> = { model, voice, input: text, response_format: "mp3" };
    // only the gpt-4o voices take speaking instructions; tts-1 rejects the field
    if (model.startsWith("gpt-4o")) body.instructions = instructions;

    for (let attempt = 1; ; attempt++) {
      let status = 0;
      let detail = "";
      try {
        const res = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) return Buffer.from(await res.arrayBuffer());
        status = res.status;
        detail = (await res.text()).slice(0, 200);
      } catch (e) {
        detail = (e as Error).message; // network error: worth a retry
      }
      const retryable = status === 0 || status === 429 || status >= 500;
      if (!retryable || attempt >= 4) throw new Error(`TTS ${status || "network"} for "${text}": ${detail}`);
      await sleep(1000 * 2 ** attempt);
    }
  };

  // Everything already voiced anywhere, keyed by what is spoken.
  const voiced = new Map<string, string>();
  for (const s of allSlugs()) {
    for (const it of loadQuiz(s).items) if (it.audio && existsSync(inPublic(it.audio))) voiced.set(key(it.en), it.audio);
  }
  const inflight = new Map<string, Promise<string>>();

  // One write at a time per quiz file.
  const quizzes = new Map<string, Quiz>(slugs.map((s) => [s, loadQuiz(s)]));
  const writing = new Map<string, Promise<void>>();
  const save = (slug: string) => {
    const next = (writing.get(slug) ?? Promise.resolve()).then(() =>
      writeFile(quizPath(slug), JSON.stringify(quizzes.get(slug), null, 2) + "\n"),
    );
    writing.set(slug, next);
    return next;
  };

  const jobs: { slug: string; i: number }[] = [];
  for (const [slug, q] of quizzes) {
    if (wireImages(q)) await save(slug);
    q.items.forEach((it, i) => {
      if (!it.audio || !existsSync(inPublic(it.audio))) jobs.push({ slug, i });
    });
  }

  const result: GenerateResult = { bought: 0, reused: 0, seconds: 0 };
  const failures: string[] = [];

  const run = async (slug: string, i: number) => {
    const it = quizzes.get(slug)!.items[i];
    const k = key(it.en);
    const dest = `audio/${slug}/${slugify(it.en) || `item-${i + 1}`}.mp3`;
    await mkdir(path.dirname(inPublic(dest)), { recursive: true });

    let source = voiced.get(k);
    if (!source) {
      let pending = inflight.get(k);
      if (!pending) {
        // first request for this text in this run: buy it
        pending = tts(it.en).then(async (buf) => {
          await writeFile(inPublic(dest), buf);
          voiced.set(k, dest);
          result.bought++;
          result.seconds += secondsOf(buf.length);
          console.log(`voice  ${slug}/${it.en}`);
          return dest;
        });
        inflight.set(k, pending);
      }
      source = await pending;
      if (source === dest) {
        it.audio = dest;
        await save(slug);
        return;
      }
    }

    if (source !== dest) await copyFile(inPublic(source), inPublic(dest));
    it.audio = dest;
    result.reused++;
    console.log(`reuse  ${slug}/${it.en}`);
    await save(slug);
  };

  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const { slug, i } = jobs[next++];
      await run(slug, i).catch((e: Error) => failures.push(e.message));
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker));
  await Promise.all(writing.values());

  if (failures.length) throw new Error(`${failures.length} clip(s) failed:\n  ${failures.join("\n  ")}`);
  return result;
}

export const describe = (r: GenerateResult) =>
  r.bought === 0
    ? `voice: nothing to buy${r.reused ? `, ${r.reused} reused free` : ""}`
    : `voice: ${r.bought} bought (~${r.seconds.toFixed(1)}s, ~$${((r.seconds / 60) * COST_PER_MINUTE).toFixed(4)}), ${r.reused} reused free`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { flags, rest } = parseArgs(process.argv.slice(2));
  const slugs = resolveSlugs(rest, { all: flags.has("all") || rest.length === 0 });

  // never spend money on a quiz that won't render correctly
  const ok = slugs.filter((s) => {
    const r = validate(loadQuiz(s));
    if (r.errors.length) printReport(s, r);
    return r.errors.length === 0;
  });
  if (ok.length < slugs.length) console.log(`\nskipping ${slugs.length - ok.length} quiz(zes) with errors\n`);

  const r = await generate(ok);
  console.log(describe(r));
}
