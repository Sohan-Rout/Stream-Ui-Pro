import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { fieldFrame } from "./field";

export type InputProps = ComponentProps<"input"> & {
  /** Leading icon, e.g. `<Mail />`. Decorative; hidden from assistive tech. */
  icon?: ReactNode;
  /** Marks the field invalid (sets `aria-invalid`) and tints it. */
  invalid?: boolean;
  /** Classes for the outer frame. `className` goes to the `<input>`. */
  frameClassName?: string;
};

export function Input({
  icon,
  invalid,
  frameClassName,
  className,
  ...props
}: InputProps) {
  return (
    <div className={fieldFrame({ invalid, className: cn("items-center", frameClassName) })}>
      {icon && (
        <span aria-hidden className="ml-3 shrink-0 text-ink-muted [&_svg]:size-4.5">
          {icon}
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        className={cn(
          "h-11 w-full min-w-0 bg-transparent px-3 placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    </div>
  );
}
