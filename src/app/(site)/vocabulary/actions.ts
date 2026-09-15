"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getClip } from "@/lib/listening/clips";
import { entryForLemma } from "@/lib/listening/glossary";
import { deleteWord, reviewWord, saveWord } from "@/lib/vocab/words";

/** Saves a tapped word. Returns false for guests or unknown words. */
export async function saveWordAction(input: {
  lemma: string;
  surface: string;
  sentence: string;
  clip: string;
  seg: number;
}): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  // Only glossary lemmas: the glossary is where a card's meaning comes from.
  if (!entryForLemma(input.lemma) || !getClip(input.clip)) return false;
  await saveWord(user.id, {
    lemma: input.lemma,
    surface: input.surface.slice(0, 80),
    sentence: input.sentence.slice(0, 400),
    source: { clip: input.clip, seg: Number.isInteger(input.seg) ? input.seg : undefined },
  });
  revalidatePath("/vocabulary");
  return true;
}

export async function reviewWordAction(id: number, remembered: boolean): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user || !Number.isInteger(id)) return false;
  return reviewWord(user.id, id, remembered);
}

export async function deleteWordAction(id: number): Promise<void> {
  const user = await getCurrentUser();
  if (!user || !Number.isInteger(id)) return;
  await deleteWord(user.id, id);
  revalidatePath("/vocabulary");
}
