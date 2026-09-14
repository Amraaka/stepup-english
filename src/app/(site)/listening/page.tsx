import type { Metadata } from "next";
import { getSkill } from "@/lib/skills";
import { SkillPage } from "@/components/skill-page";

const skill = getSkill("listening");

export const metadata: Metadata = {
  title: `${skill.name} · StepUp English`,
  description: skill.tagline,
};

export default function Page() {
  return <SkillPage id="listening" />;
}
