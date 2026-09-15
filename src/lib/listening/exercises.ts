// Practice items generated from a clip's transcript (listening phase 3).
// Pure and deterministic for a seed, so the server and a retry build the same set.

import type { Clip, GlossEntry } from "./types";

export type QuestionItem = {
  kind: "question";
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type GapItem = {
  kind: "gap";
  id: string;
  seg: number;
  start: number;
  end: number;
  sentence: string;
  /** Sentence text before the blank, the punctuation stuck to it, and the rest. */
  before: string;
  trail: string;
  after: string;
  answer: string;
  lemma: string;
  options: string[];
};

export type DictationItem = {
  kind: "dictation";
  id: string;
  seg: number;
  start: number;
  end: number;
  tokens: string[];
};

export type PracticeItem = QuestionItem | GapItem | DictationItem;

const GAP_POS = new Set(["n", "v", "adj", "adv"]);
const HELPER_VERBS = new Set(["be", "have", "do", "can", "could", "will", "would", "should", "must", "may", "might"]);
const MAX_SENTENCE_SEC = 12;
const EDGE_PUNCT = /^[“"(‘]+|[.,!?;:”")’…—]+$/g;

function seeded(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  // mulberry32
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 3 questions, then up to 4 gap-fills, then up to 3 dictations. */
export function buildPractice(
  clip: Clip,
  lookup: (key: string) => GlossEntry | null,
  keyOf: (token: string) => string,
  seed: string,
): PracticeItem[] {
  const rand = seeded(seed);
  const items: PracticeItem[] = [];

  clip.questions.forEach((q, i) => {
    const order = shuffle(q.options.map((_, k) => k), rand);
    items.push({
      kind: "question",
      id: `q${i}`,
      prompt: q.prompt,
      options: order.map((k) => q.options[k]),
      answer: order.indexOf(q.answer),
      explain: q.explain,
    });
  });

  const fits = (si: number) => {
    const s = clip.segments[si];
    return s.end > s.start && s.end - s.start <= MAX_SENTENCE_SEC;
  };

  // Lowercase content words only: skips names, sentence-initial capitals, possessives
  // ("nation’s") and helper verbs, whose blanks grammar alone gives away.
  const words = clip.segments.flatMap((s, si) =>
    s.tokens.flatMap((tok, ti) => {
      const surface = tok.replace(EDGE_PUNCT, "");
      const entry = lookup(keyOf(tok));
      return entry &&
        GAP_POS.has(entry.pos) &&
        !HELPER_VERBS.has(entry.lemma) &&
        surface.length >= 4 &&
        /^[a-z]+$/.test(surface)
        ? [{ si, ti, surface, entry }]
        : [];
    }),
  );

  // Short, number-free sentences for dictation are scarce, so pick them before the gaps.
  const last = clip.segments.length - 1; // the reporter's sign-off
  const dictSegs = shuffle(
    clip.segments
      .map((s, si) => ({ s, si }))
      .filter(
        ({ s, si }) =>
          si !== last && fits(si) && s.tokens.length >= 4 && s.tokens.length <= 10 && !/\d/.test(s.tokens.join(" ")),
      ),
    rand,
  ).slice(0, 3);
  const inDictation = new Set(dictSegs.map((d) => d.si));

  const gapSegs = shuffle(
    [...new Set(words.map((w) => w.si))].filter((si) => fits(si) && !inDictation.has(si)),
    rand,
  );
  for (const si of gapSegs) {
    if (items.filter((i) => i.kind === "gap").length === 4) break;
    const inSentence = words.filter((w) => w.si === si);
    const w = inSentence[Math.floor(rand() * inSentence.length)];
    const seen = new Set([w.surface]);
    // Same part of speech and same form: a plain "wild" never gets an inflected "officials".
    const inflected = (o: { surface: string; entry: GlossEntry }) => o.surface !== o.entry.lemma;
    const pool = words.filter((o) => {
      if (o.entry.pos !== w.entry.pos || o.entry.lemma === w.entry.lemma || seen.has(o.surface)) return false;
      if (inflected(o) !== inflected(w)) return false;
      seen.add(o.surface);
      return true;
    });
    // Prefer distractors with the same ending ("-ed", "-s") so grammar alone doesn't give it away.
    const sameEnding = (o: { surface: string }) => (o.surface.slice(-2) === w.surface.slice(-2) ? 1 : 0);
    const distractors = shuffle(pool, rand)
      .sort((a, b) => sameEnding(b) - sameEnding(a))
      .slice(0, 3)
      .map((o) => o.surface);
    if (distractors.length < 2) continue;

    const seg = clip.segments[si];
    const tok = seg.tokens[w.ti];
    const at = tok.indexOf(w.surface);
    items.push({
      kind: "gap",
      id: `g${si}`,
      seg: si,
      start: seg.start,
      end: seg.end,
      sentence: seg.tokens.join(" "),
      before: [...seg.tokens.slice(0, w.ti), tok.slice(0, at)].filter(Boolean).join(" "),
      trail: tok.slice(at + w.surface.length),
      after: seg.tokens.slice(w.ti + 1).join(" "),
      answer: w.surface,
      lemma: w.entry.lemma,
      options: shuffle([w.surface, ...distractors], rand),
    });
  }

  for (const { s, si } of dictSegs) {
    items.push({ kind: "dictation", id: `d${si}`, seg: si, start: s.start, end: s.end, tokens: s.tokens });
  }

  return items;
}

// ── Dictation checking ──────────────────────────────────────────────────────

export type Mark = "ok" | "close" | "missed";
export type DictationResult = {
  /** One mark per expected token. */
  marks: Mark[];
  /** Typed words that don't belong to the sentence. */
  extra: string[];
  /** Every word present (typos allowed) and nothing extra. */
  correct: boolean;
};

function words(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[—–-]/g, " ")
    .replace(/[^a-z0-9' ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
  }
  return row[b.length];
}

/** A typo, not a different word: 1 edit for short words, 2 for long ones. */
function isTypo(expected: string, typed: string): boolean {
  return expected.length >= 3 && distance(expected, typed) <= (expected.length >= 7 ? 2 : 1);
}

export function checkDictation(tokens: string[], input: string): DictationResult {
  const expected = tokens.flatMap((tok, ti) => words(tok).map((w) => ({ w, ti })));
  const typed = words(input);

  // Longest common subsequence of exact word matches.
  const n = expected.length;
  const m = typed.length;
  const lcs = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = expected[i].w === typed[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const wordMarks: Mark[] = new Array(n).fill("missed");
  const extra: string[] = [];
  let gapE: number[] = [];
  let gapT: number[] = [];
  // Inside each unmatched stretch, pair words in order and accept typos.
  const settleGap = () => {
    gapE.forEach((ei, k) => {
      const tj = gapT[k];
      if (tj !== undefined && isTypo(expected[ei].w, typed[tj])) wordMarks[ei] = "close";
      else if (tj !== undefined) extra.push(typed[tj]);
    });
    gapT.slice(gapE.length).forEach((tj) => extra.push(typed[tj]));
    gapE = [];
    gapT = [];
  };

  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && expected[i].w === typed[j]) {
      settleGap();
      wordMarks[i] = "ok";
      i++;
      j++;
    } else if (j < m && (i === n || lcs[i][j + 1] >= lcs[i + 1][j])) {
      gapT.push(j++);
    } else {
      gapE.push(i++);
    }
  }
  settleGap();

  const rank: Record<Mark, number> = { ok: 0, close: 1, missed: 2 };
  const marks: Mark[] = tokens.map(() => "ok");
  expected.forEach(({ ti }, k) => {
    if (rank[wordMarks[k]] > rank[marks[ti]]) marks[ti] = wordMarks[k];
  });

  return { marks, extra, correct: !wordMarks.includes("missed") && extra.length === 0 };
}
