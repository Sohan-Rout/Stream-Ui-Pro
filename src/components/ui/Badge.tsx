import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "yellow"
  | "pink"
  | "blue"
  | "green"
  | "orange"
  | "violet"
  | "paper"
  | "ink";

const tones: Record<BadgeTone, string> = {
  yellow: "bg-yellow text-on-bright",
  pink: "bg-pink text-on-bright",
  blue: "bg-blue text-on-bright",
  green: "bg-green text-on-bright",
  orange: "bg-orange text-on-bright",
  violet: "bg-violet text-on-bright",
  paper: "bg-paper-raised text-ink",
  ink: "bg-ink text-paper",
};

export type BadgeProps = ComponentProps<"span"> & { tone?: BadgeTone };

export function Badge({ tone = "yellow", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-2.5 py-0.5 font-mono text-xs font-semibold tracking-wide uppercase [&_svg]:size-3.5",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
