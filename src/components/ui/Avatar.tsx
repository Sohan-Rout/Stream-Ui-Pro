import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { toneBg, type Tone } from "./tones";

export type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-base",
};

export type AvatarProps = ComponentProps<"span"> & {
  /** One or two characters, e.g. "AK". */
  initials: string;
  /** Full name, announced to screen readers. */
  name?: string;
  tone?: Tone | "paper";
  size?: AvatarSize;
};

export function Avatar({
  initials,
  name,
  tone = "lime",
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      role={name ? "img" : undefined}
      aria-label={name}
      className={cn(
        "grid shrink-0 place-items-center rounded-full border-2 border-ink font-mono font-bold",
        tone === "paper" ? "bg-paper-raised text-ink" : cn(toneBg[tone], "text-on-bright"),
        sizes[size],
        className,
      )}
      {...props}
    >
      <span aria-hidden={name ? true : undefined}>{initials}</span>
    </span>
  );
}

/** Overlaps its children like a stack of coins. */
export function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return <div role="group" className={cn("flex items-center [&>*+*]:-ml-3", className)} {...props} />;
}
