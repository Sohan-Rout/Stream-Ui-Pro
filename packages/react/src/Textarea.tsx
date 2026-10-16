import type { ComponentProps } from "react";
import { cn } from "./cn";
import { fieldFrame } from "./field";

export type TextareaProps = ComponentProps<"textarea"> & {
  /** Marks the field invalid (sets `aria-invalid`) and tints it. */
  invalid?: boolean;
  /** Classes for the outer frame. `className` goes to the `<textarea>`. */
  frameClassName?: string;
};

export function Textarea({ invalid, frameClassName, className, rows = 4, ...props }: TextareaProps) {
  return (
    <div className={fieldFrame({ invalid, className: frameClassName })}>
      <textarea
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full min-w-0 resize-y bg-transparent px-3 py-2.5 leading-relaxed placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed",
          className,
        )}
        {...props}
      />
    </div>
  );
}
