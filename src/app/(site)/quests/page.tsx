import type { Metadata } from "next";
import { QuestsView } from "@/components/views/quests-view";

export const metadata: Metadata = { title: "Даалгавар · StepUp English" };

export default function QuestsPage() {
  return <QuestsView />;
}
