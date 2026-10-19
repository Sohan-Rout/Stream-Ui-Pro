"use client";

import { useState } from "react";
import { Battery, Slider, Switch } from "@streamuilib/react";

export default function BatteryInteractive() {
  const [level, setLevel] = useState(42);
  const [charging, setCharging] = useState(false);

  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <Battery value={level} charging={charging} size="lg" label="Phone battery" />
      <label className="flex flex-col gap-2 font-bold">
        Level
        <Slider value={level} onValueChange={setLevel} tone="lime" aria-label="Battery level" />
      </label>
      <label className="flex items-center justify-between gap-3 font-bold">
        Charging
        <Switch checked={charging} onCheckedChange={setCharging} aria-label="Charging" />
      </label>
    </div>
  );
}
