"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { id: string; label: ReactNode; content: ReactNode };

export type TabsProps = {
  items: TabItem[];
  /** Accessible name for the tab list. */
  label: string;
  defaultIndex?: number;
  className?: string;
};

/**
 * WAI-ARIA tabs with automatic activation: arrow keys move and select,
 * Home/End jump to the ends, and only the active tab is in the tab order.
 */
export function Tabs({ items, label, defaultIndex = 0, className }: TabsProps) {
  const [active, setActive] = useState(defaultIndex);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function onKeyDown(e: KeyboardEvent) {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex" onKeyDown={onKeyDown}>
        {items.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={cn(
                "-mr-0.5 cursor-pointer border-2 border-ink px-4 py-2 text-sm font-bold transition-colors duration-150",
                selected
                  ? "relative z-10 -mb-0.5 border-b-paper-raised bg-paper-raised"
                  : "bg-paper-sunken text-ink-muted hover:bg-lime hover:text-on-bright",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {items.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="border-2 border-ink bg-paper-raised p-5 shadow-brutal"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
