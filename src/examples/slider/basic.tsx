"use client";

import { useState } from "react";
import { Slider } from "@streamuilib/react";

export default function SliderBasic() {
  const [value, setValue] = useState(60);

  return (
    <div className="w-full max-w-xs">
      <div className="mb-2 flex justify-between">
        <label htmlFor="slider-brightness" className="font-bold">
          Brightness
        </label>
        <span className="font-mono text-sm tabular-nums">{value}%</span>
      </div>
      <Slider id="slider-brightness" value={value} onValueChange={setValue} aria-valuetext={`${value}%`} />
    </div>
  );
}
