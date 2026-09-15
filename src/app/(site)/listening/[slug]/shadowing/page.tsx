import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getClip } from "@/lib/listening/clips";
import { pronunciationAvailable } from "@/lib/pronunciation/provider";
import { ShadowingSession } from "@/components/listening/shadowing-session";

export async function generateMetadata({ params }: PageProps<"/listening/[slug]/shadowing">): Promise<Metadata> {
  const clip = getClip((await params).slug);
  return clip ? { title: `Дуудлагын дадлага · ${clip.title} · StepUp English` } : {};
}

export default async function Page({ params }: PageProps<"/listening/[slug]/shadowing">) {
  const clip = getClip((await params).slug);
  if (!clip) notFound();
  // The last sentence is the reporter's sign-off ("I'm Jill Robbins."), not worth shadowing.
  const sentences = clip.segments
    .slice(0, -1)
    .map((s) => ({ start: s.start, end: s.end, text: s.tokens.join(" ") }));
  return (
    <ShadowingSession
      clip={{ slug: clip.slug, title: clip.title, audio: clip.audio }}
      sentences={sentences}
      aiAvailable={pronunciationAvailable()}
    />
  );
}
