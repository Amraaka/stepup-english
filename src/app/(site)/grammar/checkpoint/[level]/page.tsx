import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildCheckpoint, checkpointSlug, levelFromParam } from "@/lib/grammar/lessons";
import { localDay } from "@/lib/tracker";
import { getCurrentUser } from "@/lib/auth";
import { getProfile } from "@/lib/activity";
import { GrammarPractice } from "@/components/grammar/grammar-practice";

export async function generateMetadata({ params }: PageProps<"/grammar/checkpoint/[level]">): Promise<Metadata> {
  const level = levelFromParam((await params).level);
  return level ? { title: `${level} шалгалт · Дүрэм · StepUp English` } : {};
}

export default async function Page({ params }: PageProps<"/grammar/checkpoint/[level]">) {
  const level = levelFromParam((await params).level);
  if (!level) notFound();
  const user = await getCurrentUser();
  const timeZone = (user && (await getProfile(user.id))?.timezone) || "Asia/Ulaanbaatar";
  // A new mix each day in the learner's timezone; the same mix all day, so a re-render mid-session doesn't reshuffle.
  const items = buildCheckpoint(level, `${level}:${localDay(new Date(), timeZone)}`);
  return <GrammarPractice items={items} mode={{ kind: "checkpoint", level, slug: checkpointSlug(level) }} />;
}
