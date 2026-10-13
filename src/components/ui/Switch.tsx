"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type SwitchProps = Omit<ComponentProps<"button">, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isOn = checked ?? internal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={() => {
        setInternal(!isOn);
        onCheckedChange?.(!isOn);
      }}
      className={cn(
        "relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center border-2 border-ink shadow-brutal-sm transition-colors duration-150 motion-reduce:transition-none",
        "disabled:pointer-events-none disabled:opacity-50",
        isOn ? "bg-green" : "bg-paper-sunken",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "size-5 border-2 border-ink bg-paper-raised transition-[translate] duration-150 ease-out motion-reduce:transition-none",
          isOn ? "translate-x-7" : "translate-x-1",
        )}
      />
    </button>
  );
}
