// Shared by generate / render / make / check / new.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { WHERE_PREPOSITIONS, answerSlot } from "../src/order.ts";
import type { FormatName, Quiz, QuizItem } from "../src/types.ts";

export const root = path.resolve(import.meta.dirname, "..");
export const inPublic = (p: string) => path.join(root, "public", p);
export const quizPath = (slug: string) => path.join(root, "quizzes", `${slug}.json`);
export const templatesDir = path.join(root, "templates");

export const FORMATS: FormatName[] = [
  "picture",
  "fix-mistake",
  "silent-letter",
  "gap-fill",
  "word-stress",
  "opposites",
  "odd-one-out",
  "sound-pair",
  "unscramble",
  "where-is-it",
  "mini-dialogue",
];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const loadEnv = () => {
  try {
    process.loadEnvFile(path.join(root, ".env"));
  } catch {
    // no .env — rely on the shell environment
  }
};

export const loadQuiz = (slug: string): Quiz => JSON.parse(readFileSync(quizPath(slug), "utf8"));

export const allSlugs = () =>
  readdirSync(path.join(root, "quizzes"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .sort();

export const parseArgs = (argv: string[]) => ({
  flags: new Set(argv.filter((a) => a.startsWith("--")).map((a) => a.slice(2))),
  rest: argv.filter((a) => !a.startsWith("--")),
});

/**
 * CLI args → quiz slugs. An arg is a slug (quizzes/<slug>.json) or a path to a
 * .json file anywhere, which is copied into quizzes/ under its own slug.
 */
export function resolveSlugs(args: string[], { all = false } = {}): string[] {
  if (all) return allSlugs();
  const out: string[] = [];
  for (const arg of args) {
    if (!arg.endsWith(".json")) {
      if (!existsSync(quizPath(arg))) throw new Error(`no quiz "${arg}" (looked for quizzes/${arg}.json)`);
      out.push(arg);
      continue;
    }
    const src = path.resolve(arg);
    if (!existsSync(src)) throw new Error(`${arg} not found`);
    const text = readFileSync(src, "utf8");
    const slug = (JSON.parse(text) as Quiz).slug || path.basename(arg, ".json");
    const dest = quizPath(slug);
    if (dest !== src) {
      if (existsSync(dest) && readFileSync(dest, "utf8") !== text) {
        throw new Error(`quizzes/${slug}.json already exists and differs from ${arg} — change the slug or delete the old file`);
      }
      writeFileSync(dest, text);
      console.log(`copied ${arg} → quizzes/${slug}.json`);
    }
    out.push(slug);
  }
  return [...new Set(out)];
}

/** Point picture items at their hand-drawn SVG once it exists. Returns whether anything changed. */
export function wireImages(q: Quiz): boolean {
  if ((q.format ?? "picture") !== "picture") return false;
  let changed = false;
  for (const it of q.items) {
    const svg = `img/${q.slug}/${slugify(it.en)}.svg`;
    if (!it.image && existsSync(inPublic(svg))) {
      it.image = svg;
      changed = true;
    }
  }
  return changed;
}

// ---------------------------------------------------------------------------
// Checking — everything that can be caught before money is spent or a render runs
// ---------------------------------------------------------------------------

// Glyphs the IPA font (Inter: latin, latin-ext, greek) can draw; anything else renders as a blank box.
const IPA_RANGES = (
  "0000-00FF 0131 0152-0153 02BB-02BC 02C6 02DA 02DC 0304 0308 0329 2000-206F 20AC 2122 2191 2193 2212 2215 " +
  "0100-02BA 02BD-02C5 02C7-02CC 02CE-02D7 02DD-02FF 1D00-1DBF 1E00-1E9F 1EF2-1EFF 2020 20A0-20AB 20AD-20C0 2113 2C60-2C7F A720-A7FF " +
  "0370-0377 037A-037F 0384-038A 038C 038E-03A1 03A3-03FF"
)
  .split(" ")
  .map((r) => r.split("-").map((h) => parseInt(h, 16)))
  .map(([a, b]) => [a, b ?? a] as const);

const drawable = (ch: string) => {
  const cp = ch.codePointAt(0)!;
  return IPA_RANGES.some(([a, b]) => cp >= a && cp <= b);
};
const undrawable = (s: string) =>
  [...new Set([...s].filter((c) => !drawable(c)))].map((c) => `${c} (U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")})`);

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

/** Which option is the answer, for formats that shuffle their options. */
const answerKey = (format: FormatName, it: QuizItem): [string, number] | null => {
  switch (format) {
    case "fix-mistake":
      return [it.en, 2];
    case "gap-fill":
      return it.options?.length ? [it.options[0], it.options.length] : null;
    case "sound-pair":
    case "odd-one-out":
      return it.options?.length ? [it.en, it.options.length] : null;
    case "where-is-it":
      return it.answer && it.options?.length ? [it.answer, it.options.length] : null;
    default:
      return null;
  }
};

export type Report = { errors: string[]; warnings: string[] };

export function validate(q: Quiz): Report {
  const errors: string[] = [];
  const warnings: string[] = [];
  const format = (q.format ?? "picture") as FormatName;

  if (!q.slug || !/^[a-z0-9-]+$/.test(q.slug)) errors.push("slug must use only lowercase letters, digits and dashes");
  if (!FORMATS.includes(format)) errors.push(`unknown format "${format}" — one of: ${FORMATS.join(", ")}`);
  if (!q.topic?.trim()) errors.push("topic (the Mongolian label at the top) is missing");
  if (!Array.isArray(q.items) || q.items.length === 0) {
    errors.push("items is empty");
    return { errors, warnings };
  }
  const seen = new Set<string>();
  for (const it of q.items) {
    const k = (it.en ?? "").trim().toLowerCase();
    if (k && seen.has(k)) errors.push(`"${it.en}" appears twice — each card needs a different en`);
    seen.add(k);
  }
  if (q.items.length > 8) warnings.push(`${q.items.length} items — each takes 5s, so this video runs ${q.items.length * 5 + 2}s`);

  q.items.forEach((it, i) => {
    const at = `item ${i + 1} (${it.en || "?"})`;
    const err = (m: string) => errors.push(`${at}: ${m}`);
    const warn = (m: string) => warnings.push(`${at}: ${m}`);

    if (!it.en?.trim()) return err("en is missing");
    if (!it.mn?.trim()) warn("mn (Mongolian) is empty");
    if (it.ipa && undrawable(it.ipa).length) err(`ipa has characters the font can't draw: ${undrawable(it.ipa).join(", ")}`);

    switch (format) {
      case "picture":
        if (!it.image) warn(`no picture yet — draw public/img/${q.slug}/${slugify(it.en)}.svg`);
        break;

      case "fix-mistake":
        if (!it.wrong?.trim()) err("wrong (the incorrect sentence) is missing");
        else if (same(it.wrong, it.en)) err("wrong is the same as en");
        break;

      case "gap-fill": {
        const s = it.sentence ?? "";
        const blanks = s.split("___").length - 1;
        const o = it.options ?? [];
        if (blanks !== 1) err(`sentence needs exactly one ___ (found ${blanks})`);
        if (o.length < 2) err("options needs at least 2 choices, the correct one first");
        else if (blanks === 1 && !same(s.replace("___", o[0]), it.en)) err(`sentence with "${o[0]}" filled in doesn't match en`);
        if (new Set(o).size !== o.length) err("options has duplicates");
        break;
      }

      case "silent-letter": {
        const n = [...it.en].length;
        if (it.silentIndex == null || it.silentIndex < 0 || it.silentIndex >= n) err(`silentIndex must be 0–${n - 1}`);
        if (n > 9) warn("words over 9 letters get small tiles");
        break;
      }

      case "word-stress": {
        const sy = it.syllables ?? [];
        if (sy.length < 2) err("syllables needs at least 2 parts");
        else if (!same(sy.join(""), it.en)) err(`syllables join to "${sy.join("")}", not "${it.en}"`);
        if (it.stressIndex == null || it.stressIndex < 0 || it.stressIndex >= sy.length) err(`stressIndex must be 0–${Math.max(0, sy.length - 1)}`);
        break;
      }

      case "opposites":
        if (!it.prompt?.trim()) err("prompt (the word shown) is missing");
        else if (same(it.prompt, it.en)) err("prompt and en are the same word");
        break;

      case "sound-pair": {
        const o = it.options ?? [];
        if (o.length !== 2) err("options needs exactly 2 words");
        else if (!o.includes(it.en)) err("options must include en (the word that is spoken)");
        if (it.hints && it.hints.length !== o.length) warn("hints (IPA per option) should have one entry per option");
        for (const h of it.hints ?? []) if (undrawable(h).length) err(`hint ${h} has characters the font can't draw: ${undrawable(h).join(", ")}`);
        break;
      }

      case "odd-one-out": {
        const o = it.options ?? [];
        if (o.length < 3 || o.length > 4) err("options needs 3 or 4 words");
        else if (!o.includes(it.en)) err("options must include en (the odd one)");
        if (new Set(o).size !== o.length) err("options has duplicates");
        if (!it.mn) warn("mn should say why it doesn't belong");
        break;
      }

      case "unscramble":
        if (!/^[a-zA-Z]{3,10}$/.test(it.en)) err("en must be a single word of 3–10 letters");
        else if (new Set(it.en.toLowerCase()).size === 1) err("a word made of one repeated letter can't be scrambled");
        if (it.image && !existsSync(inPublic(it.image))) err(`image ${it.image} does not exist`);
        break;

      case "where-is-it": {
        const a = it.answer ?? "";
        const o = it.options ?? [];
        if (!WHERE_PREPOSITIONS.includes(a)) err(`answer must be one of: ${WHERE_PREPOSITIONS.join(", ")}`);
        else if (!` ${it.en.toLowerCase()} `.includes(` ${a} `)) err(`en must contain "${a}"`);
        if (o.length < 2) err("options needs at least 2 placements");
        else if (!o.includes(a)) err("options must include answer");
        break;
      }

      case "mini-dialogue":
        if (!it.prompt?.trim()) err("prompt (what the other person says) is missing");
        if (it.en.length > 60) warn("long replies wrap onto several lines");
        break;
    }
  });

  // A quiz whose answer sits in the same place on every card can be solved without reading.
  if (q.items.length >= 3) {
    const slots = q.items.map((it, i) => {
      const k = answerKey(format, it);
      return k ? answerSlot(k[0], i, k[1]) : null;
    });
    if (slots.every((s) => s !== null) && new Set(slots).size === 1) {
      warnings.push("the answer is in the same position on every card — reorder the items or reword one");
    }
  }

  return { errors, warnings };
}

export function printReport(slug: string, r: Report) {
  const status = r.errors.length ? "✗" : "✓";
  const tail = [r.errors.length && `${r.errors.length} error(s)`, r.warnings.length && `${r.warnings.length} warning(s)`].filter(Boolean).join(", ");
  console.log(`${status} ${slug}${tail ? `  — ${tail}` : ""}`);
  for (const e of r.errors) console.log(`    error   ${e}`);
  for (const w of r.warnings) console.log(`    warning ${w}`);
}
