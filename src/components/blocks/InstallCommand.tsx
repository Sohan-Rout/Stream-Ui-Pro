"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";

export function InstallCommand({
  command,
  className,
}: {
  command: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure origin, permissions); the command
      // stays visible and selectable, so there is nothing else to do.
    }
  }

  return (
    <div
      className={cn(
        "flex max-w-full items-stretch border-2 border-ink bg-paper-raised font-mono text-sm text-ink shadow-brutal",
        className,
      )}
    >
      <code className="flex min-w-0 items-center gap-3 overflow-x-auto px-4 py-3 whitespace-nowrap [scrollbar-width:none]">
        <span aria-hidden className="text-ink-muted">
          $
        </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy install command"}
        className="grid w-12 shrink-0 cursor-pointer place-items-center border-l-2 border-ink transition-colors duration-150 hover:bg-yellow hover:text-on-bright"
      >
        {copied ? (
          <Check aria-hidden className="size-4.5" />
        ) : (
          <Copy aria-hidden className="size-4.5" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Install command copied" : ""}
      </span>
    </div>
  );
}
