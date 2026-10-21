import { cn } from "./cn";
import { halftone } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { CheckboxProps } from "./Checkbox";

export type ComicCheckboxProps = CheckboxProps;

/**
 * A comic-book checkbox: a hand-inked box whose check mark draws itself in
 * with a starburst flash behind it. The real `<input>` stays in the DOM
 * (visually hidden), so forms, keyboard, and screen readers work unchanged.
 * Motion stops for reduced motion.
 */
export function ComicCheckbox({ label, className, ...props }: ComicCheckboxProps) {
  return (
    <label
      className={cn(
        "sui-comic-check inline-flex cursor-pointer items-center gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "sui-comic-check-box relative grid size-7 shrink-0 -rotate-3 place-items-center rounded-[7px_3px_8px_3px/3px_8px_3px_7px] border-[3px] border-ink bg-paper-raised shadow-[3px_3px_0_var(--ink)]",
          "peer-checked:bg-lime peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue",
        )}
        style={halftone(12)}
      >
        <svg viewBox="0 0 100 100" overflow="visible" className="sui-comic-check-flash absolute -inset-3 -z-10 size-[calc(100%+1.5rem)] opacity-0">
          <path d={SHAPES.burst.d} className="fill-pink stroke-ink" strokeWidth={5} strokeLinejoin="round" />
        </svg>
        <svg viewBox="0 0 24 24" className="size-5 overflow-visible text-ink">
          <path className="sui-comic-check-mark" d="M4 13 L10 18 L21 4" pathLength={1} fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label && <span className="font-bold">{label}</span>}
    </label>
  );
}
