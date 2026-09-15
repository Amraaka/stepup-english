import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLesson, nextLesson, practiceItems } from "@/lib/grammar/lessons";
import { GrammarPractice } from "@/components/grammar/grammar-practice";

export async function generateMetadata({ params }: PageProps<"/grammar/[slug]/practice">): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  return lesson ? { title: `Дасгал · ${lesson.title} · StepUp English` } : {};
}

export default async function Page({ params }: PageProps<"/grammar/[slug]/practice">) {
  const lesson = getLesson((await params).slug);
  if (!lesson) notFound();
  const next = nextLesson(lesson.slug);
  return (
    <GrammarPractice
      items={practiceItems(lesson)}
      mode={{ kind: "lesson", slug: lesson.slug, next: next ? { slug: next.slug, title: next.title } : null }}
    />
  );
}
