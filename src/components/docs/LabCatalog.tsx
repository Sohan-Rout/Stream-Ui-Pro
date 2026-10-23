"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ArrowRight, Check, Gamepad2, Heart, Joystick, PawPrint, Radio, Smile, SlidersHorizontal, Trophy, Wand2 } from "lucide-react";
import { cn } from "@streamuilib/react";
import { InfiniteGrid } from "./InfiniteGrid";

export type LabGroup = {
  id: "component" | "game" | "critter";
  /** The URL fragment that opens this card, like /labs#games. */
  hash: string;
  name: string;
  description: string;
  /** The lab cards, each an <li>, rendered on the server. */
  cards: ReactNode[];
};

/** Each catalog card's color and the little icon trio across its top. */
const LOOK = {
  component: { tone: "bg-lime", icons: [SlidersHorizontal, Wand2, Radio] },
  game: { tone: "bg-pink", icons: [Gamepad2, Joystick, Trophy] },
  critter: { tone: "bg-orange", icons: [PawPrint, Smile, Heart] },
};

// The open card lives in the URL fragment, so it's shareable and survives Back.
const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
const readHash = () => window.location.hash.slice(1);

/**
 * The Labs catalog: three cards (Components, Mini games, Critter Club) that
 * each open their own grid, like the Icons page's catalogs. Only the open
 * card's labs mount, so the others' code never loads until you pick them.
 */
export function LabCatalog({ groups }: { groups: LabGroup[] }) {
  const hash = useSyncExternalStore(subscribe, readHash, () => "");
  const open = groups.find((g) => g.hash === hash) ?? groups[0];

  const choose = (g: LabGroup) => {
    // replaceState doesn't fire hashchange, so announce it for the store.
    history.replaceState(null, "", `#${g.hash}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };

  return (
    <div className="flex flex-col gap-10">
      <div role="group" aria-label="Lab categories" className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {groups.map((g) => {
          const look = LOOK[g.id];
          const isOpen = g === open;
          return (
            <button
              key={g.id}
              type="button"
              aria-pressed={isOpen}
              aria-controls="lab-grid"
              onClick={() => choose(g)}
              className={cn(
                "group flex cursor-pointer flex-col gap-5 border-2 border-ink p-5 text-left transition-[translate,box-shadow,background-color] duration-150 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none sm:p-6",
                isOpen
                  ? `${look.tone} -translate-x-0.5 -translate-y-0.5 text-on-bright shadow-brutal-lg`
                  : "bg-paper-raised shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg",
              )}
            >
              <span aria-hidden className="flex gap-2">
                {look.icons.map((Icon, i) => (
                  <span
                    key={i}
                    className={cn("grid size-11 place-items-center border-2 border-ink bg-paper-raised text-ink shadow-brutal-sm transition-transform duration-150 motion-reduce:transition-none", i % 2 ? "rotate-3" : "-rotate-3", "group-hover:rotate-0")}
                  >
                    <Icon className="size-5" strokeWidth={2.25} />
                  </span>
                ))}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-2xl tracking-tight">{g.name}</span>
                  <span className="border-2 border-ink bg-paper-raised px-1.5 font-mono text-xs font-bold text-ink">{g.cards.length}</span>
                </span>
                <span className={cn("text-sm leading-relaxed", isOpen ? "" : "text-ink-muted")}>{g.description}</span>
              </span>
              <span
                className={cn(
                  "mt-auto inline-flex items-center gap-1.5 self-start border-2 border-ink px-2.5 py-1 font-mono text-xs font-bold uppercase shadow-brutal-sm",
                  isOpen ? "bg-ink text-paper" : "bg-lime text-on-bright",
                )}
              >
                {isOpen ? (
                  <>
                    <Check aria-hidden className="size-3.5" strokeWidth={3} /> Browsing
                  </>
                ) : (
                  <>
                    Open <ArrowRight aria-hidden className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <section id="lab-grid" aria-label={open.name} className="flex flex-col gap-6">
        {/* Keyed by category, so switching starts the new grid from its first batch. */}
        <InfiniteGrid key={open.id} batch={6} noun={open.name.toLowerCase()} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {open.cards}
        </InfiniteGrid>
      </section>
    </div>
  );
}
