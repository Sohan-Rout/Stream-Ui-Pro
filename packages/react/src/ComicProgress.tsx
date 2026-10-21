import type { ReactNode } from "react";
import { cn } from "./cn";
import { halftone } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { ProgressProps } from "./Progress";
import { toneBg } from "./tones";

export type ComicProgressProps = ProgressProps & {
  /** The percentage on a starburst riding the end of the fill. */
  showValue?: boolean;
  /** The sticker slapped on when complete. Defaults to "Done!"; false for none. */
  doneLabel?: ReactNode | false;
};

/**
 * A comic-book progress bar: a hand-inked track with halftone dots, a fill
 * with speed lines racing along it, the percentage on a starburst riding the
 * front, and a "Done!" sticker at 100%. Motion stops for reduced motion.
 * Give it a name with `aria-label` or `aria-labelledby`.
 */
export function ComicProgress({
  value,
  max = 100,
  tone = "pink",
  showValue = true,
  doneLabel = "Done!",
  className,
  ...props
}: ComicProgressProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max > 0 ? (clamped / max) * 100 : 0;
  const done = percent >= 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      data-done={done || undefined}
      className={cn("sui-comic-progress relative h-7", showValue && "mr-5", className)}
      {...props}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[12px_5px_10px_6px/6px_10px_5px_12px] border-[3px] border-ink bg-paper-sunken shadow-[4px_4px_0_var(--ink)]"
        style={halftone(14)}
      >
        <div
          className={cn(
            "sui-comic-progress-fill h-full transition-[width] duration-300 ease-out motion-reduce:transition-none",
            percent > 0 && !done && "border-r-[3px] border-ink",
            toneBg[tone],
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showValue && (
        <span
          aria-hidden
          className="sui-comic-progress-burst absolute top-1/2 grid size-12 -translate-1/2 place-items-center font-mono text-[10px] font-bold text-ink transition-[left] duration-300 ease-out motion-reduce:transition-none"
          style={{ left: `${percent}%` }}
        >
          <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[2px_2px_0_var(--ink)]">
            <path d={SHAPES.burst.d} className="fill-paper-raised stroke-ink" strokeWidth={6} strokeLinejoin="round" />
          </svg>
          <span className="relative">{Math.round(percent)}%</span>
        </span>
      )}
      {done && doneLabel && (
        <span
          aria-hidden
          className="sui-comic-stamp absolute -top-5 left-3 z-10 -rotate-6 border-[3px] border-ink bg-lime px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase text-on-bright shadow-[2px_2px_0_var(--ink)]"
        >
          {doneLabel}
        </span>
      )}
    </div>
  );
}
