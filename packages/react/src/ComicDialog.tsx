"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "./cn";
import { halftone, sketchy } from "./comic";
import { ComicBadge } from "./ComicBadge";
import type { DialogProps } from "./Dialog";

export type ComicDialogProps = DialogProps & {
  /** A starburst sound effect stuck on the top-right corner ("PSST!"). */
  sfx?: ReactNode;
};

/**
 * A comic-book modal: a hand-inked panel that slams in over a halftone
 * backdrop, its title on a tilted caption box, a starburst close button, and
 * an optional sound effect. Built on native <dialog>.showModal(), like
 * Dialog: focus moves in and is trapped, Esc closes, focus returns to the
 * trigger, and the rest of the page is inert. Motion stops for reduced motion.
 */
export function ComicDialog({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  dismissible = true,
  sfx,
  className,
}: ComicDialogProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const setOpen = (next: boolean) => {
    setInternal(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <>
      {isValidElement(trigger) &&
        cloneElement(trigger, {
          "aria-haspopup": "dialog",
          "aria-expanded": isOpen,
          onClick: (e: MouseEvent) => {
            trigger.props.onClick?.(e);
            setOpen(true);
          },
        } as Record<string, unknown>)}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClose={() => isOpen && setOpen(false)}
        onClick={(e) => {
          if (dismissible && e.target === e.currentTarget) setOpen(false);
        }}
        className="sui-comic-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none place-items-center bg-transparent p-6 open:grid"
      >
        <div
          className={cn(
            "sui-comic-dialog-panel relative flex w-full max-w-lg flex-col border-[3px] border-ink bg-paper-raised text-ink shadow-[8px_8px_0_var(--ink)]",
            sketchy,
            className,
          )}
        >
          {sfx && (
            <span aria-hidden className="sui-comic-dialog-sfx absolute -top-9 -right-7 z-10">
              <ComicBadge shape="burst" tone="pink" size="sm" tilt={12}>
                {sfx}
              </ComicBadge>
            </span>
          )}
          <div className="flex items-start justify-between gap-4 border-b-[3px] border-ink px-5 pt-4 pb-4" style={halftone(10)}>
            <div className="flex flex-col items-start gap-2">
              <h2
                id={titleId}
                className="-mt-8 -ml-8 -rotate-2 border-[3px] border-ink bg-lime px-3 py-1 font-mono text-sm leading-tight font-bold tracking-wide uppercase text-on-bright shadow-[3px_3px_0_var(--ink)]"
              >
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="sui-comic-dialog-close relative grid size-10 shrink-0 cursor-pointer place-items-center focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              <svg aria-hidden viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full">
                <path d="M50 3C77 2 97 20 96 47C95 74 76 97 49 96C22 95 3 77 4 50C5 23 23 4 50 3Z" className="fill-paper-raised stroke-ink" strokeWidth={8} />
              </svg>
              <X aria-hidden className="relative size-4.5" strokeWidth={3} />
            </button>
          </div>
          {children && <div className="p-5 leading-relaxed">{children}</div>}
          {footer && (
            <div className={cn("flex flex-wrap justify-end gap-3 border-t-[3px] border-dashed border-ink p-5", !children && "border-t-0")}>
              {footer}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
