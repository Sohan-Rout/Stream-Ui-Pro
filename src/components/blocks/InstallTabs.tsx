"use client";

import { useState } from "react";
import { cn } from "@streamuilib/react";
import type { InstallOption } from "@/registry/shadcn";
import { InstallCommand } from "./InstallCommand";

/**
 * Install commands side by side: the npm package (with bun), and the shadcn
 * CLI copying source from this site's registry.
 */
export function InstallTabs({ options, className }: { options: InstallOption[]; className?: string }) {
  const [active, setActive] = useState(options[0].id);
  const current = options.find((o) => o.id === active) ?? options[0];

  return (
    <div className={cn("flex max-w-full flex-col items-start", className)}>
      <div role="group" aria-label="Install with" className="flex border-2 border-b-0 border-ink">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === current.id}
            onClick={() => setActive(o.id)}
            className={cn(
              "cursor-pointer px-3 py-1 font-mono text-xs font-bold transition-colors duration-150 not-first:border-l-2 not-first:border-ink",
              o.id === current.id ? "bg-lime text-on-bright" : "bg-paper-raised hover:bg-lime-soft",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <InstallCommand command={current.command} className="max-w-full" />
    </div>
  );
}
