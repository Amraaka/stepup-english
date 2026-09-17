"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import type { SavedWordSource } from "@/db/schema";
import { getClip } from "@/lib/listening/clips";
import { getText } from "@/lib/reading/texts";
import { entryForLemma } from "@/lib/dictionary/glossary";
import { deleteWord, reviewWord, saveWord } from "@/lib/vocab/words";

/** The source as stored, or null when it doesn't point at real content. It comes from the client. */
function cleanSource(raw: unknown): SavedWordSource | null {
  const s = (raw ?? {}) as Record<string, unknown>;
  const index = (v: unknown, length: number) =>
    typeof v === "number" && Number.isInteger(v) && v >= 0 && v < length ? v : null;
  if (s.kind === "text" && typeof s.text === "string") {
    const text = getText(s.text);
    const para = text ? index(s.para, text.paragraphs.length) : null;
    return text && para !== null ? { kind: "text", text: text.slug, para } : null;
  }
  if (s.kind === "clip" && typeof s.clip === "string") {
    const clip = getClip(s.clip);
    if (!clip) return null;
    const seg = index(s.seg, clip.segments.length);
    return seg === null ? { kind: "clip", clip: clip.slug } : { kind: "clip", clip: clip.slug, seg };
  }
  return null;
}

/** The published sentences (tokens joined by spaces, as the client sends them) a source points at. */
function sourceSentences(source: SavedWordSource): string[] {
  if (source.kind === "text") return (getText(source.text)?.paragraphs[source.para] ?? []).map((s) => s.join(" "));
  const segments = getClip(source.clip)?.segments ?? [];
  return (source.seg === undefined ? segments : [segments[source.seg]]).map((s) => s.tokens.join(" "));
}

/** Saves a tapped word. Returns false for guests, unknown words, or a source, sentence or surface that isn't in the catalog. */
export async function saveWordAction(input: {
  lemma: string;
  surface: string;
  sentence: string;
  source: SavedWordSource;
}): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  // Only glossary lemmas: the glossary is where a card's meaning comes from.
  const source = cleanSource(input?.source);
  if (typeof input?.lemma !== "string" || !entryForLemma(input.lemma) || !source) return false;
  // The sentence must be one from that source, with the saved surface in it.
  const surface = typeof input.surface === "string" ? input.surface.trim().slice(0, 80) : "";
  const sentence = typeof input.sentence === "string" ? input.sentence : "";
  if (!surface || !sourceSentences(source).includes(sentence) || !sentence.toLowerCase().includes(surface.toLowerCase())) {
    return false;
  }
  await saveWord(user.id, { lemma: input.lemma, surface, sentence, source });
  revalidatePath("/vocabulary");
  return true;
}

export async function reviewWordAction(id: number, remembered: boolean): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !Number.isInteger(id) || typeof remembered !== "boolean") return false;
  // Due dates follow the learner's local day; the timezone comes from the profile, never the client.
  const profile = await getProfile(user.id);
  return reviewWord(user.id, id, remembered, profile?.timezone ?? "Asia/Ulaanbaatar");
}

export async function deleteWordAction(id: number): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !Number.isInteger(id)) return;
  await deleteWord(user.id, id);
  revalidatePath("/vocabulary");
}
