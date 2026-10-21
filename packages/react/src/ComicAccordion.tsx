import { useId } from "react";
import { Plus } from "lucide-react";
import { cn } from "./cn";
import { halftone, sketchy } from "./comic";
import { SHAPES } from "./ComicBadge";
import type { AccordionProps } from "./Accordion";

export type ComicAccordionProps = AccordionProps;

/** Each item's hand-placed tilt, repeating. */
const TILTS = [-0.6, 0.5, -0.3, 0.7];

/**
 * A comic-book accordion: hand-inked panels with shouty titles and a
 * starburst toggle that spins as it opens; the answer pops in on halftone
 * dots. Built on native <details>/<summary>, like Accordion: keyboard
 * support, screen reader state, find-in-page, and no JavaScript needed.
 */
export function ComicAccordion({ items, exclusive = false, defaultOpen = [], className }: ComicAccordionProps) {
  const group = useId();

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item, i) => (
        <details
          key={item.id}
          name={exclusive ? group : undefined}
          open={defaultOpen.includes(item.id)}
          className={cn(
            "sui-comic-acc group border-[3px] border-ink bg-paper-raised text-ink shadow-[4px_4px_0_var(--ink)] open:bg-lime-soft",
            sketchy,
          )}
          style={{ rotate: `${TILTS[i % TILTS.length]}deg` }}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 font-bold [&::-webkit-details-marker]:hidden">
            {item.title}
            <span aria-hidden className="sui-comic-acc-burst relative grid size-10 shrink-0 place-items-center">
              <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full">
                <path d={SHAPES.burst.d} className="fill-paper-raised stroke-ink group-open:fill-pink" strokeWidth={6} strokeLinejoin="round" />
              </svg>
              <Plus className="relative size-4" strokeWidth={3} />
            </span>
          </summary>
          <div className="sui-comic-acc-body border-t-[3px] border-dashed border-ink px-5 py-4 leading-relaxed" style={halftone(10)}>
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
