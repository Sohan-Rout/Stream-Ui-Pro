import type { ComponentProps } from "react";
import { cn } from "./cn";

/**
 * A placeholder block for content that's loading. Size it with classes
 * (`h-4 w-40`, `size-12 rounded-full`). It's hidden from screen readers;
 * mark the loading region with `aria-busy` and give it a label instead.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("border-2 border-ink-faint bg-paper-sunken motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}
