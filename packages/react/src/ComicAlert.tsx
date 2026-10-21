import type { ComponentProps, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "./cn";
import type { AlertTone } from "./Alert";
import { ComicBadge } from "./ComicBadge";

const tones: Record<AlertTone, { bubble: string; tile: "blue" | "lime" | "orange" | "pink"; sticker: string; icon: typeof Info; sfx: string }> = {
  info: { bubble: "bg-blue-soft", tile: "blue", sticker: "bg-blue", icon: Info, sfx: "Hey!" },
  success: { bubble: "bg-lime-soft", tile: "lime", sticker: "bg-lime", icon: CircleCheck, sfx: "Yes!" },
  warning: { bubble: "bg-orange-soft", tile: "orange", sticker: "bg-orange", icon: TriangleAlert, sfx: "Uh-oh!" },
  danger: { bubble: "bg-pink-soft", tile: "pink", sticker: "bg-pink", icon: CircleAlert, sfx: "Yikes!" },
};

export type ComicAlertProps = Omit<ComponentProps<"div">, "title"> & {
  tone?: AlertTone;
  title?: ReactNode;
  /** Replaces the tone's icon in the starburst. Pass `null` for no starburst. */
  icon?: ReactNode;
  /** Buttons or links shown under the message. */
  action?: ReactNode;
  /** The stamped sound effect. Defaults by tone (HEY!, YES!, UH-OH!, YIKES!); false for none. */
  sfx?: ReactNode | false;
};

/**
 * A comic-book alert: a speech bubble whose tail points at a starburst with
 * the tone's icon, halftone dots, a shouty title, and a stamped sound effect.
 * It pops in when it appears; warnings and errors shake the burst a few
 * times. Warnings and errors use role="alert", info and success the politer
 * role="status", like Alert. Motion stops for reduced motion.
 */
export function ComicAlert({ tone = "info", title, icon, action, sfx, className, children, role, ...props }: ComicAlertProps) {
  const t = tones[tone];
  const urgent = tone === "warning" || tone === "danger";
  const glyph = icon === undefined ? <t.icon className="size-6" strokeWidth={2.5} /> : icon;
  const stamp = sfx === undefined ? t.sfx : sfx;

  return (
    <div
      role={role ?? (urgent ? "alert" : "status")}
      data-urgent={urgent || undefined}
      className={cn("sui-comic-alert flex items-center gap-1 text-ink", className)}
      {...props}
    >
      {glyph && (
        <span aria-hidden className="sui-comic-alert-burst relative z-10 shrink-0">
          <ComicBadge shape="burst" tone={t.tile} size="md" tilt={-8}>
            {glyph}
          </ComicBadge>
        </span>
      )}

      <div className="sui-comic-alert-bubble relative min-w-0 flex-1">
        {/* The tail: an ink triangle with the bubble's fill on top, pointing at the burst. */}
        {glyph && (
          <>
            <span aria-hidden className="absolute top-1/2 -left-[15px] block size-0 -translate-y-1/2 border-y-[11px] border-r-[16px] border-y-transparent border-r-ink" />
            <span
              aria-hidden
              className={cn("absolute top-1/2 -left-[9px] z-10 block size-0 -translate-y-1/2 border-y-[7px] border-r-[11px] border-y-transparent", {
                "border-r-blue-soft": tone === "info",
                "border-r-lime-soft": tone === "success",
                "border-r-orange-soft": tone === "warning",
                "border-r-pink-soft": tone === "danger",
              })}
            />
          </>
        )}
        <div
          className={cn("relative flex flex-col gap-1 rounded-2xl border-[3px] border-ink px-5 py-4 shadow-[5px_5px_0_var(--ink)]", t.bubble)}
          style={{
            backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 13%, transparent) 1.2px, transparent 1.6px)",
            backgroundSize: "8px 8px",
          }}
        >
          {stamp && (
            <span
              aria-hidden
              className={cn(
                "sui-comic-alert-stamp absolute -top-3.5 right-4 rotate-6 border-[3px] border-ink px-2 py-0.5 font-mono text-xs font-bold tracking-wide uppercase text-on-bright shadow-[2px_2px_0_var(--ink)]",
                t.sticker,
              )}
            >
              {stamp}
            </span>
          )}
          {title && <p className="pr-16 font-mono text-sm font-bold tracking-wide uppercase">{title}</p>}
          {children && <div className="text-sm leading-relaxed">{children}</div>}
          {action && <div className="mt-2 flex flex-wrap gap-3">{action}</div>}
        </div>
      </div>
    </div>
  );
}
