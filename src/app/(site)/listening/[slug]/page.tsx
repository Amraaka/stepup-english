import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClip } from "@/lib/listening/clips";
import { getCurrentUser } from "@/lib/auth";
import { savedLemmas } from "@/lib/vocab/words";
import { currentLearner } from "@/lib/vocab/learner";
import { shortMeaning } from "@/lib/vocab/review";
import { glossaryFor } from "@/lib/dictionary/glossary";
import { coverage } from "@/lib/dictionary/coverage";
import { ClipPlayer } from "@/components/listening/clip-player";

/** New words shown before listening (ADR 0022). */
const PREVIEW_WORDS = 3;

export async function generateMetadata({ params }: PageProps<"/listening/[slug]">): Promise<Metadata> {
  const clip = getClip((await params).slug);
  return clip ? { title: `${clip.title} · Сонсгол · StepUp English`, description: clip.summary } : {};
}

export default async function Page({ params }: PageProps<"/listening/[slug]">) {
  const clip = getClip((await params).slug);
  if (!clip) notFound();
  const user = await getCurrentUser();
  const [lemmas, learner] = await Promise.all([user ? savedLemmas(user.id) : [], currentLearner(user?.id ?? null)]);
  const sentences = clip.segments.map((s) => s.tokens);
  const cov = coverage(sentences, learner);
  const estimate = {
    percent: cov.percent,
    fit: cov.fit,
    preview: cov.newWords.slice(0, PREVIEW_WORDS).map((w) => ({
      lemma: w.lemma,
      meaning: shortMeaning(w.entry.mn),
      sentence: w.sentence,
      token: w.token,
    })),
  };
  // Only this clip's dictionary entries go to the browser (ADR 0016).
  const glossary = glossaryFor(sentences);
  return <ClipPlayer clip={clip} glossary={glossary} savedLemmas={lemmas} estimate={estimate} />;
}
