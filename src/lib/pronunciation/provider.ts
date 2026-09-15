import "server-only";
import { AZURE_CONTENT_TYPE, AZURE_PATH, assessmentHeader, parseAzureResponse } from "@/lib/pronunciation/azure";
import { mockAssessment } from "@/lib/pronunciation/mock";
import type { PronunciationResult } from "@/lib/pronunciation/types";

// Which pronunciation provider runs, from the environment (ADR 0011):
//   AZURE_SPEECH_KEY + AZURE_SPEECH_ENDPOINT → Azure AI Speech
//   PRONUNCIATION_PROVIDER=mock (development only) → sample data
//   neither → the feature shows "Тун удахгүй"

type Config = { kind: "azure"; key: string; endpoint: string } | { kind: "mock" };

function config(): Config | null {
  const key = process.env.AZURE_SPEECH_KEY;
  const endpoint = process.env.AZURE_SPEECH_ENDPOINT;
  if (key && endpoint) return { kind: "azure", key, endpoint: endpoint.replace(/\/+$/, "") };
  if (process.env.PRONUNCIATION_PROVIDER === "mock" && process.env.NODE_ENV !== "production") return { kind: "mock" };
  return null;
}

export function pronunciationAvailable(): boolean {
  return config() !== null;
}

export type PronunciationFailure = "no-speech" | "auth" | "service";

export class PronunciationError extends Error {
  readonly reason: PronunciationFailure;
  constructor(reason: PronunciationFailure) {
    super(`pronunciation assessment failed: ${reason}`);
    this.reason = reason;
  }
}

/** Scores a 16 kHz mono WAV against the sentence the learner was reading. Null when no provider is set. */
export async function assessPronunciation(
  wav: Blob,
  referenceText: string,
): Promise<{ result: PronunciationResult; sample: boolean } | null> {
  const c = config();
  if (!c) return null;
  if (c.kind === "mock") return { result: mockAssessment(referenceText), sample: true };

  const res = await fetch(`${c.endpoint}${AZURE_PATH}`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": c.key,
      "Content-Type": AZURE_CONTENT_TYPE,
      Accept: "application/json",
      "Pronunciation-Assessment": assessmentHeader(referenceText),
    },
    body: wav,
    signal: AbortSignal.timeout(20_000),
  }).catch(() => {
    throw new PronunciationError("service");
  });
  if (res.status === 401 || res.status === 403) throw new PronunciationError("auth");
  if (!res.ok) throw new PronunciationError("service");
  const result = parseAzureResponse(await res.json().catch(() => null));
  if (!result) throw new PronunciationError("no-speech");
  return { result, sample: false };
}
