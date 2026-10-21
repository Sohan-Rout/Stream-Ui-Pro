import type { ReactNode } from "react";
import { cn } from "./cn";
import { halftone } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { RadioGroupProps, RadioProps } from "./Radio";

export type ComicRadioProps = RadioProps;

/**
 * A comic-book radio: a hand-inked blob that fills lime with a spinning ink
 * star when chosen. A native radio underneath; group them with the same
 * `name` inside a ComicRadioGroup (or any fieldset with a legend).
 */
export function ComicRadio({ label, description, className, ...props }: ComicRadioProps) {
  return (
    <label
      className={cn(
        "sui-comic-radio inline-flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input type="radio" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="relative mt-px grid size-7 shrink-0 place-items-center rounded-full peer-checked:[&>svg:first-child]:fill-lime peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue"
      >
        <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full fill-paper-raised drop-shadow-[3px_3px_0_var(--ink)]">
          <path d={SHAPES.blob.d} className="stroke-ink" strokeWidth={3} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="pointer-events-none absolute inset-1 rounded-full" style={halftone(14)} />
        <svg viewBox="0 0 100 100" className="sui-comic-radio-star relative size-4 fill-ink">
          <path d={SHAPES.burst.d} />
        </svg>
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && <span className="font-bold">{label}</span>}
          {description && <span className="text-sm text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}

export type ComicRadioGroupProps = Omit<RadioGroupProps, "legend"> & {
  /** Visible group label, rendered as the fieldset's legend on a caption box. */
  legend: ReactNode;
};

/** A fieldset whose legend is a tilted comic caption box; screen readers announce it with each radio. */
export function ComicRadioGroup({ legend, orientation = "vertical", className, children, ...props }: ComicRadioGroupProps) {
  return (
    <fieldset className={cn("min-w-0", className)} {...props}>
      <legend className="mb-4 -rotate-2 border-[3px] border-ink bg-lime px-2.5 py-1 font-mono text-xs font-bold tracking-wide uppercase text-on-bright shadow-[3px_3px_0_var(--ink)]">
        {legend}
      </legend>
      <div className={cn("flex gap-3.5", orientation === "vertical" ? "flex-col" : "flex-wrap gap-x-7")}>{children}</div>
    </fieldset>
  );
}
