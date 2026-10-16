"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "./cn";

export type TooltipProps = {
  /** The tooltip text. Keep it short; it's a hint, not content. */
  content: ReactNode;
  /** One focusable element, e.g. an icon button. */
  children: ReactElement;
  side?: "top" | "bottom";
  /** Delay before showing on hover, in ms. Focus shows immediately. */
  delay?: number;
  className?: string;
};

const sides = {
  top: "bottom-full mb-2.5",
  bottom: "top-full mt-2.5",
};

/**
 * Shows on hover and keyboard focus, hides on Esc, blur, or pointer leave
 * (WCAG 1.4.13). The trigger gets aria-describedby, so screen readers read
 * the hint after the trigger's own name.
 */
export function Tooltip({ content, children, side = "top", delay = 150, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => show(delay)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          hide();
        }
      }}
    >
      {isValidElement(children)
        ? cloneElement(children, { "aria-describedby": id } as Record<string, unknown>)
        : children}
      <span
        role="tooltip"
        id={id}
        hidden={!open}
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-60 -translate-x-1/2 border-2 border-ink bg-ink px-2.5 py-1.5 text-center font-mono text-xs leading-snug text-paper shadow-brutal-sm",
          sides[side],
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
