import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getText, shuffledQuestions } from "@/lib/reading/texts";
import { localDay } from "@/lib/tracker";
import { TextQuestions } from "@/components/reading/text-questions";

export async function generateMetadata({ params }: PageProps<"/reading/[slug]/questions">): Promise<Metadata> {
  const text = getText((await params).slug);
  return text ? { title: `Асуулт · ${text.title} · StepUp English` } : {};
}

export default async function Page({ params }: PageProps<"/reading/[slug]/questions">) {
  const text = getText((await params).slug);
  if (!text) notFound();
  // Options in a new order each day; the same order all day, so a re-render doesn't reshuffle.
  const seed = `${text.slug}:${localDay(new Date(), "Asia/Ulaanbaatar")}`;
  return <TextQuestions slug={text.slug} questions={shuffledQuestions(text, seed)} />;
}
