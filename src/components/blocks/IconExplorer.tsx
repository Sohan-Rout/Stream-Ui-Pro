"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell, Bomb, Bug, Camera, Cloud, Code, Command, Cpu, Database, Dices, Flame,
  Gauge, Ghost, Globe, Heart, Layers, Lock, Magnet, Mail, Moon, Music, Palette,
  Puzzle, Rocket, Search, Settings, Sparkles, Star, Sun, Terminal, User, Zap,
} from "lucide-react";

const icons: [string, LucideIcon][] = Object.entries({
  Rocket, Sparkles, Zap, Flame, Heart, Star, Bell, Mail, Camera, Music, Ghost,
  Bomb, Bug, Puzzle, Dices, Magnet, Palette, Globe, Cloud, Sun, Moon, Lock,
  User, Settings, Search, Terminal, Code, Command, Cpu, Database, Layers, Gauge,
});

export function IconExplorer() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const q = query.trim().toLowerCase();
  const visible = q ? icons.filter(([name]) => name.toLowerCase().includes(q)) : icons;

  async function copy(name: string) {
    try {
      await navigator.clipboard.writeText(`<${name} />`);
      setCopied(name);
    } catch {
      // Clipboard blocked; nothing useful to do.
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b-2 border-ink p-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <label className="flex w-full items-center border-2 border-ink bg-paper-raised shadow-brutal-sm transition-shadow duration-150 focus-within:shadow-brutal sm:max-w-sm">
          <Search aria-hidden className="ml-3 size-4.5 shrink-0 text-ink-muted" />
          <span className="sr-only">Search icons</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons… try “moon”"
            className="h-11 w-full min-w-0 bg-transparent px-3 placeholder:text-ink-muted focus:outline-none"
          />
        </label>
        <p aria-live="polite" className="font-mono text-xs text-ink-muted">
          {copied ? (
            <span className="bg-lime px-1.5 py-0.5 font-semibold text-on-bright">
              copied &lt;{copied} /&gt;
            </span>
          ) : (
            `${visible.length} shown · click to copy`
          )}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul className="-m-px grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8">
          {visible.map(([name, Icon]) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => copy(name)}
                aria-label={`Copy ${name} icon`}
                className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 bg-paper outline-2 -outline-offset-1 outline-ink transition-colors duration-150 hover:bg-lime hover:text-on-bright focus-visible:z-10 focus-visible:bg-lime focus-visible:text-on-bright focus-visible:outline-4 focus-visible:-outline-offset-2 focus-visible:outline-blue"
              >
                <Icon
                  aria-hidden
                  className="size-7 transition-transform duration-150 group-hover:scale-110 motion-reduce:transition-none"
                  strokeWidth={1.75}
                />
                <span className="hidden font-mono text-xs text-ink-muted group-hover:text-on-bright sm:block">
                  {name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
          <Ghost aria-hidden className="size-10 text-ink-muted" />
          <p className="font-bold">Nothing matches “{query}”.</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="cursor-pointer font-mono text-sm underline decoration-2 underline-offset-4 hover:text-ink-muted"
          >
            clear search
          </button>
        </div>
      )}
    </div>
  );
}
