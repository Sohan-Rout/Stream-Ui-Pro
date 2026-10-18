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

/** Notes in C major, so every effect sits in one key. */
export const NOTE = { C4: 262, E4: 330, G4: 392, A4: 440, C5: 523, D5: 587, E5: 659, G5: 784, A5: 880, C6: 1047, E6: 1319, G6: 1568 } as const;
