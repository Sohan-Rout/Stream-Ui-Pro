"use client";

import { useState } from "react";
import { ComicBattery, ComicSlider, ComicSwitch } from "@streamuilib/react";

export default function ComicBatteryInteractive() {
  const [level, setLevel] = useState(35);
  const [charging, setCharging] = useState(false);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-6 pt-4">
      <ComicBattery value={level} charging={charging} size="lg" />
      <label className="flex w-full flex-col gap-1">
        <span className="font-bold">Charge</span>
        <ComicSlider value={level} onValueChange={setLevel} tone="orange" formatValue={(v) => `${v}%`} />
      </label>
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch checked={charging} onCheckedChange={setCharging} /> Plugged in
      </label>
    </div>
  );
}
