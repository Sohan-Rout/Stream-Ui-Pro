"use client";

import { useState } from "react";
import { ComicSlider } from "@streamuilib/react";

export default function ComicSliderTones() {
  const [volume, setVolume] = useState(11);
  const [speed, setSpeed] = useState(3);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="font-bold">Volume</span>
        <ComicSlider value={volume} max={11} onValueChange={setVolume} tone="pink" formatValue={(v) => (v === 11 ? "11!!" : v)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-bold">Speed</span>
        <ComicSlider value={speed} min={1} max={5} onValueChange={setSpeed} tone="blue" formatValue={(v) => `${v}x`} aria-valuetext={`${speed} times`} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-bold">Quiet, no bubble</span>
        <ComicSlider value={40} tone="orange" showValue={false} disabled />
      </label>
    </div>
  );
}
