"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";
import { Ghost, Search } from "lucide-react";
import { AnimatedIcon, Button, cn, iconAnimations, Input, type IconAnimation, type IconTrigger } from "@streamui/react";

const PAGE = 120;
const SIZES = [16, 20, 24, 32] as const;
const STROKES = [1.5, 1.75, 2, 2.5] as const;
const ANIMATIONS = ["none", ...iconAnimations] as const;
const TRIGGERS = ["hover", "loop"] as const satisfies readonly IconTrigger[];

/** "arrow-up-right" → "ArrowUpRight", the name you import from lucide-react. */
export function toComponentName(name: string) {
  return name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
}

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-xs text-ink-muted uppercase">{label}</span>
      <div role="group" aria-label={label} className="flex flex-wrap border-2 border-ink">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "min-w-11 cursor-pointer px-2 py-1.5 font-mono text-xs font-bold transition-colors duration-150 not-first:border-l-2 not-first:border-ink",
              value === o ? "bg-lime text-on-bright" : "bg-paper-raised hover:bg-lime-soft",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IconBrowser() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [size, setSize] = useState<(typeof SIZES)[number]>(24);
  const [stroke, setStroke] = useState<(typeof STROKES)[number]>(1.75);
  const [animation, setAnimation] = useState<IconAnimation | "none">("none");
  const [trigger, setTrigger] = useState<(typeof TRIGGERS)[number]>("hover");
  const [limit, setLimit] = useState(PAGE);
  const [copied, setCopied] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase().replace(/\s+/g, "-");
    return q ? iconNames.filter((n) => n.includes(q)) : iconNames;
  }, [deferredQuery]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy(name: IconName) {
    const icon = `<${toComponentName(name)} />`;
    const triggerProp = trigger === "hover" ? "" : ` trigger="${trigger}"`;
    const jsx =
      animation === "none"
        ? icon
        : `<AnimatedIcon animation="${animation}"${triggerProp}>${icon}</AnimatedIcon>`;
    try {
      await navigator.clipboard.writeText(jsx);
      setCopied(jsx);
    } catch {
      // Clipboard blocked; nothing useful to do.
    }
  }

  const visible = matches.slice(0, limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-2 border-ink bg-paper-raised p-4 shadow-brutal sm:p-5">
        <label htmlFor="icon-search" className="sr-only">
          Search icons
        </label>
        <Input
          id="icon-search"
          type="search"
          icon={<Search />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE);
          }}
          placeholder={`Search ${iconNames.length.toLocaleString("en-US")} icons…`}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-5">
            <Segmented label="Size" options={SIZES} value={size} onChange={setSize} />
            <Segmented label="Stroke" options={STROKES} value={stroke} onChange={setStroke} />
          </div>
          <p aria-live="polite" className="font-mono text-xs text-ink-muted">
            {copied ? (
              <span className="bg-lime px-1.5 py-0.5 font-bold text-on-bright">copied {copied}</span>
            ) : (
              `${matches.length.toLocaleString("en-US")} icons`
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5 border-t-2 border-dashed border-ink-faint pt-4">
          <Segmented label="Animate" options={ANIMATIONS} value={animation} onChange={setAnimation} />
          {animation !== "none" && (
            <Segmented label="Play on" options={TRIGGERS} value={trigger} onChange={setTrigger} />
          )}
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-3 border-t-2 border-l-2 border-ink sm:grid-cols-4 lg:grid-cols-6">
          {visible.map((name) => (
            <li key={name} className="border-r-2 border-b-2 border-ink">
              <button
                type="button"
                onClick={() => copy(name)}
                title={toComponentName(name)}
                aria-label={`Copy ${toComponentName(name)}`}
                className="group flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 bg-paper p-2 transition-colors duration-150 hover:bg-lime hover:text-on-bright focus-visible:relative focus-visible:z-10"
              >
                {animation === "none" ? (
                  <DynamicIcon
                    name={name}
                    size={size}
                    strokeWidth={stroke}
                    aria-hidden
                    fallback={() => <span aria-hidden className="block size-5 bg-ink-faint" />}
                  />
                ) : (
                  <AnimatedIcon key={`${animation}-${trigger}`} animation={animation} trigger={trigger}>
                    <DynamicIcon
                      name={name}
                      size={size}
                      strokeWidth={stroke}
                      aria-hidden
                      fallback={() => <span aria-hidden className="block size-5 bg-ink-faint" />}
                    />
                  </AnimatedIcon>
                )}
                <span className="w-full truncate text-center font-mono text-[0.6875rem] text-ink-muted group-hover:text-on-bright">
                  {name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 border-2 border-ink bg-paper-raised px-5 py-16 text-center">
          <Ghost aria-hidden className="size-10 text-ink-muted" />
          <p className="font-bold">No icons match “{query}”.</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="cursor-pointer font-mono text-sm underline decoration-2 underline-offset-4"
          >
            clear search
          </button>
        </div>
      )}

      {matches.length > limit && (
        <Button variant="secondary" className="self-center" onClick={() => setLimit((l) => l + PAGE)}>
          Show more ({(matches.length - limit).toLocaleString("en-US")} left)
        </Button>
      )}
    </div>
  );
}
