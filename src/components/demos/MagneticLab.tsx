"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Magnet } from "lucide-react";
import { buttonStyles } from "@streamuilib/react";

const PULL = 0.35;
const MAX = 40;

export function MagneticLab() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMove(e: PointerEvent) {
    const area = areaRef.current;
    // Follows the cursor even with reduced motion on: the visitor drives every
    // pixel of it, and following is the whole experiment.
    if (!area || e.pointerType !== "mouse") return;
    const r = area.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
    setOffset({
      x: clamp((e.clientX - (r.left + r.width / 2)) * PULL),
      y: clamp((e.clientY - (r.top + r.height / 2)) * PULL),
    });
  }

  return (
    <div
      ref={areaRef}
      onPointerMove={onMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      className="grid h-56 w-full place-items-center border-2 border-dashed border-ink-faint"
    >
      <div
        className="transition-transform duration-150 ease-out"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <button type="button" className={buttonStyles({ variant: "pink", size: "lg" })}>
          <Magnet aria-hidden /> Catch me
        </button>
      </div>
    </div>
  );
}
