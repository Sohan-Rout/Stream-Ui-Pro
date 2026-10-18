"use client";

import { useState } from "react";
import { Dices } from "lucide-react";
import { Button, cn } from "@streamuilib/react";

const shapes = ["", "rounded-full", "rotate-45", "rounded-full w-36"];
const colors = ["bg-lime", "bg-pink", "bg-blue", "bg-violet", "bg-orange"];
const tilts = ["-rotate-12", "-rotate-6", "rotate-0", "rotate-6", "rotate-12"];

type Roll = { shape: number; color: number; tilt: number; n: number };

export function pickOther(length: number, current: number) {
  const next = Math.floor(Math.random() * (length - 1));
  return next >= current ? next + 1 : next;
}

export function ShapeRollerLab() {
  // Deterministic first render; randomness only after a click, so
  // server and client markup always match.
  const [roll, setRoll] = useState<Roll>({ shape: 0, color: 0, tilt: 2, n: 0 });

  return (
    <div className="flex w-full flex-col items-center gap-6 text-ink">
      <div className="grid h-40 w-full place-items-center bg-dots">
        <div key={roll.n} className={cn("animate-wiggle", tilts[roll.tilt])}>
          <div
            className={cn(
              "size-24 border-2 border-ink shadow-brutal-lg",
              colors[roll.color],
              shapes[roll.shape],
            )}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={() =>
            setRoll((r) => ({
              shape: pickOther(shapes.length, r.shape),
              color: pickOther(colors.length, r.color),
              tilt: pickOther(tilts.length, r.tilt),
              n: r.n + 1,
            }))
          }
        >
          <Dices aria-hidden /> Roll
        </Button>
        <span className="font-mono text-xs text-ink-muted tabular-nums" aria-live="polite">
          roll #{roll.n}
        </span>
      </div>
    </div>
  );
}
