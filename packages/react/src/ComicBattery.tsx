import type { ReactNode } from "react";
import { cn } from "./cn";
import { halftone } from "./comic";
import { ComicBadge } from "./ComicBadge";
import type { BatteryProps } from "./Battery";
import { toneBg, type Tone } from "./tones";

export type ComicBatteryProps = Omit<BatteryProps, "segments"> & {
  /** Stickers for the states: charging then low. Defaults to ZAP! / LOW!; false for none. */
  sfx?: [ReactNode, ReactNode] | false;
};

const body = { sm: "h-6 w-12", md: "h-9 w-18", lg: "h-12 w-24" } as const;
const cap = { sm: "h-2.5 w-1.5", md: "h-4 w-2", lg: "h-5 w-2.5" } as const;
const text = { sm: "text-xs", md: "text-sm", lg: "text-lg" } as const;

function autoTone(percent: number, lowAt: number): Tone {
  if (percent <= lowAt) return "pink";
  if (percent <= 50) return "orange";
  return "lime";
}

/**
 * A comic-book battery: a hand-inked body with halftone dots and a fill that
 * goes lime, orange, then pink as it drains. Charging slaps on a ZAP!
 * starburst and races stripes across the fill; a low battery shakes a LOW!
 * sticker. role="meter", the same as Battery. Motion stops for reduced motion.
 */
export function ComicBattery({
  value,
  charging = false,
  tone = "auto",
  lowAt = 20,
  size = "md",
  showValue = true,
  label = "Battery",
  sfx = ["Zap!", "Low!"],
  className,
  ...props
}: ComicBatteryProps) {
  const percent = Math.round(Math.min(100, Math.max(0, value)));
  const low = percent <= lowAt;
  const fill = toneBg[tone === "auto" ? autoTone(percent, lowAt) : tone];
  const state = [charging && "charging", low && "low"].filter(Boolean).join(", ");
  const sticker = sfx ? (charging ? sfx[0] : low ? sfx[1] : null) : null;

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
      className={cn("sui-comic-battery inline-flex items-center gap-3 text-ink", className)}
      {...props}
    >
      <span aria-hidden className="relative inline-flex -rotate-2 items-center">
        <span
          className={cn(
            "relative block overflow-hidden rounded-[8px_4px_9px_4px/4px_9px_4px_8px] border-[3px] border-ink bg-paper-sunken p-[3px] shadow-[3px_3px_0_var(--ink)]",
            body[size],
          )}
          style={halftone(16)}
        >
          <span
            className={cn("sui-battery-fill block h-full rounded-[3px] transition-[width] duration-300 ease-out motion-reduce:transition-none", fill)}
            style={{ width: `${percent}%` }}
          />
        </span>
        <span className={cn("block rounded-r-[3px] border-[3px] border-l-0 border-ink bg-ink", cap[size])} />
        {sticker && (
          <span className={cn("sui-comic-battery-sfx absolute -top-8 -left-7 z-10")}>
            <ComicBadge shape={charging ? "burst" : "splat"} tone={charging ? "orange" : "pink"} size="sm" tilt={charging ? 10 : -8} className="size-12 p-2">
              {sticker}
            </ComicBadge>
          </span>
        )}
      </span>
      {showValue && <span className={cn("font-mono font-bold tabular-nums", text[size])}>{percent}%</span>}
    </div>
  );
}
