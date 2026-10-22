import { IntentLink as Link } from "@/components/ui/IntentLink";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@streamuilib/react";

type Target = { label: string; href: string } | undefined;

const card =
  "group flex items-center gap-4 border-2 border-ink p-4 shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transition-none sm:p-5";
const tile =
  "grid size-10 shrink-0 place-items-center border-2 border-ink bg-paper-raised transition-transform duration-150 motion-reduce:transition-none";

/** Previous and next pages: soft pink back, solid lime forward (the main way on). */
export function PrevNext({ prev, next }: { prev: Target; next: Target }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Pagination" className="grid grid-cols-1 gap-4 border-t-2 border-ink pt-10 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className={cn(card, "bg-pink-soft text-ink")}>
          <span aria-hidden className={cn(tile, "group-hover:-translate-x-0.5")}>
            <ArrowLeft className="size-4.5" />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">Previous</span>
            <span className="truncate font-display text-xl tracking-tight">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span aria-hidden className="hidden sm:block" />
      )}
      {next && (
        <Link href={next.href} className={cn(card, "flex-row-reverse bg-lime text-right text-on-bright")}>
          <span aria-hidden className={cn(tile, "group-hover:translate-x-0.5")}>
            <ArrowRight className="size-4.5" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-mono text-xs font-bold tracking-widest uppercase opacity-70">Next</span>
            <span className="truncate font-display text-xl tracking-tight">{next.label}</span>
          </span>
        </Link>
      )}
    </nav>
  );
}
