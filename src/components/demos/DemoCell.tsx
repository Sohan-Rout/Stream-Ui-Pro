import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A spec-sheet cell: file label up top, the live specimen centered below. */
export function DemoCell({
  file,
  note,
  children,
  className,
}: {
  file: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-72 flex-col bg-paper", className)}>
      <div className="flex items-center justify-between gap-3 border-b-2 border-dashed border-ink-faint px-5 py-3 font-mono text-xs">
        <span className="font-semibold">{file}</span>
        {note && <span className="text-ink-muted">{note}</span>}
      </div>
      <div className="flex flex-1 items-center justify-center p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
