import type { Metadata } from "next";
import { LearnView } from "@/components/views/learn-view";

export const metadata: Metadata = { title: "Суралцах зам · StepUp English" };

export default function LearnPage() {
  return <LearnView />;
}
