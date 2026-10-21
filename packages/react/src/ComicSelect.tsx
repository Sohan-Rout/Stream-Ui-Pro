import { ChevronDown } from "lucide-react";
import { cn } from "./cn";
import { comicFrame, halftone } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { SelectProps } from "./Select";

export type ComicSelectProps = SelectProps;

/**
 * A comic-book select: a native <select> (the platform's own picker,
 * typeahead, full keyboard and screen reader support) in the comic frame,
 * with the arrow on a little starburst that spins when the field has focus.
 */
export function ComicSelect({ invalid, frameClassName, className, children, ...props }: ComicSelectProps) {
  return (
    <div className={comicFrame({ invalid, className: cn("items-center", frameClassName) })} style={halftone(10)}>
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          "h-11 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-12 pl-3 font-semibold focus:outline-none disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-1.5 grid size-9 place-items-center">
        <svg viewBox="0 0 100 100" overflow="visible" className="sui-comic-select-burst absolute inset-0 size-full">
          <path d={SHAPES.burst.d} className="fill-lime stroke-ink" strokeWidth={7} strokeLinejoin="round" />
        </svg>
        <ChevronDown className="relative size-4 text-on-bright" strokeWidth={3} />
      </span>
    </div>
  );
}
