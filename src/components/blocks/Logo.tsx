import { cn } from "@/lib/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid size-8 place-items-center border-2 border-ink bg-yellow font-mono text-sm font-black text-on-bright shadow-brutal-sm"
      >
        S/
      </span>
      <span className="text-lg font-black tracking-tight">
        stream<span className="text-ink-muted">/</span>ui
      </span>
    </span>
  );
}
