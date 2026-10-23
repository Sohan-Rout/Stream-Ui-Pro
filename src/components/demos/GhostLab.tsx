"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { cn } from "@streamuilib/react";

export type GhostColor = "red" | "pink" | "cyan" | "orange";

export type GhostyProps = {
  color?: GhostColor;
  /** Height of the ghost, in px. */
  size?: number;
  /** Accessible name. */
  label?: string;
};

const BODY: Record<GhostColor, string> = {
  red: "oklch(0.63 0.22 27)",
  pink: "oklch(0.78 0.14 350)",
  cyan: "oklch(0.82 0.12 205)",
  orange: "oklch(0.78 0.15 60)",
};
const SCARED = "oklch(0.45 0.2 265)";
const FLASH = "oklch(0.97 0.01 265)";

/**
 * The silhouette, in a 100×110 box: a dome on straight sides with a wavy
 * skirt. Two skirt frames swap while it floats, so the hem ripples.
 */
const SKIRT = [
  "L90 98 Q86 108 81 100 Q76 92 72 100 Q67 108 63 100 Q59 92 54 100 Q50 108 46 100 Q41 92 37 100 Q33 108 28 100 Q24 92 19 100 Q14 108 10 98",
  "L90 100 Q85 92 81 100 Q76 108 72 100 Q67 92 63 100 Q59 108 54 100 Q50 92 46 100 Q41 108 37 100 Q33 92 28 100 Q24 108 19 100 Q14 92 10 100",
];
const shape = (frame: number) => `M10 52 C10 24 28 8 50 8 C72 8 90 24 90 52 ${SKIRT[frame]} Z`;

/** How long a scare lasts, and when it starts flashing. */
const SCARE_MS = 3200;
const FLASH_FROM = 2100;

/**
 * Ghosty: an arcade-style ghost in CSS 3D (its silhouette stacked in slices,
 * so it has real thickness as it tilts toward the pointer). It floats with a
 * rippling hem, its eyes follow the pointer, and a tap scares it: it turns
 * blue with a wobbly mouth, flashes, and recovers. One labelled button.
 */
