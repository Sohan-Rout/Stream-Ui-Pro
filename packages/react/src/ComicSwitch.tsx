"use client";

import { useState, type ReactNode } from "react";
import { cn } from "./cn";
import { halftone } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { SwitchProps } from "./Switch";

export type ComicSwitchProps = SwitchProps & {
  /** Words shown in the track, on then off. Defaults to ON! / OFF; false for none. */
  labels?: [ReactNode, ReactNode] | false;
};

/**
 * A comic-book switch: a halftone pill with a starburst thumb that rolls
 * across, and the state shouted in the track (ON! / OFF). A button with
 * role="switch", the same as Switch. Motion stops for reduced motion.
 */
export function ComicSwitch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  labels = ["On!", "Off"],
  className,
  ...props
}: ComicSwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      data-on={isOn || undefined}
      onClick={() => {
        setInternal(!isOn);
        onCheckedChange?.(!isOn);
      }}
      className={cn(
        "sui-comic-switch relative inline-flex h-9 w-[4.75rem] shrink-0 cursor-pointer items-center rounded-full border-[3px] border-ink shadow-[3px_3px_0_var(--ink)]",
        "disabled:pointer-events-none disabled:opacity-50",
        isOn ? "bg-lime" : "bg-paper-sunken",
        className,
      )}
      style={halftone(14)}
      {...props}
    >
      {labels && (
        <span
          aria-hidden
          className={cn(
            "absolute font-mono text-[10px] font-bold tracking-wide uppercase",
            isOn ? "left-2.5 text-on-bright" : "right-2.5 text-ink-muted",
          )}
        >
          {isOn ? labels[0] : labels[1]}
        </span>
      )}
      <span aria-hidden className={cn("sui-comic-switch-thumb absolute top-1/2 size-9 -translate-y-1/2", isOn ? "left-[calc(100%-1.9rem)]" : "-left-1")}>
        <svg viewBox="0 0 100 100" overflow="visible" className="size-full">
          <path
            d={SHAPES.burst.d}
            className={cn("stroke-ink", isOn ? "fill-pink" : "fill-paper-raised")}
            strokeWidth={7}
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
