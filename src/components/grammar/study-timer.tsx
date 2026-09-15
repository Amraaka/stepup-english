"use client";

import { useMeasuredTime } from "@/components/use-measured-time";

/** Logs time spent reading a grammar lesson (visible tab only). Renders nothing. */
export function StudyTimer({ slug }: { slug: string }) {
  useMeasuredTime({ module: "grammar", ref: slug }, { counting: () => true });
  return null;
}
