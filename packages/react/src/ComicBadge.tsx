import type { ComponentProps } from "react";
import { cn } from "./cn";
import type { BadgeTone } from "./Badge";

export type ComicBadgeShape = "burst" | "seal" | "splat" | "blob" | "bubble" | "ribbon";
export type ComicBadgeSize = "sm" | "md" | "lg";
export type ComicBadgeAnimation = "none" | "spin" | "wiggle" | "pulse";

export type ComicBadgeProps = ComponentProps<"span"> & {
  shape?: ComicBadgeShape;
  tone?: BadgeTone;
  size?: ComicBadgeSize;
  /** Tilt in degrees, for that stuck-on-by-hand look. */
  tilt?: number;
  /** spin turns only the shape (the text stays level); wiggle and pulse move the whole badge. */
  animate?: ComicBadgeAnimation;
};

const fills: Record<BadgeTone, string> = {
  lime: "fill-lime text-on-bright",
  pink: "fill-pink text-on-bright",
  blue: "fill-blue text-on-bright",
  violet: "fill-violet text-on-bright",
  orange: "fill-orange text-on-bright",
  paper: "fill-paper-raised text-ink",
};

/** A closed polygon through points at angle i·(2π/n), radius r(i), centered in a 100×100 box. */
function ring(n: number, r: (i: number) => number, turn = -Math.PI / 2) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = turn + (i * 2 * Math.PI) / n;
    return `${(50 + r(i) * Math.cos(a)).toFixed(2)},${(50 + r(i) * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
}

const SPLAT = [50, 41, 48, 39, 50, 43, 46, 38, 50, 42, 47, 40];

/** Each shape: its path, its viewBox, and whether it's round (fixed square) or wide (sized by its text). */
/** The outlines, shared with ComicButton (not exported from the package). */
export const SHAPES: Record<ComicBadgeShape, { d: string; viewBox: string; round: boolean }> = {
  // The pointed circle: 14 spikes.
  burst: { d: ring(28, (i) => (i % 2 ? 37 : 50)), viewBox: "0 0 100 100", round: true },
  // A scalloped seal: a wavy edge all the way round.
  seal: { d: ring(144, (i) => 45 + 4 * Math.cos((i * 18 * 2 * Math.PI) / 144)), viewBox: "0 0 100 100", round: true },
  // An uneven splat: spikes of different lengths.
  splat: { d: ring(24, (i) => (i % 2 ? 34 + (i % 4) : SPLAT[(i / 2) % SPLAT.length])), viewBox: "0 0 100 100", round: true },
  // An organic blob.
  blob: { d: "M50 3C77 2 97 20 96 47C95 74 76 97 49 96C22 95 3 77 4 50C5 23 23 4 50 3Z", viewBox: "0 0 100 100", round: true },
  // A speech bubble with a tail off the bottom left.
  bubble: { d: "M12 2H88Q98 2 98 12V44Q98 54 88 54H36L18 68L22 54H12Q2 54 2 44V12Q2 2 12 2Z", viewBox: "0 0 100 70", round: false },
  // A banner with notched ends.
  ribbon: { d: "M0 2H100L90 21L100 40H0L10 21Z", viewBox: "0 0 100 42", round: false },
};

const roundSize: Record<ComicBadgeSize, string> = {
  sm: "size-16 p-3 text-[10px]",
  md: "size-22 p-4 text-xs",
  lg: "size-30 p-6 text-sm",
};
const wideSize: Record<ComicBadgeShape, Record<ComicBadgeSize, string>> = {
  bubble: { sm: "px-3 pt-1.5 pb-4 text-[10px]", md: "px-4 pt-2 pb-5 text-xs", lg: "px-5 pt-3 pb-7 text-sm" },
  ribbon: { sm: "px-5 py-1.5 text-[10px]", md: "px-7 py-2 text-xs", lg: "px-9 py-3 text-sm" },
  burst: roundSize, seal: roundSize, splat: roundSize, blob: roundSize,
};

/**
 * A comic-book sticker: short text on a burst, seal, splat, blob, speech
 * bubble, or ribbon, with an ink outline and a hard shadow that follow the
 * shape. Keep the text short ("NEW!", "50% OFF", "HOT"). Animations stop
 * for reduced motion.
 */
export function ComicBadge({
  shape = "burst",
  tone = "lime",
  size = "md",
  tilt = -6,
  animate = "none",
  className,
  style,
  children,
  ...props
}: ComicBadgeProps) {
  const s = SHAPES[shape];
  return (
    <span
      data-sui-comic={animate === "none" ? undefined : animate}
      className={cn(
        "sui-comic relative inline-grid shrink-0 place-items-center",
        s.round ? roundSize[size] : wideSize[shape][size],
        fills[tone],
        className,
      )}
      style={{ rotate: `${tilt}deg`, ...style }}
      {...props}
    >
      <svg
        aria-hidden
        viewBox={s.viewBox}
        preserveAspectRatio="none"
        overflow="visible"
        className="sui-comic-shape absolute inset-0 size-full drop-shadow-[3px_3px_0_var(--ink)]"
      >
        <path d={s.d} className="stroke-ink" strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative text-center font-mono leading-[1.05] font-bold tracking-tight whitespace-nowrap uppercase">{children}</span>
    </span>
  );
}
