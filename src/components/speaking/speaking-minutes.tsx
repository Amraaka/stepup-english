"use client";

import { useStats } from "@/components/stats-provider";
import { MicIcon } from "@/components/icons";

/** Total speaking minutes from the tracker; works for guests (local stats) and members. */
export function SpeakingMinutes() {
  const { stats } = useStats();
  const minutes = stats.moduleMinutes.speaking ?? 0;
  return (
    <p className="mt-3 flex items-center gap-2 text-sm font-extrabold tabular-nums">
      <MicIcon className="size-4" />
      {minutes > 0 ? `Нийт ${minutes} минут ярианы дадлага хийсэн` : "Ярианы дадлага хараахан хийгээгүй байна"}
    </p>
  );
}
