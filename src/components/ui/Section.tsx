import type { ComponentProps } from "react";
import { cn } from "@streamui/react";

/** Hollow square marking where a rail meets a horizontal rule. */
function Joint({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -top-px z-10 size-2.5 -translate-y-1/2 border-2 border-ink bg-paper",
        side === "left" ? "-left-px -translate-x-1/2" : "-right-px translate-x-1/2",
      )}
    />
  );
}

export type SectionProps = ComponentProps<"section"> & {
  /** Classes for the inner railed column. */
  railClassName?: string;
  /** Draw joint markers at the top corners of the rail. */
  joints?: boolean;
};

/**
 * Full-bleed band with a bottom rule and a centered column bounded by
 * vertical rails. The hatched page margin shows outside the rails.
 */
export function Section({
  className,
  railClassName,
  joints = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("scroll-mt-16 border-b-2 border-ink", className)}
      {...props}
    >
      <Rail className={railClassName}>
        {joints && (
          <>
            <Joint side="left" />
            <Joint side="right" />
          </>
        )}
        {children}
      </Rail>
    </section>
  );
}

export function Rail({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative mx-3 border-x-2 border-ink bg-paper sm:mx-6 xl:mx-auto xl:max-w-6xl",
        className,
      )}
      {...props}
    />
  );
}
