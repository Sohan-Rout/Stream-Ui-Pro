"use client";

import { useState, type TransitionEvent } from "react";
import { Dice5 } from "lucide-react";
import { Button, cn } from "@streamui/react";

type Face = 1 | 2 | 3 | 4 | 5 | 6;

const FACES: Face[] = [1, 2, 3, 4, 5, 6];

/** Filled cells in a 3×3 pip grid, read left to right, top to bottom. */
const PIPS: Record<Face, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

/** Where each face sits on the cube. Opposite faces add up to 7, like a real die. */
const PLACEMENT: Record<Face, string> = {
  1: "rotateY(0deg)",
  6: "rotateY(180deg)",
  3: "rotateY(90deg)",
  4: "rotateY(-90deg)",
  5: "rotateX(90deg)",
  2: "rotateX(-90deg)",
};

/** Cube rotation [x, y] that turns each face toward the viewer. */
const SHOW: Record<Face, [number, number]> = {
  1: [0, 0],
  2: [90, 0],
  3: [0, -90],
  4: [0, 90],
  5: [-90, 0],
  6: [0, 180],
};

/** Two full tumbles on both axes per roll, so even a repeat value visibly rolls. */
const SPIN = 720;

function rollFace(): Face {
  // crypto gives an evenly spread roll; the modulo bias over 2^32 is negligible.
  return ((crypto.getRandomValues(new Uint32Array(1))[0] % 6) + 1) as Face;
}

export function DiceLab() {
  // Fixed first render, randomness only on click, so server and client match.
  const [face, setFace] = useState<Face>(1);
  const [rolls, setRolls] = useState(0);
  const [rolling, setRolling] = useState(false);

  function roll() {
    const next = rollFace();
    setFace(next);
    setRolls((n) => n + 1);
    // With reduced motion there is no transition, so transitionend never fires.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setRolling(!still);
  }

  function onSettled(e: TransitionEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && e.propertyName === "transform") setRolling(false);
  }

  const [x, y] = SHOW[face];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div aria-hidden className="relative grid h-40 w-full place-items-center bg-dots perspective-[600px]">
        {/* Fixed three-quarter view, so the die reads as a cube even at rest. */}
        <div className="transform-3d" style={{ transform: "rotateX(-22deg) rotateY(-28deg)" }}>
          <div
            onTransitionEnd={onSettled}
            className="relative size-24 transition-transform duration-1000 ease-[cubic-bezier(0.2,0.8,0.25,1)] transform-3d motion-reduce:transition-none"
            style={{ transform: `rotateX(${rolls * SPIN + x}deg) rotateY(${rolls * SPIN + y}deg)` }}
          >
            {FACES.map((f) => (
              <div
                key={f}
                className="absolute inset-0 grid grid-cols-3 grid-rows-3 place-items-center border-2 border-ink bg-paper-raised p-2.5 backface-hidden"
                style={{ transform: `${PLACEMENT[f]} translateZ(3rem)` }}
              >
                {Array.from({ length: 9 }, (_, cell) => (
                  <span
                    key={cell}
                    className={cn(
                      "size-3.5 rounded-full",
                      PIPS[f].includes(cell) && (f === 1 ? "size-5 bg-pink ring-2 ring-ink" : "bg-ink"),
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={roll}>
          <Dice5 aria-hidden /> Roll
        </Button>
        <p aria-live="polite" className="min-w-24 font-mono text-sm tabular-nums">
          {rolls === 0 ? "ready" : rolling ? "rolling…" : <>rolled <strong className="text-base">{face}</strong></>}
        </p>
      </div>
    </div>
  );
}
