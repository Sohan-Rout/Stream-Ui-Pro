import { useId, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "./cn";

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode };

export type AccordionProps = {
  items: AccordionItem[];
  /** Only one item open at a time (native exclusive <details>). */
  exclusive?: boolean;
  /** Ids of items open on first render. */
  defaultOpen?: string[];
  className?: string;
};

/**
 * Built on native <details>/<summary>: keyboard support, screen reader
 * state, find-in-page, and no JavaScript needed. `exclusive` uses the
 * details `name` attribute, which closes siblings in the same group.
 */
export function Accordion({ items, exclusive = false, defaultOpen = [], className }: AccordionProps) {
  const group = useId();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <details
          key={item.id}
          name={exclusive ? group : undefined}
          open={defaultOpen.includes(item.id)}
          className="group border-2 border-ink bg-paper-raised text-ink shadow-brutal-sm open:bg-lime-soft"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-bold [&::-webkit-details-marker]:hidden">
            {item.title}
            <Plus
              aria-hidden
              className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              strokeWidth={2.5}
            />
          </summary>
          <div className="border-t-2 border-ink px-5 py-4 leading-relaxed">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
