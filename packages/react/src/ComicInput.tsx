import type { ReactNode } from "react";
import { cn } from "./cn";
import { comicFrame, halftone, stampClass } from "./comic";
import type { InputProps } from "./Input";

export type ComicInputProps = InputProps & {
  /** The sticker slapped on when invalid. Defaults to "Oops!"; false for none. */
  sfx?: ReactNode | false;
};

/**
 * A comic-book text input: a thick ink frame with uneven, hand-inked corners,
 * halftone dots, and a hard shadow that lifts on focus. When invalid it tints
 * pink and an "Oops!" sticker slams on. Same props as Input.
 */
export function ComicInput({ icon, invalid, sfx = "Oops!", frameClassName, className, ...props }: ComicInputProps) {
  return (
    <div className={comicFrame({ invalid, className: cn("items-center", frameClassName) })} style={halftone(10)}>
      {icon && (
        <span aria-hidden className="ml-3 shrink-0 text-ink [&_svg]:size-4.5">
          {icon}
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        className={cn(
          "h-11 w-full min-w-0 bg-transparent px-3 font-semibold placeholder:font-normal placeholder:text-ink-muted focus:outline-none disabled:cursor-not-allowed",
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
  );
}
