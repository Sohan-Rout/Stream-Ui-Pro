import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The site's class merger. Same as the package's `cn()`, plus the site-only
 * pattern utilities from globals.css. Without this, tailwind-merge reads
 * `bg-dots` as a background *color* and drops `bg-paper` next to it (or the
 * other way round), so a pattern and its backing color can't coexist.
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
