// Azure AI Speech pronunciation assessment (REST API for short audio), ADR 0011.
// Docs: learn.microsoft.com/azure/ai-services/speech-service/rest-speech-to-text-short
//       learn.microsoft.com/azure/ai-services/speech-service/how-to-pronunciation-assessment
// Pure: builds the request header and parses the response. Not yet run against a live key.

import type { PronunciationResult, WordError } from "./types";

export const AZURE_PATH = "/stt/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed";
export const AZURE_CONTENT_TYPE = "audio/wav; codecs=audio/pcm; samplerate=16000";
/** "For pronunciation assessment, the audio duration should be no more than 30 seconds." */
export const AZURE_MAX_AUDIO_SEC = 30;

/** Base64 of the UTF-8 JSON parameters, sent as the `Pronunciation-Assessment` header. */
export function assessmentHeader(referenceText: string): string {
  const params = {
    ReferenceText: referenceText,
    GradingSystem: "HundredMark",
    Granularity: "Phoneme",
    Dimension: "Comprehensive",
    EnableMiscue: "True",
    // Listed in the SDK docs, not in the REST table; SAPI symbols are mapped below if it's ignored.
    PhonemeAlphabet: "IPA",
  };
  return Buffer.from(JSON.stringify(params), "utf8").toString("base64");
}

type Scores = {
  AccuracyScore?: number;
  FluencyScore?: number;
  CompletenessScore?: number;
  PronScore?: number;
  ErrorType?: string;
};
type Node = Scores & { PronunciationAssessment?: Scores };
type AzurePhoneme = Node & { Phoneme?: string };
type AzureWord = Node & { Word?: string; Phonemes?: AzurePhoneme[] };
type AzureBody = { RecognitionStatus?: string | number; NBest?: (Node & { Words?: AzureWord[] })[] };

// The REST sample puts scores on the object; the SDK JSON nests them in PronunciationAssessment.
const scores = (n: Node): Scores => n.PronunciationAssessment ?? n;
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

const ERRORS: Record<string, WordError> = {
  Mispronunciation: "mispronunciation",
  Omission: "omission",
  Insertion: "insertion",
};

/** SAPI (American English) → IPA for the symbols our tips use. */
const SAPI_TO_IPA: Record<string, string> = {
  th: "θ",
  dh: "ð",
  r: "ɹ",
  iy: "iː",
  ih: "ɪ",
  ae: "æ",
  aa: "ɑ",
  ah: "ʌ",
  ax: "ə",
  eh: "ɛ",
  er: "ɝ",
  uw: "u",
  uh: "ʊ",
  ow: "oʊ",
  ey: "eɪ",
  ay: "aɪ",
  aw: "aʊ",
  oy: "ɔɪ",
  ao: "ɔ",
  sh: "ʃ",
  zh: "ʒ",
  ch: "tʃ",
  jh: "dʒ",
  ng: "ŋ",
  y: "j",
};

export function parseAzureResponse(body: unknown): PronunciationResult | null {
  const b = body as AzureBody;
  if (b?.RecognitionStatus !== "Success" && b?.RecognitionStatus !== 0) return null;
  const best = b.NBest?.[0];
  if (!best) return null;
  const s = scores(best);
  return {
    overall: num(s.PronScore),
    accuracy: num(s.AccuracyScore),
    fluency: num(s.FluencyScore),
    completeness: num(s.CompletenessScore),
    words: (best.Words ?? []).map((w) => {
      const ws = scores(w);
      return {
        word: String(w.Word ?? ""),
        accuracy: num(ws.AccuracyScore),
        error: ERRORS[ws.ErrorType ?? ""] ?? "none",
        phonemes: (w.Phonemes ?? []).map((p) => {
          const raw = String(p.Phoneme ?? "");
          return { phoneme: SAPI_TO_IPA[raw] ?? raw, accuracy: num(scores(p).AccuracyScore) };
        }),
      };
    }),
  };
}
