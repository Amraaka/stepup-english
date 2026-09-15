import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLIPS, getClip } from "@/lib/listening/clips";
import { ClipPlayer } from "@/components/listening/clip-player";

export function generateStaticParams() {
  return CLIPS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/listening/[slug]">): Promise<Metadata> {
  const clip = getClip((await params).slug);
  return clip ? { title: `${clip.title} · Сонсгол · StepUp English`, description: clip.summary } : {};
}

export default async function Page({ params }: PageProps<"/listening/[slug]">) {
  const clip = getClip((await params).slug);
  if (!clip) notFound();
  return <ClipPlayer clip={clip} />;
}
