import type { ComponentProps } from "react";
import { cn } from "./cn";
import { SHAPES } from "./ComicBadge";
import type { AvatarSize } from "./Avatar";
import type { Tone } from "./tones";

export type ComicAvatarShape = "burst" | "seal" | "splat" | "blob";

export type ComicAvatarProps = ComponentProps<"span"> & {
  /** One or two characters, e.g. "AK". */
  initials: string;
  /** Full name, announced to screen readers. */
  name?: string;
  shape?: ComicAvatarShape;
  tone?: Tone | "paper";
  size?: AvatarSize;
  /** Tilt in degrees. */
  tilt?: number;
};

const sizes: Record<AvatarSize, string> = {
  sm: "size-11 text-xs",
  md: "size-15 text-sm",
  lg: "size-20 text-base",
};
const fills: Record<Tone | "paper", string> = {
  lime: "fill-lime",
  pink: "fill-pink",
  blue: "fill-blue",
  violet: "fill-violet",
  orange: "fill-orange",
  paper: "fill-paper-raised",
};

/**
 * A comic-book avatar: initials on a starburst, scalloped seal, splat, or
 * blob, with an ink outline and a hard shadow that follow the shape. It
 * jumps and turns a little on hover. Motion stops for reduced motion.
 */
export function ComicAvatar({
  initials,
  name,
  shape = "blob",
  tone = "lime",
  size = "md",
  tilt = 0,
  className,
  style,
  ...props
}: ComicAvatarProps) {
  return (
    <span
      role={name ? "img" : undefined}
      aria-label={name}
      className={cn(
        "sui-comic-avatar relative grid shrink-0 place-items-center font-mono font-bold",
        tone === "paper" ? "text-ink" : "text-on-bright",
        sizes[size],
        className,
      )}
      style={{ rotate: `${tilt}deg`, ...style }}
      {...props}
    >
      <svg aria-hidden viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[3px_3px_0_var(--ink)]">
        <path d={SHAPES[shape].d} className={cn("stroke-ink", fills[tone])} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <span aria-hidden={name ? true : undefined} className="relative">
        {initials}
      </span>
    </span>
  );
}

/** Overlaps its children like stickers slapped on a page, each at its own tilt. */
export function ComicAvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      className={cn("flex items-center [&>*+*]:-ml-3 [&>*:nth-child(odd)]:-rotate-6 [&>*:nth-child(even)]:rotate-6", className)}
      {...props}
    />
  );
}
