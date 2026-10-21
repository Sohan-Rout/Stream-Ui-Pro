"use client";

import { cn } from "./cn";
import { AnimatedIcon, type AnimatedIconProps } from "./AnimatedIcon";
import { SHAPES } from "./ComicBadge";
import type { Tone } from "./tones";

export type ComicAnimatedIconProps = AnimatedIconProps & {
  /** The sticker behind the icon. */
  shape?: "burst" | "seal" | "splat" | "blob";
  tone?: Tone | "paper";
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "size-12 [&_svg.lucide]:size-5", md: "size-16 [&_svg.lucide]:size-7", lg: "size-22 [&_svg.lucide]:size-10" };
const fills: Record<Tone | "paper", string> = {
  lime: "fill-lime",
  pink: "fill-pink",
  blue: "fill-blue",
  violet: "fill-violet",
  orange: "fill-orange",
  paper: "fill-paper-raised",
};

/**
 * AnimatedIcon on a comic sticker: the icon sits on a starburst, seal, splat,
 * or blob with an ink outline, and impact lines burst out around it whenever
 * the animation plays (on hover, on a loop, or once). Decorative unless you
 * label it; everything stops for reduced motion.
 */
export function ComicAnimatedIcon({
  shape = "burst",
  tone = "lime",
  size = "md",
  trigger = "hover",
  className,
  ...props
}: ComicAnimatedIconProps) {
  return (
    <span
      data-trigger={trigger}
      className={cn("sui-comic-icon relative inline-grid shrink-0 place-items-center text-ink", sizes[size], className)}
    >
      <svg aria-hidden viewBox="-60 -60 120 120" overflow="visible" className="sui-comic-icon-lines pointer-events-none absolute -inset-1/4 size-[150%]">
        <g stroke="var(--ink)" strokeWidth="5" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="0" y1="-44" x2="0" y2="-56" transform={`rotate(${a})`} />
          ))}
        </g>
      </svg>
      <svg aria-hidden viewBox="0 0 100 100" overflow="visible" className="sui-comic-icon-shape absolute inset-0 size-full drop-shadow-[3px_3px_0_var(--ink)]">
        <path d={SHAPES[shape].d} className={cn("stroke-ink", fills[tone])} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <AnimatedIcon trigger={trigger} className="relative" {...props} />
    </span>
  );
}
