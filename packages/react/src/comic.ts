import type { CSSProperties } from "react";
import { cn } from "./cn";

/**
 * Shared pieces for the comic-book components (not exported from the
 * package): printed halftone dots, a hand-drawn uneven corner radius, and
 * the frame that comic text fields share.
 */

/** Halftone dots as a background layer. Round at any size, unlike an SVG pattern in a stretched box. */
export const halftone = (strength = 13): CSSProperties => ({
  backgroundImage: `radial-gradient(color-mix(in oklab, var(--ink) ${strength}%, transparent) 1.2px, transparent 1.6px)`,
  backgroundSize: "8px 8px",
});

/** Uneven corners, so a box looks inked by hand rather than drawn with a ruler. */
export const sketchy = "rounded-[14px_5px_12px_6px/6px_12px_5px_14px]";

/**
 * The comic text-field frame (ComicInput, ComicTextarea, ComicSelect): a
 * thick ink border with uneven corners, halftone dots, and a hard shadow
 * that lifts toward the light on focus.
 */
export function comicFrame({ invalid, className }: { invalid?: boolean; className?: string } = {}) {
  return cn(
    "sui-comic-field relative flex border-[3px] border-ink text-ink shadow-[4px_4px_0_var(--ink)]",
    sketchy,
    "focus-within:-translate-0.5 focus-within:shadow-[6px_6px_0_var(--ink)] focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-blue",
    "has-disabled:opacity-50 has-disabled:shadow-none",
    invalid ? "bg-pink-soft" : "bg-paper-raised",
    className,
  );
}

/** The "Oops!" sticker slapped on an invalid comic field. Decorative. */
export const stampClass =
  "sui-comic-stamp pointer-events-none absolute -top-3.5 right-3 z-10 rotate-6 border-[3px] border-ink bg-pink px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase text-on-bright shadow-[2px_2px_0_var(--ink)]";
