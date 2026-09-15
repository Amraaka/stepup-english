// Browser-only audio decoding (Web Audio API).

import { encodeWav, resample, SPEECH_SAMPLE_RATE, toMono } from "@/lib/audio/wav";

export type MonoAudio = { samples: Float32Array; sampleRate: number };

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

/** A recording (webm/mp4 from MediaRecorder) as 16 kHz mono WAV for speech services. */
export async function toSpeechWav(blob: Blob): Promise<Blob> {
  const { samples, sampleRate } = await decodeMono(await blob.arrayBuffer());
  const wav = encodeWav(resample(samples, sampleRate, SPEECH_SAMPLE_RATE), SPEECH_SAMPLE_RATE);
  return new Blob([wav], { type: "audio/wav" });
}
