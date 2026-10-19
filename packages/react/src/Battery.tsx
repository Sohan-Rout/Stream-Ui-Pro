import type { ComponentProps } from "react";
import { Zap } from "lucide-react";
import { cn } from "./cn";
import { toneBg, type Tone } from "./tones";

export type BatterySize = "sm" | "md" | "lg";

export type BatteryProps = Omit<ComponentProps<"div">, "children"> & {
  /** Charge from 0 to 100. Clamped. */
  value: number;
  /** Shows a bolt and sweeps stripes across the fill. */
  charging?: boolean;
  /** Fill color. "auto" goes pink when low, orange at half or less, lime above. */
  tone?: Tone | "auto";
  /** At or below this, the battery counts as low: it reads "low" and blinks unless charging. */
  lowAt?: number;
  /** Discrete cells instead of a smooth fill, like a phone's status bar. */
  segments?: number;
  size?: BatterySize;
  /** Show the percentage next to the battery. */
  showValue?: boolean;
  /** Accessible name. */
  label?: string;
};

const body: Record<BatterySize, string> = {
  sm: "h-5 w-10",
  md: "h-7 w-14",
  lg: "h-10 w-20",
};
const cap: Record<BatterySize, string> = {
  sm: "h-2 w-1",
  md: "h-3 w-1.5",
  lg: "h-4 w-2",
};
const bolt: Record<BatterySize, string> = {
  sm: "size-3.5",
  md: "size-4.5",
  lg: "size-6",
};
const text: Record<BatterySize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
};

function autoTone(percent: number, lowAt: number): Tone {
  if (percent <= lowAt) return "pink";
  if (percent <= 50) return "orange";
  return "lime";
}

/**
 * A battery level: a hard-edged body and cap, a fill that changes color as
 * it drains, and the percentage beside it. Charging adds a bolt and moving
 * stripes; a low battery blinks. Both hold still for reduced motion.
 */
export function Battery({
  value,
  charging = false,
  tone = "auto",
  lowAt = 20,
  segments,
  size = "md",
  showValue = true,
  label = "Battery",
  className,
  ...props
}: BatteryProps) {
  const percent = Math.round(Math.min(100, Math.max(0, value)));
  const low = percent <= lowAt;
  const fill = toneBg[tone === "auto" ? autoTone(percent, lowAt) : tone];
  const cells = segments && segments > 0 ? Math.floor(segments) : 0;
  // Nearest cell, but a sliver of charge still lights one.
  const litCells = cells && percent > 0 ? Math.max(1, Math.round((percent / 100) * cells)) : 0;
  const state = [charging && "charging", low && "low"].filter(Boolean).join(", ");

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={state ? `${percent}%, ${state}` : `${percent}%`}
      data-charging={charging || undefined}
      data-low={(low && !charging) || undefined}
      className={cn("sui-battery inline-flex items-center gap-2 text-ink", className)}
      {...props}
    >
      <span aria-hidden className="inline-flex items-center">
        <span className={cn("relative block border-2 border-ink bg-paper-sunken p-0.5 shadow-brutal-sm", body[size])}>
          {cells ? (
            <span className="flex size-full gap-0.5">
              {Array.from({ length: cells }, (_, i) => (
                <span key={i} className={cn("sui-battery-fill h-full flex-1", i < litCells ? fill : "bg-transparent")} />
              ))}
            </span>
          ) : (
            <span
              className={cn("sui-battery-fill block h-full transition-[width] duration-300 ease-out motion-reduce:transition-none", fill)}
              style={{ width: `${percent}%` }}
            />
          )}
          {charging && (
            <span className="absolute inset-0 grid place-items-center">
              <Zap className={cn("fill-paper-raised stroke-ink", bolt[size])} strokeWidth={2.5} />
            </span>
          )}
        </span>
        <span className={cn("block border-2 border-l-0 border-ink bg-ink", cap[size])} />
      </span>
      {showValue && <span className={cn("font-mono font-bold tabular-nums", text[size])}>{percent}%</span>}
    </div>
  );
}
