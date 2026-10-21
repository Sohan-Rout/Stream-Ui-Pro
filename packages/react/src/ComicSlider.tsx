"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "./cn";
import { halftone } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { SliderProps } from "./Slider";
import { toneBg } from "./tones";

export type ComicSliderProps = SliderProps & {
  /** Show the value in a speech bubble over the thumb. */
  showValue?: boolean;
  /** Format the value for the bubble, e.g. `(v) => v + "%"`. */
  formatValue?: (value: number) => ReactNode;
};

/**
 * A comic-book slider: a halftone track with a starburst thumb and the value
 * in a speech bubble over it. A native range input sits on top (invisible),
 * so arrow keys, Page Up/Down, Home/End, touch, and screen readers all work.
 */
export function ComicSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onChange,
  tone = "lime",
  showValue = true,
  formatValue = String,
  className,
  style,
  ...props
}: ComicSliderProps) {
  const span = max - min;
  const fill = span > 0 ? (Math.min(max, Math.max(min, value)) - min) / span : 0;
  // The native thumb is 2rem wide (theme.css), so its center runs from 1rem to 100% - 1rem.
  const at = `calc(1rem + (100% - 2rem) * ${fill})`;

  return (
    <div className={cn("sui-comic-slider relative h-9 w-full", showValue && "mt-9", className)} style={style}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          onChange?.(e);
          onValueChange?.(Number(e.target.value));
        }}
        className="sui-comic-range peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-full border-[3px] border-ink bg-paper-sunken shadow-[3px_3px_0_var(--ink)] peer-disabled:opacity-50"
      >
        <div className={cn("h-full border-r-[3px] border-ink", toneBg[tone])} style={{ width: at, ...halftone(16) }} />
      </div>
      <span
        aria-hidden
        className="sui-comic-slider-thumb pointer-events-none absolute top-1/2 size-9 -translate-1/2 rounded-full peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue peer-active:scale-110"
        style={{ left: at, "--sui-turn": Math.round(fill * 270) } as CSSProperties}
      >
        <svg viewBox="0 0 100 100" overflow="visible" className="size-full drop-shadow-[2px_2px_0_var(--ink)]">
          <path d={SHAPES.burst.d} className="fill-paper-raised stroke-ink" strokeWidth={7} strokeLinejoin="round" />
        </svg>
      </span>
      {showValue && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-9 -translate-x-1/2 rounded-lg border-[3px] border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-ink shadow-[2px_2px_0_var(--ink)] after:absolute after:top-full after:left-1/2 after:-mt-px after:-ml-1.5 after:border-x-[6px] after:border-t-[7px] after:border-x-transparent after:border-t-ink"
          style={{ left: at }}
        >
          {formatValue(value)}
        </span>
      )}
    </div>
  );
}
