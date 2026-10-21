import type { CSSProperties } from "react";
import { cn } from "./cn";
import type { EqualizerProps } from "./Equalizer";
import { toneBg, type Tone } from "./tones";

export type ComicEqualizerProps = Omit<EqualizerProps, "tone"> & {
  /** Bar color, or "mix" for every bar its own bright. */
  tone?: Tone | "mix";
  /** Music notes floating up while it plays. */
  notes?: boolean;
};

const MIX: Tone[] = ["pink", "lime", "blue", "orange", "violet"];

/**
 * A comic-book "now playing" meter: thick-inked bars in mixed brights with
 * halftone dots, bouncing out of step, and music notes floating up while it
 * plays. Decorative and hidden from assistive tech; under reduced motion the
 * bars hold still and the notes stay put.
 */
export function ComicEqualizer({ playing = true, bars = 5, tone = "mix", notes = true, className, ...props }: ComicEqualizerProps) {
  return (
    <span
      aria-hidden
      data-playing={playing || undefined}
      className={cn("sui-eq sui-comic-eq relative inline-flex h-8 items-end gap-1", className)}
      {...props}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={cn(
            "sui-eq-bar block h-full w-2 rounded-t-[3px] border-[2.5px] border-ink shadow-[2px_0_0_var(--ink)]",
            toneBg[tone === "mix" ? MIX[i % MIX.length] : tone],
          )}
          style={
            {
              "--sui-eq-i": i,
              backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 22%, transparent) 1px, transparent 1.4px)",
              backgroundSize: "5px 5px",
            } as CSSProperties
          }
        />
      ))}
      {notes &&
        ["♪", "♫"].map((n, i) => (
          <span
            key={n}
            className="sui-comic-eq-note absolute -top-1 font-bold text-ink"
            style={{ left: `${30 + i * 45}%`, "--sui-eq-i": i } as CSSProperties}
          >
            {n}
          </span>
        ))}
    </span>
  );
}
