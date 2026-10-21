"use client";

import { useState } from "react";
import { ComicSwitch } from "@streamuilib/react";

export default function ComicSwitchControlled() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch checked={on} onCheckedChange={setOn} labels={["Yes!", "Nah"]} /> Hero mode
      </label>
      <p className="font-mono text-sm">Hero mode is {on ? "ON. Up, up, and away!" : "off."}</p>
    </div>
  );
}
