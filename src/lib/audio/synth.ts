/**
 * A tiny chiptune synth for the docs' demo tracks. It renders note patterns
 * to PCM samples and encodes them as WAV, so the music-player examples play
 * real audio with no files to host and nothing to license.
 *
 * Pure functions; the noise in the drums comes from a seeded generator, so
 * the same spec always renders the same samples.
 */

export type Wave = "square" | "triangle" | "saw" | "sine";

export type TrackSpec = {
  bpm: number;
  /** Lead line in 16th-note steps: MIDI note numbers, or null for a rest. */
  lead: (number | null)[];
  leadWave: Wave;
  /** Bass line in 16th-note steps. */
  bass: (number | null)[];
  /** Kick on these steps (within one bar of 16 steps). */
  kick: number[];
  /** Hi-hat (noise) on these steps. */
  hat: number[];
  /** How many times the pattern repeats. */
  loops: number;
};

export const SAMPLE_RATE = 22050;

const midiToHz = (note: number) => 440 * 2 ** ((note - 69) / 12);

function oscillator(wave: Wave, phase: number) {
  const t = phase % 1;
  switch (wave) {
    case "square":
      return t < 0.5 ? 1 : -1;
    case "triangle":
      return 4 * Math.abs(t - 0.5) - 1;
    case "saw":
      return 2 * t - 1;
    case "sine":
      return Math.sin(2 * Math.PI * t);
  }
}

/** Mulberry32: a small seeded PRNG, so drum noise is reproducible. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Attack and release ramps, so notes start and stop without clicks. */
function envelope(t: number, length: number, attack = 0.005, release = 0.04) {
  if (t < attack) return t / attack;
  if (t > length - release) return Math.max(0, (length - t) / release);
  return 1;
}

/** Renders a spec to mono samples in [-1, 1]. */
export function renderTrack(spec: TrackSpec, sampleRate = SAMPLE_RATE): Float32Array {
  const stepSeconds = 60 / spec.bpm / 4;
  const stepSamples = Math.round(stepSeconds * sampleRate);
  const steps = spec.lead.length;
  const out = new Float32Array(stepSamples * steps * spec.loops);
  const noise = seeded(steps * spec.bpm);

  for (let loop = 0; loop < spec.loops; loop++) {
    for (let step = 0; step < steps; step++) {
      const start = (loop * steps + step) * stepSamples;
      const lead = spec.lead[step];
      const bass = spec.bass[step % spec.bass.length];
      const bar = step % 16;
      const kick = spec.kick.includes(bar);
      const hat = spec.hat.includes(bar);

      for (let i = 0; i < stepSamples; i++) {
        const t = i / sampleRate;
        const env = envelope(t, stepSeconds);
        let s = 0;
        if (lead != null) s += 0.22 * env * oscillator(spec.leadWave, t * midiToHz(lead));
        if (bass != null) s += 0.26 * env * oscillator("triangle", t * midiToHz(bass));
        // Kick: a sine that drops in pitch and fades fast.
        if (kick) s += 0.5 * Math.exp(-t * 28) * Math.sin(2 * Math.PI * (55 + 120 * Math.exp(-t * 40)) * t);
        if (hat) s += 0.08 * Math.exp(-t * 90) * (noise() * 2 - 1);
        out[start + i] = Math.max(-1, Math.min(1, s));
      }
    }
  }
  return out;
}

/** Encodes mono samples as a 16-bit PCM WAV file. */
export function encodeWav(samples: Float32Array, sampleRate = SAMPLE_RATE): ArrayBuffer {
  const bytes = 44 + samples.length * 2;
  const view = new DataView(new ArrayBuffer(bytes));
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };

  text(0, "RIFF");
  view.setUint32(4, bytes - 8, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  text(36, "data");
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return view.buffer;
}

/** Length of a rendered spec, in seconds. */
export const trackSeconds = (spec: TrackSpec, sampleRate = SAMPLE_RATE) =>
  (Math.round((60 / spec.bpm / 4) * sampleRate) * spec.lead.length * spec.loops) / sampleRate;
