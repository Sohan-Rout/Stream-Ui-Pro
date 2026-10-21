import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import type { CardTone } from "./Card";
import { ComicBadge } from "./ComicBadge";

export type ComicCardProps = ComponentProps<"div"> & {
  /** Panel fill: a soft tint, with the caption in the matching bright. */
  tone?: CardTone;
  /** A narration box stuck over the top-left corner ("MEANWHILE..."). */
  caption?: ReactNode;
  /** A starburst sound effect stuck on the top-right corner ("KAPOW!"). */
  sfx?: ReactNode;
  /** Halftone dots over the fill, like printed comics. */
  halftone?: boolean;
  /** Tilt in degrees. */
  tilt?: number;
};

const panelFill: Record<CardTone, string> = {
  paper: "fill-paper-raised",
  lime: "fill-lime-soft",
  pink: "fill-pink-soft",
  blue: "fill-blue-soft",
  violet: "fill-violet-soft",
  orange: "fill-orange-soft",
};
const captionBg: Record<CardTone, string> = {
  paper: "bg-lime",
  lime: "bg-lime",
  pink: "bg-pink",
  blue: "bg-blue",
  violet: "bg-violet",
  orange: "bg-orange",
};
const sfxTone = { paper: "pink", lime: "pink", pink: "lime", blue: "orange", violet: "lime", orange: "blue" } as const;

/** A comic panel: a slightly skewed box. */
const PANEL = "M2 4 L98 1 L99 97 L1 99 Z";
const CLIP = "polygon(2% 4%, 98% 1%, 99% 97%, 1% 99%)";

/**
 * A comic-book panel card: a skewed panel with halftone dots, an ink outline
 * and hard shadow that follow its shape, an optional narration caption on
 * the top-left corner, and an optional starburst sound effect on the
 * top-right. Lifts on hover; the burst spins. Compose the inside freely
 * (CardTitle and CardDescription work well). Motion stops for reduced motion.
 */
export function ComicCard({
  tone = "paper",
  caption,
  sfx,
  halftone = true,
  tilt = -1,
  className,
  style,
  children,
  ...props
}: ComicCardProps) {
  return (
    <div
      className={cn("sui-comic-card relative flex flex-col text-ink", caption ? "pt-10" : "pt-6", "px-6 pb-6", className)}
      style={{ rotate: `${tilt}deg`, ...style }}
      {...props}
    >
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible" className="sui-comic-card-shape absolute inset-0 -z-0 size-full">
        <path d={PANEL} className={cn("stroke-ink", panelFill[tone])} strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      {/* Halftone dots, clipped to the panel, so they stay round at any size. */}
      {halftone && (
        <span
          aria-hidden
          className="sui-comic-card-dots pointer-events-none absolute inset-0"
          style={{
            clipPath: CLIP,
            backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 14%, transparent) 1.2px, transparent 1.6px)",
            backgroundSize: "8px 8px",
          }}
        />
      )}
      {caption && (
        <p
          className={cn(
            "absolute -top-3 -left-3 z-10 max-w-[80%] -rotate-2 border-[3px] border-ink px-2.5 py-1 font-mono text-xs font-bold tracking-wide uppercase text-on-bright shadow-[3px_3px_0_var(--ink)]",
            captionBg[tone],
          )}
        >
          {caption}
        </p>
      )}
      {sfx && (
        <span className="sui-comic-card-sfx absolute -top-7 -right-6 z-10">
          <ComicBadge shape="burst" tone={sfxTone[tone]} size="sm" tilt={12}>
            {sfx}
          </ComicBadge>
        </span>
      )}
      <div className="relative flex flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}
