import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClip } from "@/lib/listening/clips";
import { buildPractice } from "@/lib/listening/exercises";
import { lookupWord, wordKey } from "@/lib/listening/glossary";
import { localDay } from "@/lib/tracker";
import { PracticeSession } from "@/components/listening/practice-session";

export async function generateMetadata({ params }: PageProps<"/listening/[slug]/practice">): Promise<Metadata> {
  const clip = getClip((await params).slug);
  return clip ? { title: `Дасгал · ${clip.title} · StepUp English` } : {};
}

export default async function Page({ params }: PageProps<"/listening/[slug]/practice">) {
  const clip = getClip((await params).slug);
  if (!clip) notFound();
  // A new set each day; the same set all day, so a mid-session re-render doesn't reshuffle.
  const seed = `${clip.slug}:${localDay(new Date(), "Asia/Ulaanbaatar")}`;
  const items = buildPractice(clip, lookupWord, wordKey, seed);
  return <PracticeSession clip={{ slug: clip.slug, title: clip.title, audio: clip.audio }} items={items} />;
}
