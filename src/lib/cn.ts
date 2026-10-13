import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the custom shadow tokens in globals.css so
// `shadow-brutal` and `shadow-none` resolve as conflicts.
const twMerge = extendTailwindMerge({
  extend: { theme: { shadow: ["brutal-sm", "brutal", "brutal-lg"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
