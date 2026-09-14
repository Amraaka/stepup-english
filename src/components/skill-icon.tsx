import type { SkillId } from "@/lib/skills";
import {
  BookIcon,
  GrammarIcon,
  HeadphonesIcon,
  MicIcon,
  PencilIcon,
  VocabularyIcon,
} from "@/components/icons";

const ICONS = {
  listening: HeadphonesIcon,
  reading: BookIcon,
  writing: PencilIcon,
  speaking: MicIcon,
  vocabulary: VocabularyIcon,
  grammar: GrammarIcon,
} satisfies Record<SkillId, unknown>;

export function SkillIcon({ id, className }: { id: SkillId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} />;
}