export function Ghosty({ color = "red", size = 170, label = "Ghosty" }: GhostyProps) {
  const [frame, setFrame] = useState(0);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: -8, y: -22 });
  const [scaredAt, setScaredAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const statusId = useId();
  const still = useRef(false);

  useEffect(() => {
    still.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still.current) return;
    const t = setInterval(() => setFrame((f) => 1 - f), 220);
    return () => clearInterval(t);
  }, []);

  // Tick through a scare: flashing near the end, then back to normal.
  useEffect(() => {
    if (scaredAt === null) return;
    const t = setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n - scaredAt > SCARE_MS) setScaredAt(null);
    }, 120);
    return () => clearInterval(t);
  }, [scaredAt]);

  const scared = scaredAt !== null;
  const flashing = scared && now - scaredAt > FLASH_FROM && Math.floor((now - scaredAt) / 240) % 2 === 0;
  const fill = scared ? (flashing ? FLASH : SCARED) : BODY[color];
  const ink = "var(--ink)";

  const W = size * (100 / 110);
  const DEPTH = Math.round(size * 0.32);
  const SLICES = 20;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    setLook({ x: Math.max(-1, Math.min(1, dx * 2.4)), y: Math.max(-1, Math.min(1, dy * 2.4)) });
    if (!still.current) setTilt({ x: -8 - dy * 16, y: -22 + dx * 40 });
  };

  const d = shape(frame);

  return (
    <button
      type="button"
      aria-label={`${label}. Tap to scare it.`}
      aria-describedby={statusId}
      onClick={() => {
        const n = Date.now();
        setScaredAt(n);
        setNow(n);
      }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        setLook({ x: 0, y: 0 });
        setTilt({ x: -8, y: -22 });
      }}
      className="relative grid cursor-pointer place-items-center rounded-[3rem] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue"
      style={{ width: size * 1.6, height: size * 1.45, perspective: 1100 }}
    >
      <style href="ghosty" precedence="default">{`
        @keyframes ghosty-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -7%; } }
        @keyframes ghosty-shadow { 0%, 100% { scale: 1; opacity: .9; } 50% { scale: .82; opacity: .55; } }
        .ghosty-float { animation: ghosty-float 2.4s ease-in-out infinite; }
        .ghosty-shadow { animation: ghosty-shadow 2.4s ease-in-out infinite; }
        .ghosty-box { transition: transform 160ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .ghosty-float, .ghosty-shadow { animation: none; }
          .ghosty-box { transition: none; }
        }
      `}</style>

      <span aria-hidden className="ghosty-shadow absolute bottom-[6%] left-1/2 block h-[8%] w-[46%] -translate-x-1/2 rounded-[50%] bg-ink/20 blur-[3px]" />

      <div className="ghosty-float" style={{ width: W, height: size }}>
        <div
          className="ghosty-box relative"
          style={{ width: W, height: size, transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Its thickness: the silhouette in slices, back to front, shading toward the face. */}
          {Array.from({ length: SLICES }, (_, i) => {
            const z = -DEPTH / 2 + (i * DEPTH) / (SLICES - 1);
            const front = i === SLICES - 1;
            const back = i === 0;
            return (
              <svg
                key={i}
                aria-hidden
                viewBox="0 0 100 110"
                overflow="visible"
                className="absolute inset-0 size-full"
                style={{ transform: `translateZ(${z}px)` }}
              >
                <path
                  d={d}
                  fill={front ? fill : `color-mix(in oklab, ${fill} ${70 + (i / SLICES) * 25}%, black)`}
                  stroke={front || back ? ink : "none"}
                  strokeWidth={front || back ? 4 : 0}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {/* A soft highlight on the dome, on the face only. */}
                {front && !scared && <path d="M24 38 C26 26 34 18 44 16" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />}
              </svg>
            );
          })}

          {/* The face, a hair in front: eyes that follow the pointer, or a frightened face. */}
          <svg aria-hidden viewBox="0 0 100 110" overflow="visible" className="absolute inset-0 size-full" style={{ transform: `translateZ(${DEPTH / 2 + 1.5}px)` }}>
            {scared ? (
              <g fill="none" stroke={flashing ? SCARED : "white"} strokeLinecap="round" strokeLinejoin="round">
                <rect x="31" y="42" width="9" height="9" rx="2" fill={flashing ? SCARED : "white"} stroke="none" />
                <rect x="60" y="42" width="9" height="9" rx="2" fill={flashing ? SCARED : "white"} stroke="none" />
                <path d="M24 74 L31 68 L38 74 L45 68 L52 74 L59 68 L66 74 L73 68 L78 72" strokeWidth="4" />
              </g>
            ) : (
              [34, 66].map((cx) => (
                <g key={cx}>
                  <ellipse cx={cx + look.x * 3} cy={47 + look.y * 2} rx="12" ry="14" fill="white" stroke={ink} strokeWidth="3.5" />
                  <circle cx={cx + look.x * 7} cy={48 + look.y * 6} r="6.5" fill="oklch(0.45 0.18 260)" stroke={ink} strokeWidth="2.5" />
                  <circle cx={cx + look.x * 7 - 2} cy={46 + look.y * 6} r="1.8" fill="white" />
                </g>
              ))
            )}
          </svg>
        </div>
      </div>

      <span id={statusId} aria-live="polite" className="sr-only">
        {scared ? "Eek! It's scared." : ""}
      </span>
    </button>
  );
}

const COLORS: GhostColor[] = ["red", "pink", "cyan", "orange"];

/**
 * The lab: Ghosty, with a color picker. `preview` (the Labs index card)
 * shows just the ghost; the picker lives on the lab's own page.
 */
export function GhostLab({ preview = false }: { preview?: boolean }) {
  const [color, setColor] = useState<GhostColor>("red");
  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <Ghosty color={color} />
      {!preview && (
        <div role="group" aria-label="Color" className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={cn("size-8 rounded-t-full border-2 border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue", color === c && "ring-2 ring-ink ring-offset-2")}
              style={{ background: BODY[c] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
