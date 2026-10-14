import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Target = { label: string; href: string } | undefined;

export function PrevNext({ prev, next }: { prev: Target; next: Target }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Pagination" className="grid grid-cols-1 gap-4 border-t-2 border-ink pt-10 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-1 border-2 border-ink bg-paper-raised p-4 shadow-brutal-sm transition-colors duration-150 hover:bg-lime-soft"
        >
          <span className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
            <ArrowLeft aria-hidden className="size-3.5" /> Previous
          </span>
          <span className="font-display text-lg tracking-tight">{prev.label}</span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next && (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 border-2 border-ink bg-paper-raised p-4 text-right shadow-brutal-sm transition-colors duration-150 hover:bg-lime-soft"
        >
          <span className="flex items-center gap-1.5 font-mono text-xs text-ink-muted">
            Next <ArrowRight aria-hidden className="size-3.5" />
          </span>
          <span className="font-display text-lg tracking-tight">{next.label}</span>
        </Link>
      )}
    </nav>
  );
}
