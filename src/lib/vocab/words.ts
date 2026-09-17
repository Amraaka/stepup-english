import "server-only";
import { and, asc, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { getClip } from "@/lib/listening/clips";
import { getText } from "@/lib/reading/texts";
import { entriesByPos, entryForLemma, nearbyWords, wordKey } from "@/lib/dictionary/glossary";
import { seeded, shuffle } from "@/lib/random";
import { localDay } from "@/lib/tracker";
import { reviewLog, savedWords, type SavedWordSource, type StoredWordSource } from "@/db/schema";
import { DAILY_REVIEW_CAP, modeForBox, nextReview, shortMeaning, type Card } from "@/lib/vocab/review";

// Every query filters by the caller's user id (ADR 0005 access model).

/** A stored source, reading rows from before `kind` existed as clips (ADR 0016). */
function readSource(s: StoredWordSource): SavedWordSource | null {
  if (s.kind) return s;
  return s.clip ? { kind: "clip", clip: s.clip, seg: s.seg } : null;
}

function toCard(row: typeof savedWords.$inferSelect): Card {
  const source = readSource(row.source);
  const entry = entryForLemma(row.lemma);
  let from: Card["from"] = null;
  let audio: Card["audio"] = null;
  if (source?.kind === "clip") {
    const clip = getClip(source.clip);
    const seg = clip && source.seg !== undefined ? clip.segments[source.seg] : undefined;
    if (clip) from = { title: clip.title, href: `/listening/${clip.slug}` };
    if (clip && seg) audio = { src: clip.audio, start: seg.start, end: seg.end };
  } else if (source?.kind === "text") {
    const text = getText(source.text);
    if (text) from = { title: text.title, href: `/reading/${text.slug}` };
  }
  return {
    id: row.id,
    lemma: row.lemma,
    surface: row.surface,
    sentence: row.sentence,
    from,
    audio,
    box: row.box,
    // Harder card types need the meaning; a word that left the dictionary stays a flip card.
    mode: entry ? modeForBox(row.box) : "flip",
    entry,
  };
}

/**
 * Four short meanings for a listen card, or null when three different wrong meanings can't be found.
 * Wrong options come from the learner's other saved words with the same part of speech first, then the dictionary.
 */
function listenChoices(lemma: string, savedPool: string[], seed: string): string[] | null {
  const entry = entryForLemma(lemma);
  if (!entry) return null;
  const right = shortMeaning(entry.mn);
  const rand = seeded(seed);
  const saved = shuffle(savedPool, rand)
    .map(entryForLemma)
    .filter((e) => e?.pos === entry.pos);
  const wrong: string[] = [];
  for (const e of [...saved, ...shuffle(entriesByPos(entry.pos), rand)]) {
    if (!e || e.lemma === lemma) continue;
    const m = shortMeaning(e.mn);
    if (m !== right && !wrong.includes(m)) wrong.push(m);
    if (wrong.length === 3) return shuffle([right, ...wrong], rand);
  }
  return null;
}

/** Saves a word; saving the same lemma again keeps the first save. */
export async function saveWord(
  userId: string,
  word: { lemma: string; surface: string; sentence: string; source: SavedWordSource },
) {
  await db
    .insert(savedWords)
    .values({ userId, ...word })
    .onConflictDoNothing({ target: [savedWords.userId, savedWords.lemma] });
}

export async function savedLemmas(userId: string): Promise<string[]> {
  const rows = await db.select({ lemma: savedWords.lemma }).from(savedWords).where(eq(savedWords.userId, userId));
  return rows.map((r) => r.lemma);
}

export async function listSavedWords(userId: string) {
  const rows = await db
    .select()
    .from(savedWords)
    .where(eq(savedWords.userId, userId))
    .orderBy(desc(savedWords.createdAt));
  return rows.map(toCard);
}

/** Due cards for today's session, within the daily cap (counted in the learner's timezone). */
export async function reviewQueue(userId: string, timeZone: string) {
  const startOfDay = sql`(date_trunc('day', now() at time zone ${timeZone}) at time zone ${timeZone})`;
  const [[{ reviewedToday }], [{ due }]] = await Promise.all([
    db
      .select({ reviewedToday: count() })
      .from(savedWords)
      .where(and(eq(savedWords.userId, userId), gte(savedWords.lastReviewedAt, startOfDay))),
    db
      .select({ due: count() })
      .from(savedWords)
      .where(and(eq(savedWords.userId, userId), lte(savedWords.dueAt, sql`now()`))),
  ]);
  const room = Math.max(0, DAILY_REVIEW_CAP - reviewedToday);
  const rows = room
    ? await db
        .select()
        .from(savedWords)
        .where(and(eq(savedWords.userId, userId), lte(savedWords.dueAt, sql`now()`)))
        .orderBy(asc(savedWords.dueAt))
        .limit(room)
    : [];
  const cards = rows.map(toCard);
  if (cards.some((c) => c.mode === "listen")) {
    const pool = await savedLemmas(userId);
    const day = localDay(new Date(), timeZone);
    for (const c of cards) {
      if (c.mode !== "listen") continue;
      // Seeded by card and day, so a reload shows the same options.
      const choices = listenChoices(c.lemma, pool, `${c.id}:${day}`);
      if (choices) c.choices = choices;
      else c.mode = "type";
    }
  }
  for (const c of cards) {
    if (c.mode !== "type") continue;
    const words = [c.surface, c.lemma].map(wordKey).filter((w) => w && !w.includes(" "));
    const near = new Set(words.flatMap((w) => nearbyWords(w, c.lemma)));
    if (near.size) c.confusable = [...near];
  }
  return { cards, reviewedToday, due };
}

export async function reviewWord(userId: string, id: number, remembered: boolean, timeZone: string) {
  const [row] = await db
    .select({ box: savedWords.box, lemma: savedWords.lemma })
    .from(savedWords)
    .where(and(eq(savedWords.id, id), eq(savedWords.userId, userId)));
  if (!row) return false;
  const next = nextReview(row.box, remembered, new Date(), timeZone);
  await db.transaction(async (tx) => {
    // Only from the box that was read, so a second tab or a retried request can't move the word (or log it) twice.
    const updated = await tx
      .update(savedWords)
      .set({ box: next.box, dueAt: next.dueAt, lastReviewedAt: new Date() })
      .where(and(eq(savedWords.id, id), eq(savedWords.userId, userId), eq(savedWords.box, row.box)))
      .returning({ id: savedWords.id });
    if (updated.length === 0) return;
    await tx.insert(reviewLog).values({
      userId,
      item: "word",
      itemRef: row.lemma,
      correct: remembered,
      boxBefore: row.box,
      boxAfter: next.box,
    });
  });
  return true;
}

export async function deleteWord(userId: string, id: number) {
  await db.delete(savedWords).where(and(eq(savedWords.id, id), eq(savedWords.userId, userId)));
}
