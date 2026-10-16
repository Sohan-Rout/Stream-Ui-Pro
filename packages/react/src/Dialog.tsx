"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "./cn";

export type DialogProps = {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons along the bottom, e.g. Cancel / Confirm. */
  footer?: ReactNode;
  /** An element that opens the dialog when clicked (uncontrolled use). */
  trigger?: ReactElement<{ onClick?: (e: MouseEvent) => void }>;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Close when the backdrop is clicked. */
  dismissible?: boolean;
  className?: string;
};

/**
 * A modal built on native <dialog>.showModal(): focus moves in and is
 * trapped, Esc closes, focus returns to the trigger, and the rest of the
 * page is inert, all from the browser.
 */
export function Dialog({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  dismissible = true,
  className,
}: DialogProps) {
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
        // Esc (cancel) and form[method=dialog] both end in "close".
        onClose={() => isOpen && setOpen(false)}
        onClick={(e) => {
          // A click on the <dialog> itself, not its panel, is the backdrop.
          if (dismissible && e.target === e.currentTarget) setOpen(false);
        }}
        className={cn(
          // The <dialog> is a transparent full-screen layer; the panel sits inside it,
          // so a click on the padding around the panel is a backdrop click.
          "fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none place-items-center bg-transparent p-4 open:grid",
          "backdrop:bg-ink/40",
          "transition-[opacity,display,overlay] transition-discrete duration-200 ease-out starting:open:opacity-0 motion-reduce:transition-none",
        )}
      >
        <div
          className={cn(
            "flex w-full max-w-lg flex-col border-2 border-ink bg-paper-raised text-ink shadow-brutal-lg",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b-2 border-ink p-5">
            <div className="flex flex-col gap-1.5">
              <h2 id={titleId} className="text-lg leading-tight font-bold tracking-tight">
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
              className="grid size-9 shrink-0 cursor-pointer place-items-center border-2 border-ink bg-paper-raised transition-colors duration-150 hover:bg-pink"
            >
              <X aria-hidden className="size-4.5" strokeWidth={2.5} />
            </button>
          </div>
          {children && <div className="p-5 leading-relaxed">{children}</div>}
          {footer && (
            <div className="flex flex-wrap justify-end gap-3 border-t-2 border-ink bg-paper p-5">{footer}</div>
          )}
        </div>
      </dialog>
    </>
  );
}
