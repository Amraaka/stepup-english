// Loudness shapes for comparing a learner's recording with the original sentence.

/** Drops leading and trailing silence so two takes line up at the first sound. */
export function trimSilence(samples: Float32Array, sampleRate: number, threshold = 0.02): Float32Array {
  const win = Math.max(1, Math.floor(sampleRate * 0.02));
  const loud = (start: number) => {
    let sum = 0;
    const end = Math.min(samples.length, start + win);
    for (let i = start; i < end; i++) sum += samples[i] * samples[i];
    return Math.sqrt(sum / Math.max(1, end - start)) >= threshold;
  };
  let first = 0;
  while (first < samples.length && !loud(first)) first += win;
  let last = samples.length;
  while (last > first && !loud(Math.max(first, last - win))) last -= win;
  return samples.subarray(first, Math.max(first, last));
}

/** RMS loudness in `bins` equal slices, scaled so the loudest slice is 1. */
export function envelope(samples: Float32Array, bins: number): number[] {
  if (samples.length === 0) return new Array(bins).fill(0);
  const size = samples.length / bins;
  const rms = Array.from({ length: bins }, (_, b) => {
    const start = Math.floor(b * size);
    const end = Math.max(start + 1, Math.floor((b + 1) * size));
    let sum = 0;
    for (let i = start; i < end && i < samples.length; i++) sum += samples[i] * samples[i];
    return Math.sqrt(sum / (end - start));
  });
  const max = Math.max(...rms);
  return max > 0 ? rms.map((v) => v / max) : rms;
}
