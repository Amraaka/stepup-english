// Browser-only audio decoding (Web Audio API).

import { envelope, trimSilence } from "@/lib/audio/envelope";
import { encodeWav, resample, SPEECH_SAMPLE_RATE, toMono } from "@/lib/audio/wav";

export type MonoAudio = { samples: Float32Array; sampleRate: number };
export type Shape = { values: number[]; sec: number };

export async function decodeMono(data: ArrayBuffer): Promise<MonoAudio> {
  const ctx = new AudioContext();
  try {
    const buf = await ctx.decodeAudioData(data);
    const channels = Array.from({ length: buf.numberOfChannels }, (_, i) => buf.getChannelData(i));
    return { samples: toMono(channels), sampleRate: buf.sampleRate };
  } finally {
    void ctx.close();
  }
}

/** Loudness shape of one decoded recording, silence trimmed. */
export function shapeOf({ samples, sampleRate }: MonoAudio, bins: number): Shape {
  const cut = trimSilence(samples, sampleRate);
  return { values: envelope(cut, bins), sec: cut.length / sampleRate };
}

/** Low enough to keep a 4-minute clip small in memory, plenty for a loudness shape. */
const SHAPE_SAMPLE_RATE = 8000;

/**
 * Loudness shapes for time ranges of a whole clip. Decodes at a low sample rate and keeps only
 * the shapes, so the decoded clip (tens of MB at 48 kHz) isn't held for the whole session.
 */
export async function decodeShapes(
  data: ArrayBuffer,
  ranges: { start: number; end: number }[],
  bins: number,
): Promise<Shape[]> {
  let buf: AudioBuffer;
  try {
    buf = await new OfflineAudioContext(1, 1, SHAPE_SAMPLE_RATE).decodeAudioData(data);
  } catch {
    // Browsers that reject the low rate: decode at the device rate instead.
    const ctx = new AudioContext();
    try {
      buf = await ctx.decodeAudioData(data);
    } finally {
      void ctx.close();
    }
  }
  const rate = buf.sampleRate;
  return ranges.map(({ start, end }) => {
    const from = Math.floor(start * rate);
    const to = Math.min(buf.length, Math.floor(end * rate));
    const channels = Array.from({ length: buf.numberOfChannels }, (_, i) =>
      buf.getChannelData(i).subarray(from, Math.max(from, to)),
    );
    return shapeOf({ samples: toMono(channels), sampleRate: rate }, bins);
  });
}

/** A recording (webm/mp4 from MediaRecorder) as 16 kHz mono WAV for speech services. */
export async function toSpeechWav(blob: Blob): Promise<Blob> {
  const { samples, sampleRate } = await decodeMono(await blob.arrayBuffer());
  const wav = encodeWav(resample(samples, sampleRate, SPEECH_SAMPLE_RATE), SPEECH_SAMPLE_RATE);
  return new Blob([wav], { type: "audio/wav" });
}
