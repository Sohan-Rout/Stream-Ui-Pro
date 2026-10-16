"use client";

import { useState } from "react";
import { Slider, type Tone } from "@streamuilib/react";

const tones: Tone[] = ["lime", "pink", "blue", "violet", "orange"];

export default function SliderTones() {
  const [values, setValues] = useState([20, 40, 60, 80, 50]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      {tones.map((tone, i) => (
        <Slider
          key={tone}
          aria-label={`${tone} level`}
          tone={tone}
          value={values[i]}
          onValueChange={(v) => setValues((all) => all.map((old, j) => (j === i ? v : old)))}
        />
      ))}
    </div>
  );
}
