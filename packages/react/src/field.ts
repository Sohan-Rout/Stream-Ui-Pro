import { cn } from "./cn";

/**
 * The shared frame for text-entry fields (Input, Textarea, Select): ink
 * border, hard shadow that deepens on focus, a visible focus ring, and
 * invalid / disabled states. Keeping it in one place keeps fields identical.
 */
export function fieldFrame({ invalid, className }: { invalid?: boolean; className?: string } = {}) {
  return cn(
    "flex border-2 border-ink bg-paper-raised shadow-brutal-sm transition-shadow duration-150",
    "focus-within:shadow-brutal focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-blue",
    "has-disabled:opacity-50 has-disabled:shadow-none",
    invalid && "bg-pink-soft",
    className,
  );
}
