"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "./cn";
import { halftone, sketchy } from "./comic";
import type { TabsProps } from "./Tabs";

export type ComicTabsProps = TabsProps;

/** Each tab's hand-placed tilt, repeating. */
const TILTS = [-2, 1.5, -1, 2];

/**
 * Comic-book tabs: tilted caption-box tabs over a comic panel. The active tab
 * turns lime and stands up straight, and its panel pops in. Same WAI-ARIA
 * behavior as Tabs: arrow keys move and select, Home/End jump to the ends,
 * and only the active tab is in the tab order. Motion stops for reduced motion.
 */
export function ComicTabs({ items, label, defaultIndex = 0, className }: ComicTabsProps) {
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
    <div className={cn("text-ink", className)}>
      <div role="tablist" aria-label={label} className="relative z-10 flex flex-wrap gap-2 pl-2" onKeyDown={onKeyDown}>
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
                "sui-comic-tab -mb-2 cursor-pointer border-[3px] border-ink px-3.5 py-1.5 font-mono text-xs font-bold tracking-wide uppercase",
                "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
                selected
                  ? "bg-lime text-on-bright shadow-[3px_3px_0_var(--ink)]"
                  : "bg-paper-sunken text-ink-muted hover:bg-pink-soft hover:text-ink",
              )}
              style={{ rotate: selected ? "0deg" : `${TILTS[i % TILTS.length]}deg`, translate: selected ? "0 -4px" : undefined }}
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
          className={cn(
            "sui-comic-tabs-panel border-[3px] border-ink bg-paper-raised p-5 pt-6 shadow-[5px_5px_0_var(--ink)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue",
            sketchy,
          )}
          style={halftone(9)}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
