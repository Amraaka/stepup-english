// Synthesizes sound effects into public/sfx/ so no third-party audio is needed.
// Usage: node scripts/make-sfx.ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SAMPLE_RATE = 44100;
const root = path.resolve(import.meta.dirname, "..");

const toWav = (samples: Float32Array) => {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), i * 2));

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
};

// A short woodblock-like tick: a high tone plus a click of noise, both decaying fast
const tick = () => {
  const length = Math.round(SAMPLE_RATE * 0.08);
  const out = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const tone = Math.sin(2 * Math.PI * 1900 * t) * Math.exp(-t * 70);
    const click = (Math.random() * 2 - 1) * Math.exp(-t * 400);
    out[i] = 0.55 * tone + 0.35 * click;
  }
  return out;
};

// A bright two-note rising chime for the answer reveal
const reveal = () => {
  const length = Math.round(SAMPLE_RATE * 0.7);
  const out = new Float32Array(length);
  const notes = [
    { freq: 1046.5, start: 0 }, // C6
    { freq: 1568, start: 0.09 }, // G6
  ];
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (const { freq, start } of notes) {
      const nt = t - start;
      if (nt < 0) continue;
      const attack = Math.min(1, nt / 0.004); // avoid a click at the onset
      const env = attack * Math.exp(-nt * 6);
      // fundamental plus a soft octave for a bell-like color
      s += env * (Math.sin(2 * Math.PI * freq * nt) + 0.3 * Math.sin(2 * Math.PI * freq * 2 * nt) * Math.exp(-nt * 10));
    }
    out[i] = 0.35 * s;
  }
  return out;
};

// An original, light background loop: C–G–Am–F at 100 BPM, 8 bars, seamless.
// Notes that ring past the end wrap to the start so the loop has no seam.
const music = () => {
  const bpm = 100;
  const beat = 60 / bpm;
  const bar = beat * 4;
  const length = Math.round(SAMPLE_RATE * bar * 8);
  const out = new Float32Array(length);
  const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

  const add = (start: number, dur: number, voice: (t: number) => number) => {
    const from = Math.round(start * SAMPLE_RATE);
    const n = Math.round(dur * SAMPLE_RATE);
    for (let i = 0; i < n; i++) out[(from + i) % length] += voice(i / SAMPLE_RATE);
  };

  const chords = [
    { root: 48, tones: [60, 64, 67] }, // C
    { root: 43, tones: [55, 59, 62] }, // G
    { root: 45, tones: [57, 60, 64] }, // Am
    { root: 41, tones: [53, 57, 60] }, // F
  ];

  for (let b = 0; b < 8; b++) {
    const { root, tones } = chords[b % 4];
    const t0 = b * bar;

    // pad: slow swell per bar, slightly detuned for warmth
    for (const note of tones) {
      const f = hz(note);
      add(t0, bar + 0.4, (t) => {
        const env = Math.min(1, t / 0.3) * Math.min(1, (bar + 0.4 - t) / 0.5);
        return 0.045 * env * (Math.sin(2 * Math.PI * f * t) + Math.sin(2 * Math.PI * f * 1.003 * t));
      });
    }

    // bass on beats 1 and 3
    for (const beatIndex of [0, 2]) {
      const f = hz(root);
      add(t0 + beatIndex * beat, beat * 1.8, (t) => 0.22 * Math.min(1, t / 0.005) * Math.exp(-t * 3) * Math.sin(2 * Math.PI * f * t));
    }

    // plucked arpeggio in eighth notes, an octave up
    const pattern = [0, 1, 2, 1, 0, 1, 2, 1];
    pattern.forEach((idx, step) => {
      const f = hz(tones[idx] + 12);
      add(t0 + (step * beat) / 2, 0.5, (t) => {
        const env = Math.min(1, t / 0.003) * Math.exp(-t * 9);
        return 0.1 * env * (Math.sin(2 * Math.PI * f * t) + 0.15 * Math.sin(2 * Math.PI * f * 3 * t));
      });
    });

    // soft shaker on the off-beats (differenced noise keeps it bright and thin)
    for (let step = 1; step < 8; step += 2) {
      let prev = 0;
      add(t0 + (step * beat) / 2, 0.06, (t) => {
        const noise = Math.random() * 2 - 1;
        const hp = noise - prev;
        prev = noise;
        return 0.03 * hp * Math.exp(-t * 70);
      });
    }
  }

  const peak = out.reduce((m, s) => Math.max(m, Math.abs(s)), 0);
  return out.map((s) => (s / peak) * 0.8);
};

for (const [file, make] of [
  ["sfx/tick.wav", tick],
  ["sfx/reveal.wav", reveal],
  ["music/loop.wav", music],
] as const) {
  const target = path.join(root, "public", file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, toWav(make()));
  console.log(`→ public/${file}`);
}
