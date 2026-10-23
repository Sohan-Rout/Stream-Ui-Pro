"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { cn } from "@streamuilib/react";

export type ByteColor = "lime" | "orange" | "blue" | "pink";

export type ByteProps = {
  color?: ByteColor;
  /** Width of the critter, in px. */
  size?: number;
  /** What it types when tapped, in turn. */
  lines?: string[];
  /** Accessible name. */
  label?: string;
};

const DEFAULT_LINES = ["bun dev", "git push", "ship it!", "fix bugs", "hello, world", "npm i coffee", "it works!"];

type Voxel = { x: number; y: number; z: number; part: "body" | "ear" | "arm" | "leg" | "eye" | "cheek" };

/**
 * Byte's voxels, on a grid: x across (0 to 7), y down (0 to 4), z in depth
 * (0 to 1). Ears on top, a body three rows tall with eyes in its middle row
 * and pink cheeks under them, arm nubs off the sides, and four legs underneath.
 */
const VOXELS: Voxel[] = (() => {
  const v: Voxel[] = [];
  for (const z of [0, 1]) {
    v.push({ x: 1, y: 0, z, part: "ear" }, { x: 6, y: 0, z, part: "ear" });
    for (let y = 1; y <= 3; y++) {
      for (let x = 0; x <= 7; x++) {
        const eye = z === 1 && y === 2 && (x === 2 || x === 5);
        const cheek = z === 1 && y === 3 && (x === 1 || x === 6);
        v.push({ x, y, z, part: eye ? "eye" : cheek ? "cheek" : "body" });
      }
    }
  }
  v.push({ x: -1, y: 2, z: 1, part: "arm" }, { x: 8, y: 2, z: 1, part: "arm" });
  for (const x of [1, 3, 4, 6]) v.push({ x, y: 4, z: 1, part: "leg" });
  return v;
})();

const COLORS: Record<ByteColor, string> = {
  lime: "var(--lime)",
  orange: "var(--orange)",
  blue: "var(--blue)",
  pink: "var(--pink)",
};

