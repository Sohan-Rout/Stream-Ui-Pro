"use client";

import { cn } from "./cn";
import { Tooltip, type TooltipProps } from "./Tooltip";

export type ComicTooltipProps = TooltipProps & {
  /** Bubble fill. */
  tone?: "paper" | "lime" | "pink" | "blue" | "orange";
};

const fills = {
  paper: "bg-paper-raised text-ink [--sui-tip:var(--paper-raised)]",
  lime: "bg-lime text-on-bright [--sui-tip:var(--lime)]",
  pink: "bg-pink text-on-bright [--sui-tip:var(--pink)]",
  blue: "bg-blue text-on-bright [--sui-tip:var(--blue)]",
  orange: "bg-orange text-on-bright [--sui-tip:var(--orange)]",
};

/**
 * A comic-book tooltip: a speech bubble with a tail pointing at its trigger,
 * that pops in with a little bounce. The same behavior as Tooltip: hover and
 * keyboard focus show it, Esc, blur, or pointer leave hide it (WCAG 1.4.13),
 * and the trigger gets aria-describedby. Motion stops for reduced motion.
 */
export function ComicTooltip({ tone = "paper", side = "top", className, ...props }: ComicTooltipProps) {
  return (
    <Tooltip
      side={side}
      className={cn(
        "sui-comic-tip rounded-xl border-[3px] px-3 py-1.5 font-sans text-sm font-bold shadow-[3px_3px_0_var(--ink)]",
        side === "top" ? "sui-comic-tip-top mb-4" : "sui-comic-tip-bottom mt-4",
        fills[tone],
        className,
      )}
      {...props}
    />
  );
}
