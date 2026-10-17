import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Class merging that knows the theme's custom utilities: the brutal shadow
 * tokens resolve as shadow conflicts, and the pattern utilities (bg-dots,
 * bg-hatch, bg-pixel-grid) as background *images*, so `bg-dots bg-paper`
 * keeps both instead of dropping one as a duplicate background color.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { shadow: ["brutal-sm", "brutal", "brutal-lg"] },
    classGroups: { "bg-image": [{ bg: ["dots", "hatch", "pixel-grid"] }] },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