/** One cube of the critter: six faces, lit from the top-left. */
function Cube({ v, s, fill }: { v: Voxel; s: number; fill: string }) {
  const shade = (by: number) => `color-mix(in oklab, ${fill} ${100 - by}%, var(--ink))`;
  const faces: [string, string][] = [
    [`translateZ(${s / 2}px)`, v.part === "leg" ? shade(18) : fill],
    [`rotateY(180deg) translateZ(${s / 2}px)`, shade(35)],
    [`rotateY(90deg) translateZ(${s / 2}px)`, shade(28)],
    [`rotateY(-90deg) translateZ(${s / 2}px)`, shade(20)],
    [`rotateX(90deg) translateZ(${s / 2}px)`, `color-mix(in oklab, ${fill} 82%, white)`],
    [`rotateX(-90deg) translateZ(${s / 2}px)`, shade(45)],
  ];
  return (
    <span
      aria-hidden
      className={cn("absolute block", v.part === "leg" && (v.x === 1 || v.x === 4 ? "byte-leg-a" : "byte-leg-b"))}
      style={{ width: s, height: s, left: v.x * s, top: v.y * s, transformStyle: "preserve-3d", transform: `translateZ(${(v.z - 0.5) * s}px)` }}
    >
      {faces.map(([t, bg], i) => (
        // Soft edges between cubes, so it reads as one critter rather than a grid.
        <span
          key={i}
          className="absolute inset-0 block border"
          style={{ transform: t, background: i === 0 && v.part === "cheek" ? "var(--pink)" : bg, borderColor: "color-mix(in oklab, var(--ink) 45%, transparent)", backfaceVisibility: "hidden" }}
        >
          {/* An eye is a body cube with a blinking pixel pupil and a glint. */}
          {v.part === "eye" && i === 0 && (
            <span className="byte-blink absolute inset-[8%] block bg-ink">
              <span className="absolute top-[14%] right-[14%] block size-[28%] bg-paper-raised" />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

/**
 * Byte: an original voxel critter in CSS 3D (each pixel is a real cube),
 * with ear blocks, arm nubs, blinking pixel eyes, pink cheeks, and four legs
 * that waddle. It tilts toward the pointer, and a tap
 * makes it hop and type a line in a speech bubble. One labelled button.
 */
export function Byte({ color = "lime", size = 180, lines = DEFAULT_LINES, label = "Byte" }: ByteProps) {
  const s = Math.round(size / 9); // voxel edge
  const fill = COLORS[color];
  const [tilt, setTilt] = useState({ x: -16, y: -28 });
  const [said, setSaid] = useState<{ n: number; text: string } | null>(null);
  const statusId = useId();
  const still = useRef(false);
  const count = useRef(0);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // The bubble fades after a while.
  useEffect(() => {
    if (!said) return;
    const t = setTimeout(() => setSaid(null), 2600);
    return () => clearTimeout(t);
  }, [said]);

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (still.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -16 - dy * 16, y: -28 + dx * 46 });
  };

  return (
    <button
      type="button"
      aria-label={`${label}. Tap and it types something.`}
      aria-describedby={statusId}
      onClick={() => {
        const text = lines[count.current % lines.length];
        count.current += 1;
        setSaid({ n: count.current, text });
      }}
      onPointerMove={onMove}
      onPointerLeave={() => setTilt({ x: -16, y: -28 })}
      className="relative grid cursor-pointer place-items-center rounded-[3rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: size * 1.55, height: size * 1.15, perspective: 1100 }}
    >
      <style href="byte-critter" precedence="default">{`
        @keyframes byte-bob { 0%, 100% { translate: 0 0; } 50% { translate: 0 -3%; } }
        @keyframes byte-hop { 0%, 100% { translate: 0 0; } 35% { translate: 0 -22%; } 55% { translate: 0 0; } 70% { translate: 0 -5%; } }
        @keyframes byte-waddle { 0%, 100% { translate: 0 0; } 50% { translate: 0 -30%; } }
        @keyframes byte-blink { 0%, 90%, 100% { scale: 1 1; } 94% { scale: 1 0.12; } }
        @keyframes byte-type { from { width: 0; } }
        @keyframes byte-bubble { from { opacity: 0; scale: 0.6; } 70% { scale: 1.06; } to { opacity: 1; scale: 1; } }
        .byte-bob { animation: byte-bob 1.6s ease-in-out infinite; }
        .byte-hop { animation: byte-hop 520ms cubic-bezier(.3,0,.4,1); }
        .byte-leg-a { animation: byte-waddle 0.5s ease-in-out infinite; }
        .byte-leg-b { animation: byte-waddle 0.5s ease-in-out -0.25s infinite; }
        .byte-blink { animation: byte-blink 3.4s ease-in-out infinite; }
        .byte-type { animation: byte-type 0.7s steps(var(--chars)) both; }
        .byte-bubble { animation: byte-bubble 260ms cubic-bezier(.2,.9,.3,1.3) both; transform-origin: 30% 100%; }
        .byte-box { transition: transform 160ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .byte-bob, .byte-hop, .byte-leg-a, .byte-leg-b, .byte-blink, .byte-type, .byte-bubble { animation: none; }
          .byte-box { transition: none; }
        }
      `}</style>

      <span aria-hidden className="absolute bottom-[20%] left-1/2 block h-[8%] w-[50%] -translate-x-1/2 rounded-[50%] bg-ink/18 blur-[3px]" />

      {/* What it typed, in a bubble above its head. */}
      {said && (
        <span
          key={said.n}
          aria-hidden
          className="byte-bubble absolute top-[10%] left-[50%] z-10 border-[3px] border-ink bg-paper-raised px-2.5 py-1 font-mono text-sm font-bold whitespace-nowrap shadow-[3px_3px_0_var(--ink)]"
        >
          <span className="text-ink-muted">&gt; </span>
          <span className="byte-type inline-block overflow-hidden align-bottom" style={{ "--chars": said.text.length } as CSSProperties}>
            {said.text}
          </span>
          <span className="absolute top-full left-4 -mt-[1px] block size-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-ink" />
        </span>
      )}

      <div className="byte-bob" style={{ width: s * 8, height: s * 5 }}>
        <div key={said?.n ?? 0} className={cn(said && "byte-hop")} style={{ width: s * 8, height: s * 5 }}>
          <div
            className="byte-box relative"
            style={{ width: s * 8, height: s * 5, transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            {VOXELS.map((v, i) => (
              <Cube key={i} v={v} s={s} fill={fill} />
            ))}
          </div>
        </div>
      </div>

      <span id={statusId} aria-live="polite" className="sr-only">
        {said ? `Byte typed: ${said.text}` : ""}
      </span>
    </button>
  );
}

const SWATCHES: ByteColor[] = ["lime", "orange", "blue", "pink"];

/**
 * The lab: Byte, with a body color picker. `preview` (the Labs index card)
 * shows just Byte; the picker lives on the lab's own page.
 */
export function ByteLab({ preview = false }: { preview?: boolean }) {
  const [color, setColor] = useState<ByteColor>("lime");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <Byte color={color} />
      {!preview && (
        <div role="group" aria-label="Color" className="flex gap-2">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={cn("size-8 border-2 border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue", color === c && "ring-2 ring-ink ring-offset-2")}
              style={{ background: COLORS[c] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
