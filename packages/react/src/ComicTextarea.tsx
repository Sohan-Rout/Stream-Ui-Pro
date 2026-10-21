import type { ReactNode } from "react";
import { cn } from "./cn";
import { comicFrame, halftone, stampClass } from "./comic";
import type { TextareaProps } from "./Textarea";

export type ComicTextareaProps = TextareaProps & {
  /** The sticker slapped on when invalid. Defaults to "Oops!"; false for none. */
  sfx?: ReactNode | false;
  /** A speech-bubble tail off the bottom left. */
  tail?: boolean;
};

/**
 * A comic-book textarea: a speech bubble to write in, with a thick ink frame,
 * uneven corners, halftone dots, a tail, and a hard shadow that lifts on
 * focus. When invalid it tints pink and an "Oops!" sticker slams on.
 */
export function ComicTextarea({
  invalid,
  sfx = "Oops!",
  tail = true,
  frameClassName,
  className,
  rows = 4,
  ...props
}: ComicTextareaProps) {
  return (
    <div className={cn("relative", tail && "pb-4")}>
      <div className={comicFrame({ invalid, className: frameClassName })} style={halftone(10)}>
        <textarea
          rows={rows}
          aria-invalid={invalid || undefined}
          className={cn(
            "w-full min-w-0 resize-y bg-transparent px-3.5 py-3 leading-relaxed font-medium placeholder:font-normal placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        {invalid && sfx && (
          <span aria-hidden className={stampClass}>
            {sfx}
          </span>
        )}
      </div>
      {/* The tail: an ink triangle with the fill on top, poking out of the bottom border. */}
      {tail && (
        <>
          <span aria-hidden className="absolute bottom-[1px] left-7 block size-0 border-t-[18px] border-r-[18px] border-t-ink border-r-transparent" />
          <span
            aria-hidden
            className={cn(
              "absolute bottom-[7px] left-[31.5px] block size-0 border-t-[11px] border-r-[11px] border-r-transparent",
              invalid ? "border-t-pink-soft" : "border-t-paper-raised",
            )}
          />
        </>
      )}
    </div>
  );
}
