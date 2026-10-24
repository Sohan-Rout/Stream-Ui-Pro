/**
 * Tiny synthesized arcade sounds for the Labs games: no audio files, just
 * short oscillator blips through one shared AudioContext, created on first
 * use (which must follow a user gesture, such as pressing Start).
 */

type Note = { f: number; at?: number; dur?: number; type?: OscillatorType; gain?: number; to?: number };

let ctx: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Play a few notes; `at` offsets are seconds from now, `to` glides the pitch. */
export function blip(notes: Note[], volume = 1) {
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime;
  for (const { f, at = 0, dur = 0.08, type = "square", gain = 0.05, to } of notes) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f, now + at);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, now + at + dur);
    amp.gain.setValueAtTime(0, now + at);
    amp.gain.linearRampToValueAtTime(gain * volume, now + at + 0.005);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);
    osc.connect(amp).connect(ac.destination);
    osc.start(now + at);
    osc.stop(now + at + dur + 0.02);
  }
}

/**
 * A rubber-duck quack: two detuned saws gliding down, through two band-pass
 * "formants" so it sounds nasal rather than like a beep. `pitch` scales it
 * (1 is a mid duck; above 1 is a smaller one).
 */
export function quack(pitch = 1, volume = 1) {
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime;
  const dur = 0.2;
  const out = ac.createGain();
  out.gain.setValueAtTime(0, now);
  out.gain.linearRampToValueAtTime(0.09 * volume, now + 0.012);
  out.gain.setValueAtTime(0.09 * volume, now + 0.06);
  out.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  out.connect(ac.destination);
  const formants = [
    { f: 1100, q: 4, g: 1 },
    { f: 2600, q: 7, g: 0.5 },
  ].map(({ f, q, g }) => {
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = f * Math.sqrt(pitch);
    bp.Q.value = q;
    const amp = ac.createGain();
    amp.gain.value = g;
    bp.connect(amp).connect(out);
    return bp;
  });
  for (const detune of [0, 14]) {
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.detune.value = detune;
    osc.frequency.setValueAtTime(560 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(400 * pitch, now + dur);
    for (const bp of formants) osc.connect(bp);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }
}

/** Notes in C major, so every effect sits in one key. */
export const NOTE = { C4: 262, E4: 330, G4: 392, A4: 440, C5: 523, D5: 587, E5: 659, G5: 784, A5: 880, C6: 1047, E6: 1319, G6: 1568 } as const;
