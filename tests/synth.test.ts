import { describe, expect, test } from "bun:test";
import { SAMPLE_RATE, encodeWav, renderTrack, trackSeconds, type TrackSpec } from "@/lib/audio/synth";

const spec: TrackSpec = {
  bpm: 120,
  leadWave: "square",
  lead: [60, null, 64, 67, 72, null, 67, 64],
  bass: [36, null, 43, null],
  kick: [0, 4],
  hat: [2, 6],
  loops: 2,
};

describe("renderTrack", () => {
  const samples = renderTrack(spec);

  test("is exactly as long as trackSeconds says", () => {
    expect(samples.length / SAMPLE_RATE).toBeCloseTo(trackSeconds(spec), 6);
  });

  test("never clips past [-1, 1]", () => {
    let peak = 0;
    for (const s of samples) peak = Math.max(peak, Math.abs(s));
    expect(peak).toBeLessThanOrEqual(1);
    expect(peak).toBeGreaterThan(0.1); // and it's not silent
  });

  test("is deterministic, drum noise included", () => {
    expect(renderTrack(spec)).toEqual(samples);
  });

  test("rests are silent apart from drums", () => {
    const quiet = renderTrack({ ...spec, lead: [null, null], bass: [null], kick: [], hat: [], loops: 1 });
    expect(quiet.every((s) => s === 0)).toBe(true);
  });
});

describe("encodeWav", () => {
  const samples = new Float32Array([0, 0.5, -0.5, 1, -1]);
  const view = new DataView(encodeWav(samples));
  const text = (offset: number, length: number) =>
    String.fromCharCode(...Array.from({ length }, (_, i) => view.getUint8(offset + i)));

  test("writes a valid mono 16-bit PCM header", () => {
    expect(text(0, 4)).toBe("RIFF");
    expect(text(8, 4)).toBe("WAVE");
    expect(text(12, 4)).toBe("fmt ");
    expect(view.getUint16(20, true)).toBe(1); // PCM
    expect(view.getUint16(22, true)).toBe(1); // mono
    expect(view.getUint32(24, true)).toBe(SAMPLE_RATE);
    expect(view.getUint16(34, true)).toBe(16);
    expect(text(36, 4)).toBe("data");
  });

  test("sizes match the payload", () => {
    expect(view.byteLength).toBe(44 + samples.length * 2);
    expect(view.getUint32(4, true)).toBe(view.byteLength - 8);
    expect(view.getUint32(40, true)).toBe(samples.length * 2);
  });

  test("scales samples to 16-bit integers", () => {
    expect(view.getInt16(44, true)).toBe(0);
    expect(view.getInt16(44 + 6, true)).toBe(0x7fff);
    expect(view.getInt16(44 + 8, true)).toBe(-0x8000);
  });
});
