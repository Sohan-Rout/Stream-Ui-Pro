"use client";

import { useId, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { cn } from "./cn";
import type { BadgeTone } from "./Badge";
import { SHAPES, type ComicBadgeShape } from "./ComicBadge";

export type ComicButtonShape = "panel" | ComicBadgeShape;
export type ComicButtonSize = "sm" | "md" | "lg";

export type ComicButtonProps = ComponentProps<"button"> & {
  shape?: ComicButtonShape;
  tone?: BadgeTone;
  size?: ComicButtonSize;
  /** Tilt in degrees. */
  tilt?: number;
  /**
   * The sound effect that pops out on click. A string, a list to cycle
   * through, or false for none.
   */
  pop?: string | string[] | false;
  /** Halftone dots over the fill, like printed comics. */
  halftone?: boolean;
};

/** A comic panel: a slightly skewed box. Fits any label. */
const PANEL = { d: "M3 5 L97 1 L99 95 L1 99 Z", viewBox: "0 0 100 100", round: false };

const fills: Record<BadgeTone, string> = {
  lime: "fill-lime text-on-bright",
  pink: "fill-pink text-on-bright",
  blue: "fill-blue text-on-bright",
  violet: "fill-violet text-on-bright",
  orange: "fill-orange text-on-bright",
  paper: "fill-paper-raised text-ink",
};

const roundSize: Record<ComicButtonSize, string> = { sm: "size-18 text-xs", md: "size-24 text-sm", lg: "size-30 text-base" };
const wideSize: Record<ComicButtonSize, string> = { sm: "h-10 px-4 text-xs", md: "h-13 px-6 text-sm", lg: "h-16 px-8 text-base" };
/** Speech bubbles need room for the tail underneath. */
const bubbleSize: Record<ComicButtonSize, string> = { sm: "h-12 px-4 pb-3 text-xs", md: "h-16 px-6 pb-4 text-sm", lg: "h-20 px-8 pb-5 text-base" };

const DEFAULT_POPS = ["POW!", "BAM!", "ZAP!", "WHAM!", "BOOM!"];

/**
 * A comic-book button: a panel, burst, seal, splat, blob, speech bubble, or
 * ribbon with an ink outline and a hard shadow that follow the shape. It
 * lifts on hover, slams into its shadow on press, and pops a sound effect
 * ("POW!") on click. Motion stops for reduced motion.
 */
export function ComicButton({
  shape = "panel",
  tone = "lime",
  size = "md",
  tilt = -2,
  pop = DEFAULT_POPS,
  halftone = true,
  type = "button",
  className,
  style,
  children,
  onClick,
  ...props
}: ComicButtonProps) {
  const s = shape === "panel" ? PANEL : SHAPES[shape];
  const dots = useId().replace(/:/g, "");
  const [pops, setPops] = useState<{ id: number; word: string }[]>([]);
  const n = useRef(0);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    if (pop === false || e.defaultPrevented) return;
    const words = Array.isArray(pop) ? pop : [pop];
    const id = ++n.current;
    setPops((p) => [...p.slice(-2), { id, word: words[(id - 1) % words.length] }]);
    setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 650);
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      className={cn(
        "sui-comic-btn group relative inline-grid shrink-0 cursor-pointer place-items-center font-mono font-bold tracking-tight uppercase select-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue",
        s.round ? roundSize[size] : shape === "bubble" ? bubbleSize[size] : wideSize[size],
        fills[tone],
        className,
      )}
      style={{ rotate: `${tilt}deg`, ...style }}
      {...props}
    >
      <svg aria-hidden viewBox={s.viewBox} preserveAspectRatio="none" overflow="visible" className="sui-comic-btn-shape absolute inset-0 size-full">
        {halftone && (
          <defs>
            <pattern id={dots} width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="var(--ink)" opacity="0.14" />
            </pattern>
          </defs>
        )}
        <path d={s.d} className="stroke-ink" strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {halftone && <path d={s.d} fill={`url(#${dots})`} />}
      </svg>
      <span className="relative inline-flex items-center gap-2 whitespace-nowrap [&_svg]:size-4.5 [&_svg]:shrink-0">{children}</span>
      {pops.map((p) => (
        <span
          key={p.id}
          aria-hidden
          className="sui-comic-pop pointer-events-none absolute -top-3 -right-4 z-10 border-[3px] border-ink bg-paper-raised px-1.5 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-ink shadow-[2px_2px_0_var(--ink)]"
        >
          {p.word}
        </span>
      ))}
    </button>
  );
}
