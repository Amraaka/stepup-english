import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClip } from "@/lib/listening/clips";
import { getCurrentUser } from "@/lib/auth";
import { savedLemmas } from "@/lib/vocab/words";
import { ClipPlayer } from "@/components/listening/clip-player";

export async function generateMetadata({ params }: PageProps<"/listening/[slug]">): Promise<Metadata> {
  const clip = getClip((await params).slug);
  return clip ? { title: `${clip.title} · Сонсгол · StepUp English`, description: clip.summary } : {};
}

export default async function Page({ params }: PageProps<"/listening/[slug]">) {
  const clip = getClip((await params).slug);
  if (!clip) notFound();
  const user = await getCurrentUser();
  const lemmas = user ? await savedLemmas(user.id) : [];
  return <ClipPlayer clip={clip} savedLemmas={lemmas} />;
}
