import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { toneBg, type Tone } from "./tones";

export type ProgressProps = Omit<ComponentProps<"div">, "children"> & {
  value: number;
  max?: number;
  tone?: Tone;
};

/** Determinate progress bar. Give it a name with `aria-label` or `aria-labelledby`. */
export function Progress({ value, max = 100, tone = "pink", className, ...props }: ProgressProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const percent = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("h-6 border-2 border-ink bg-paper-sunken shadow-brutal-sm", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full transition-[width] duration-200 ease-out motion-reduce:transition-none",
          percent > 0 && percent < 100 && "border-r-2 border-ink",
          toneBg[tone],
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
