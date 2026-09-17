import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getText, readingMinutes } from "@/lib/reading/texts";
import { savedLemmas } from "@/lib/vocab/words";
import { glossaryFor } from "@/lib/dictionary/glossary";
import { TextReader } from "@/components/reading/text-reader";

export async function generateMetadata({ params }: PageProps<"/reading/[slug]">): Promise<Metadata> {
  const text = getText((await params).slug);
  return text ? { title: `${text.title} · Унших · StepUp English`, description: text.summary } : {};
}

export default async function Page({ params }: PageProps<"/reading/[slug]">) {
  const text = getText((await params).slug);
  if (!text) notFound();
  const user = await getCurrentUser();
  const lemmas = user ? await savedLemmas(user.id) : [];
  // Only this text's dictionary entries go to the browser (ADR 0016).
  const glossary = glossaryFor(text.paragraphs.flat());
  return (
    <TextReader
      text={text}
      glossary={glossary}
      savedLemmas={lemmas}
      minutes={readingMinutes(text)}
    />
  );
}
