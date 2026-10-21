"use client";

import { useState } from "react";
import { ComicSlider } from "@streamuilib/react";

export default function ComicSliderBasic() {
  const [power, setPower] = useState(60);
  return (
    <label className="flex w-full max-w-sm flex-col gap-1">
      <span className="font-bold">Power level</span>
      <ComicSlider value={power} onValueChange={setPower} formatValue={(v) => `${v}%`} />
    </label>
  );
}
