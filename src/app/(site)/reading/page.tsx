import type { Metadata } from "next";
import { getSkill } from "@/lib/skills";
import { SkillPage } from "@/components/skill-page";

const skill = getSkill("reading");

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

export default function Page() {
  return <SkillPage id="reading" />;
}
