import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";
import { fieldFrame } from "./field";

export type SelectProps = ComponentProps<"select"> & {
  /** Marks the field invalid (sets `aria-invalid`) and tints it. */
  invalid?: boolean;
  /** Classes for the outer frame. `className` goes to the `<select>`. */
  frameClassName?: string;
};

/**
 * A native <select> in the brutal frame. Native means the platform's own
 * picker on phones, typeahead, and full keyboard and screen reader support.
 */
export function Select({ invalid, frameClassName, className, children, ...props }: SelectProps) {
  return (
    <div className={fieldFrame({ invalid, className: cn("relative items-center", frameClassName) })}>
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          "h-11 w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-10 pl-3 focus:outline-none disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-3 size-4.5 text-ink" strokeWidth={2.5} />
    </div>
  );
}
