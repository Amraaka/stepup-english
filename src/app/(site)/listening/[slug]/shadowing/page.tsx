import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClip, shadowingSegments } from "@/lib/listening/clips";
import { pronunciationAvailable } from "@/lib/pronunciation/provider";
import { ShadowingSession } from "@/components/listening/shadowing-session";

export async function generateMetadata({ params }: PageProps<"/listening/[slug]/shadowing">): Promise<Metadata> {
  const clip = getClip((await params).slug);
  return clip ? { title: `Дуудлагын дадлага · ${clip.title} · StepUp English` } : {};
}

export default async function Page({ params }: PageProps<"/listening/[slug]/shadowing">) {
  const clip = getClip((await params).slug);
  if (!clip) notFound();
  const sentences = shadowingSegments(clip).map((s) => ({ start: s.start, end: s.end, text: s.tokens.join(" ") }));
  return (
    <ShadowingSession
      clip={{ slug: clip.slug, title: clip.title, audio: clip.audio, durationSec: clip.durationSec }}
      sentences={sentences}
      aiAvailable={pronunciationAvailable()}
    />
  );
}
