"use client";

import { useState } from "react";
import { Switch, cn } from "@streamui/react";

export function HeroSwitchCard() {
  const [loud, setLoud] = useState(true);

  return (
    <div
      className={cn(
        "flex rotate-1 items-center justify-between gap-4 border-2 border-ink p-4 shadow-brutal transition-colors duration-150 sm:ml-10",
        loud ? "bg-pink text-on-bright" : "bg-paper-raised text-ink",
      )}
    >
      <div>
        <p id="loud-label" className="font-bold">
          Loud mode
        </p>
        <p className={cn("text-sm", loud ? "text-on-bright/70" : "text-ink-muted")}>
          {loud ? "Maximum contrast. No regrets." : "Quiet. Suspiciously quiet."}
        </p>
      </div>
      <Switch
        aria-labelledby="loud-label"
        checked={loud}
        onCheckedChange={setLoud}
      />
    </div>
  );
}
