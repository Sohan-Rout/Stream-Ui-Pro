"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "preview", label: "Preview", body: "What your users see. Loud, legible, and fast." },
  { id: "code", label: "Code", body: "Plain TSX in your repo. Rename it, fork it, break it." },
  { id: "props", label: "Props", body: "variant · size · className · and every native prop." },
] as const;

export function TabsDemo() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  function onKeyDown(e: KeyboardEvent) {
    const last = tabs.length - 1;
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
    <div className="w-full max-w-sm">
      <div role="tablist" aria-label="Component view" className="flex" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => {
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
                  : "bg-paper-sunken text-ink-muted hover:bg-yellow hover:text-on-bright",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${baseId}-panel-${t.id}`}
          aria-labelledby={`${baseId}-tab-${t.id}`}
          hidden={i !== active}
          className="border-2 border-ink bg-paper-raised p-5 shadow-brutal"
        >
          <p className="leading-relaxed">{t.body}</p>
        </div>
      ))}
    </div>
  );
}
