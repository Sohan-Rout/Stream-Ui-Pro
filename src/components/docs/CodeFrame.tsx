"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@streamuilib/react";

const COLLAPSE_AT = 18;

export type CodeFrameProps = {
  /** Pre-highlighted HTML from the server. */
  html: string;
  /** Raw source, for the copy button and line count. */
  code: string;
  filename?: string;
  /** Draw its own border and shadow. Off when attached under a preview. */
  framed?: boolean;
  collapsible?: boolean;
};

export function CodeFrame({ html, code, filename, framed = true, collapsible = false }: CodeFrameProps) {
  const lineCount = code.split("\n").length;
  const canCollapse = collapsible && lineCount > COLLAPSE_AT;
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard blocked; the code is still selectable.
    }
  }

  return (
    <div className={cn("bg-paper-raised", framed && "border-2 border-ink shadow-brutal")}>
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-paper px-4 py-2">
        <span className="truncate font-mono text-xs font-bold">{filename ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="grid size-8 shrink-0 cursor-pointer place-items-center border-2 border-ink bg-paper-raised transition-colors duration-150 hover:bg-lime"
        >
          {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Code copied" : ""}
        </span>
      </div>

      <div className="relative">
        <div
          className={cn("code-frame", canCollapse && !expanded && "max-h-96 overflow-hidden")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {canCollapse && !expanded && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-paper-raised to-transparent"
          />
        )}
      </div>

      {canCollapse && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 border-t-2 border-ink bg-paper py-2.5 font-mono text-xs font-bold transition-colors duration-150 hover:bg-lime-soft"
        >
          {expanded ? "Collapse" : `Show all ${lineCount} lines`}
          <ChevronDown
            aria-hidden
            className={cn("size-4 transition-transform duration-150", expanded && "rotate-180")}
          />
        </button>
      )}
    </div>
  );
}
