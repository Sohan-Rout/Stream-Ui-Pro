import type { ComponentProps, CSSProperties } from "react";
import { cn } from "./cn";
import { toneBg, type Tone } from "./tones";

export type EqualizerProps = ComponentProps<"span"> & {
  /** Animate the bars; when false they rest low. */
  playing?: boolean;
  bars?: number;
  tone?: Tone;
};

/**
 * A decorative "now playing" meter. Each bar gets its own speed and delay so
 * the motion never looks like one block. Hidden from assistive tech, and
 * still under prefers-reduced-motion (styles in theme.css).
 */
export function Equalizer({ playing = true, bars = 4, tone = "lime", className, ...props }: EqualizerProps) {
  return (
    <span
      aria-hidden
      data-playing={playing || undefined}
      className={cn("sui-eq inline-flex h-4 items-end gap-0.5", className)}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={cn("sui-eq-bar block h-full w-1 border border-ink", toneBg[tone])}
          style={{ "--sui-eq-i": i } as CSSProperties}
        />
      ))}
    </span>
  );
}
