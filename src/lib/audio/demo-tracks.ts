"use client";

import { useSyncExternalStore } from "react";
import type { Track } from "@streamuilib/react";
import { encodeWav, renderTrack, trackSeconds, type TrackSpec } from "./synth";

/** Three short chiptune loops, rendered in the browser for the docs examples. */
const SPECS: { id: string; title: string; tone: NonNullable<Track["tone"]>; spec: TrackSpec }[] = [
  {
    id: "hard-edges",
    title: "Hard Edges",
    tone: "lime",
    spec: {
      bpm: 124,
      leadWave: "square",
      lead: [
        60, 63, 67, 72, 67, 63, 60, null, 58, 62, 65, 70, 65, 62, 58, null,
        56, 60, 63, 68, 63, 60, 56, null, 55, 59, 62, 67, 62, 59, 55, null,
      ],
      bass: [36, null, 36, null, 36, null, 43, null, 34, null, 34, null, 34, null, 41, null],
      kick: [0, 4, 8, 12],
      hat: [2, 6, 10, 14],
      loops: 6,
    },
  },
  {
    id: "offset-shadow",
    title: "Offset Shadow",
    tone: "pink",
    spec: {
      bpm: 96,
      leadWave: "triangle",
      lead: [
        65, null, 69, null, 72, null, 69, null, 67, null, 64, null, 60, null, null, null,
        65, null, 69, null, 74, null, 72, null, 69, null, 67, null, 65, null, null, null,
      ],
      bass: [41, null, null, null, 41, null, null, null, 36, null, null, null, 36, null, null, null],
      kick: [0, 8],
      hat: [4, 12],
      loops: 4,
    },
  },
  {
    id: "ink-and-paper",
    title: "Ink & Paper",
    tone: "blue",
    spec: {
      bpm: 140,
      leadWave: "saw",
      lead: [
        67, 71, 74, 71, 67, 71, 74, 79, 76, 72, 69, 72, 76, 72, 69, null,
        74, 71, 67, 71, 74, 71, 67, 62, 64, 67, 71, 67, 64, null, 62, null,
      ],
      bass: [43, null, 43, 55, 43, null, 43, 55, 40, null, 40, 52, 38, null, 38, 50],
      kick: [0, 4, 8, 12],
      hat: [2, 6, 10, 14, 15],
      loops: 6,
    },
  },
];

export const DEMO_ARTIST = "stream/ui demo";

/** Same tracks without audio yet: what the server and the first client render see. */
const placeholders: Track[] = SPECS.map(({ id, title, tone, spec }) => ({
  id,
  title,
  artist: DEMO_ARTIST,
  tone,
  src: "",
  duration: trackSeconds(spec),
}));

let rendered: Track[] | null = null;

/** Renders every track to a WAV blob URL, once per page load. */
function render(): Track[] {
  rendered ??= placeholders.map((track, i) => ({
    ...track,
    src: URL.createObjectURL(new Blob([encodeWav(renderTrack(SPECS[i].spec))], { type: "audio/wav" })),
  }));
  return rendered;
}

const subscribe = () => () => {};

/**
 * The demo playlist. On the server and during hydration it returns the
 * placeholders (no `src`), so markup matches; on the client it switches to
 * the rendered tracks.
 */
export function useDemoTracks(): Track[] {
  return useSyncExternalStore(subscribe, render, () => placeholders);
}
