"use client";

import type { ChangeEvent, ComponentProps, CSSProperties } from "react";
import { cn } from "./cn";
import type { Tone } from "./tones";

export type SliderProps = Omit<ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> & {
  value: number;
  min?: number;
  max?: number;
  step?: number | "any";
  /** Called with the new numeric value. */
  onValueChange?: (value: number) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Color of the filled part of the track. */
  tone?: Tone;
};

/**
 * A native range input with a brutal track and thumb (styles in theme.css).
 * Native means arrow keys, Page Up/Down, Home/End, touch, and screen
 * reader support for free. Pass `aria-valuetext` for human-readable values
 * like "1:23 of 3:05".
 */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onChange,
  tone = "lime",
  className,
  style,
  ...props
}: SliderProps) {
  const span = max - min;
  const fill = span > 0 ? ((Math.min(max, Math.max(min, value)) - min) / span) * 100 : 0;

  return (
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
      className={cn("sui-range w-full", className)}
      style={{ ...style, "--sui-fill": `${fill}%`, "--sui-range-color": `var(--${tone})` } as CSSProperties}
      {...props}
    />
  );
}
