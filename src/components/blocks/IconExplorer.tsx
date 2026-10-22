"use client";

import { useEffect, useState } from "react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight, Bell, Bug, Camera, Cloud, Code, Cpu, Dices, Flame, Ghost, Globe, Heart, Layers,
  Lock, Magnet, Mail, Moon, Music, Palette, Puzzle, Rocket, Settings, Sparkles, Star, Zap,
} from "lucide-react";
import { AnimatedIcon, cn, iconAnimations, type IconAnimation } from "@streamuilib/react";
import { BrandGlyph } from "@/components/icons/BrandGlyph";

const icons: [string, LucideIcon][] = Object.entries({
  Rocket, Sparkles, Zap, Flame, Heart, Star, Bell, Mail, Camera, Music, Ghost, Bug,
  Puzzle, Dices, Magnet, Palette, Cloud, Moon, Lock, Settings, Code, Cpu, Layers, Globe,
});

/** [file slug, component name] for logos people recognize at a glance. */
const brands: [string, string][] = [
  ["github", "SiGithub"], ["figma", "SiFigma"], ["react", "SiReact"], ["nextdotjs", "SiNextdotjs"],
  ["vercel", "SiVercel"], ["tailwindcss", "SiTailwindcss"], ["typescript", "SiTypescript"], ["javascript", "SiJavascript"],
  ["spotify", "SiSpotify"], ["discord", "SiDiscord"], ["notion", "SiNotion"], ["stripe", "SiStripe"],
  ["apple", "SiApple"], ["google", "SiGoogle"], ["youtube", "SiYoutube"], ["x", "SiX"],
  ["linear", "SiLinear"], ["framer", "SiFramer"], ["supabase", "SiSupabase"], ["docker", "SiDocker"],
  ["npm", "SiNpm"], ["bun", "SiBun"], ["shadcnui", "SiShadcnui"], ["anthropic", "SiAnthropic"],
];

const ANIMATIONS = ["none", ...iconAnimations] as const;
type Choice = (typeof ANIMATIONS)[number];

/**
 * The landing page's icon section body: line icons with a live animation
 * picker, and a panel of brand logos. Click anything to copy its JSX.
 */
export function IconExplorer() {
  const [animation, setAnimation] = useState<Choice>("bounce");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy(jsx: string) {
    try {
      await navigator.clipboard.writeText(jsx);
      setCopied(jsx);
    } catch {
      // Clipboard blocked; nothing useful to do.
    }
  }

  const iconJsx = (name: string) =>
    animation === "none" ? `<${name} />` : `<AnimatedIcon animation="${animation}" trigger="loop"><${name} /></AnimatedIcon>`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-0.5 bg-ink lg:grid-cols-5">
        {/* Line icons, animated with whatever the picker says. */}
        <div className="flex flex-col bg-paper lg:col-span-3">
          <div className="flex flex-col gap-4 border-b-2 border-ink px-5 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-3 font-display text-xl tracking-tight">
                Line icons
                <span className="border-2 border-ink bg-lime px-1.5 font-mono text-xs font-bold text-on-bright">2,000+</span>
              </h3>
              <p className="font-mono text-xs text-ink-muted">24px grid · 1.75 stroke</p>
            </div>
            <div role="group" aria-label="Animation" className="flex flex-wrap border-2 border-ink">
              {ANIMATIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={animation === a}
                  onClick={() => setAnimation(a)}
                  className={cn(
                    "min-w-14 flex-1 cursor-pointer px-2 py-1.5 font-mono text-xs font-bold transition-colors duration-150 not-first:border-l-2 not-first:border-ink",
                    animation === a ? "bg-ink text-paper" : "bg-paper-raised hover:bg-lime-soft",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <ul className="-m-px grid flex-1 auto-rows-fr grid-cols-4 sm:grid-cols-6">
            {icons.map(([name, Icon]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => copy(iconJsx(name))}
                  aria-label={`Copy ${name} icon`}
                  className="group relative flex aspect-square size-full cursor-pointer items-center justify-center bg-paper outline-2 lg:aspect-auto lg:min-h-24 -outline-offset-1 outline-ink transition-colors duration-150 hover:bg-lime hover:text-on-bright focus-visible:z-10 focus-visible:bg-lime focus-visible:text-on-bright focus-visible:outline-4 focus-visible:-outline-offset-2 focus-visible:outline-blue"
                >
                  {animation === "none" ? (
                    <Icon aria-hidden className="size-7" strokeWidth={1.75} />
                  ) : (
                    <AnimatedIcon key={animation} animation={animation as IconAnimation} trigger="loop">
                      <Icon aria-hidden className="size-7" strokeWidth={1.75} />
                    </AnimatedIcon>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand logos. */}
        <div className="flex flex-col bg-pink-soft lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-5 py-4 sm:px-8">
            <h3 className="flex items-center gap-3 font-display text-xl tracking-tight">
              Brand logos
              <span className="border-2 border-ink bg-pink px-1.5 font-mono text-xs font-bold text-on-bright">3,400+</span>
            </h3>
            <Link
              href="/icons?catalog=brands"
              className="inline-flex items-center gap-1.5 font-mono text-xs font-bold underline decoration-2 underline-offset-4 hover:text-ink-muted"
            >
              Brand catalog <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
          <ul className="grid flex-1 grid-cols-4 gap-3 p-5 sm:grid-cols-6 sm:p-8 lg:grid-cols-4">
            {brands.map(([slug, name]) => (
              <li key={slug}>
                <button
                  type="button"
                  onClick={() => copy(`<${name} />`)}
                  aria-label={`Copy ${name}`}
                  title={name}
                  className="grid aspect-square w-full cursor-pointer place-items-center border-2 border-ink bg-paper-raised shadow-brutal-sm transition-[translate,box-shadow,background-color] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-pink hover:shadow-brutal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue motion-reduce:transition-none"
                >
                  <BrandGlyph slug={slug} size={24} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* What you get, and what you just copied. */}
      <div className="grid grid-cols-2 gap-0.5 border-t-2 border-ink bg-ink sm:grid-cols-4">
        {[
          ["2,000+", "line icons"],
          ["3,400+", "brand logos"],
          ["7", "animations"],
          ["JSX or SVG", "click to copy"],
        ].map(([big, small]) => (
          <p key={small} className="flex flex-col gap-0.5 bg-paper px-5 py-4 sm:px-8">
            <span className="font-display text-xl tracking-tight">{big}</span>
            <span className="font-mono text-xs text-ink-muted uppercase">{small}</span>
          </p>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        {copied ? `Copied ${copied}` : ""}
      </p>
      {copied && (
        <p
          aria-hidden
          className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border-2 border-ink bg-lime px-3 py-1.5 font-mono text-xs font-bold text-on-bright shadow-brutal"
        >
          copied {copied.length > 48 ? `${copied.slice(0, 45)}…` : copied}
        </p>
      )}
    </div>
  );
}
