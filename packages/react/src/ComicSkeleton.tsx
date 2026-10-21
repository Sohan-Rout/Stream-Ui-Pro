import type { ComponentProps } from "react";
import { cn } from "./cn";

/**
 * A comic-book loading placeholder: a dashed, hand-inked block of halftone
 * dots that drift across it like a printing press warming up. Size it with
 * classes (`h-4 w-40`, `size-12 rounded-full`). Hidden from screen readers;
 * mark the loading region with `aria-busy` and give it a label instead.
 */
export function ComicSkeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "sui-comic-skeleton rounded-[10px_4px_8px_5px/5px_8px_4px_10px] border-[3px] border-dashed border-ink/35 bg-paper-sunken",
        className,
      )}
      {...props}
    />
  );
}
