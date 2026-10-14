"use client";

import { useRef, useState, type PointerEvent } from "react";
import { Magnet } from "lucide-react";
import { buttonStyles } from "@streamui/react";

const PULL = 0.35;
const MAX = 40;

export function MagneticLab() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function onMove(e: PointerEvent) {
    const area = areaRef.current;
    if (!area || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
