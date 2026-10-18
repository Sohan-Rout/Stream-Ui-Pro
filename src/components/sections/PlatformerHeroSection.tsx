"use client";

import { useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/** Pixel size of one tile: blocks, bricks, pipes, and clouds share it. */
const TILE = 32;

/** The mascot, one character per pixel: K ink, L lime, P pink, W white, . empty. */
const SPRITE = [
  "..KKKKKK..",
  ".KLLLLLLK.",
  ".KLWKLWKK.",
  ".KLLLLLLK.",
  ".KLPPPPLK.",
  ".KLLLLLLK.",
  "..KKKKKK..",
  "..KL..LK..",
  ".KPPK.KPPK",
];
const SPRITE_FILL: Record<string, string> = { K: "bg-ink", L: "bg-lime", P: "bg-pink", W: "bg-paper-raised" };

/** The row of blocks above the headline: bricks, and bonus blocks that pay out a coin. */
const BLOCKS: ("brick" | "bonus")[] = ["brick", "bonus", "brick", "bonus", "brick"];

const CLOUDS = [
  { left: "6%", top: 64, width: 3 },
  { left: "72%", top: 40, width: 4 },
  { left: "84%", top: 112, width: 2 },
];

function Sprite() {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${SPRITE[0].length}, 4px)` }}>
      {SPRITE.flatMap((row, y) =>
        [...row].map((c, x) => <span key={`${x}-${y}`} className={`size-1 ${SPRITE_FILL[c] ?? ""}`} />),
      )}
    </div>
  );
}

function Pipe({ height, style }: { height: number; style: CSSProperties }) {
  return (
    <div aria-hidden className="absolute bottom-full flex flex-col items-center" style={style}>
      <span className="block border-4 border-ink bg-lime pixel-bevel" style={{ width: TILE * 2 + 8, height: TILE * 0.75 }} />
      <span className="-mt-1 block border-4 border-t-0 border-ink bg-lime pixel-bevel" style={{ width: TILE * 2 - 8, height }} />
    </div>
  );
}

/**
 * Retro platformer hero: a sky with clouds and pipes, a HUD, and a row of
 * blocks above the headline. Bonus blocks pop a coin and add to the
 * counters, once each, from a click or the keyboard. The mascot is an
 * original sprite; its bounce and the coin pops are decorative and hold
 * still for reduced motion.
 */
export function PlatformerHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  const [used, setUsed] = useState<number[]>([]);
  const coins = used.length;
  const score = coins * 200;

  return (
    <section className="@container relative overflow-hidden bg-blue-soft text-ink">
      <style href="platformer-hero" precedence="default">{`
        @keyframes platformer-hop { 0%, 60%, 100% { transform: translateY(0); } 75% { transform: translateY(-28px); } }
        @keyframes platformer-coin { from { transform: translateY(0); opacity: 1; } to { transform: translateY(-56px); opacity: 0; } }
        @keyframes platformer-bump { 50% { transform: translateY(-8px); } }
        .platformer-hop { animation: platformer-hop 1.6s steps(4, end) infinite; }
        .platformer-coin { animation: platformer-coin 0.6s steps(6, end) forwards; }
        .platformer-bump { animation: platformer-bump 0.2s steps(2, end); }
        @media (prefers-reduced-motion: reduce) {
          .platformer-hop, .platformer-bump { animation: none; }
          .platformer-coin { animation: none; opacity: 0; }
        }
      `}</style>

      {/* Clouds: rows of white tiles. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {CLOUDS.map((c, i) => (
          <div key={i} className="absolute flex" style={{ left: c.left, top: c.top }}>
            {Array.from({ length: c.width }, (_, j) => (
              <span key={j} className="-ml-0.5 block border-2 border-ink bg-paper-raised first:ml-0" style={{ width: TILE, height: TILE * 0.75 }} />
            ))}
          </div>
        ))}
      </div>

      {/* HUD */}
      <div className="relative flex flex-wrap justify-center gap-x-8 gap-y-1 border-b-2 border-ink bg-paper-raised px-4 py-2 font-mono text-xs font-bold tracking-widest uppercase @3xl:justify-between @3xl:px-8">
        <span>
          Score <span className="tabular-nums">{String(score).padStart(6, "0")}</span>
        </span>
        <span>
          Coins ×<span className="tabular-nums">{String(coins).padStart(2, "0")}</span>
        </span>
        <span>Level 1-1</span>
      </div>
      <p aria-live="polite" className="sr-only">
        {coins > 0 ? `${coins} ${coins === 1 ? "coin" : "coins"}, score ${score}.` : ""}
      </p>

      {/* Above the ground layer, with room at the bottom so the pipes clear the buttons. */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pt-12 pb-60 text-center @3xl:pt-16 @3xl:pb-64">
        {/* Blocks to bump */}
        <ul aria-label="Blocks" className="flex">
          {BLOCKS.map((kind, i) => {
            const spent = used.includes(i);
            if (kind === "brick") {
              return (
                <li key={i} aria-hidden>
                  <span className="relative -ml-0.5 block border-2 border-ink bg-orange pixel-bevel" style={{ width: TILE * 1.5, height: TILE * 1.5 }}>
                    <span className="absolute inset-x-0 top-1/2 border-t-2 border-ink" />
                    <span className="absolute top-0 left-1/2 h-1/2 border-l-2 border-ink" />
                    <span className="absolute bottom-0 left-1/4 h-1/2 border-l-2 border-ink" />
                  </span>
                </li>
              );
            }
            return (
              <li key={i} className="relative">
                <button
                  type="button"
                  disabled={spent}
                  aria-label={spent ? "Empty block" : "Bonus block: collect a coin"}
                  onClick={() => setUsed((u) => (u.includes(i) ? u : [...u, i]))}
                  className={`relative -ml-0.5 grid cursor-pointer place-items-center border-2 border-ink font-display text-2xl text-on-bright pixel-bevel focus-visible:z-10 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-default ${spent ? "platformer-bump bg-paper-sunken text-ink-muted" : "bg-lime hover:-translate-y-1"} transition-transform duration-150`}
                  style={{ width: TILE * 1.5, height: TILE * 1.5 }}
                >
                  {spent ? "" : "!"}
                </button>
                {spent && (
                  <span
                    aria-hidden
                    className="platformer-coin pointer-events-none absolute -top-2 left-1/2 -ml-3 block h-8 w-6 rounded-full border-4 border-ink bg-orange"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <Heading
          className="mt-10 font-display text-5xl leading-none tracking-tight text-balance uppercase @3xl:text-7xl"
          style={{ textShadow: "3px 3px 0 var(--paper-raised), 6px 6px 0 var(--ink)" } as CSSProperties}
        >
          Press start on your next launch
        </Heading>
        <p className="mt-6 max-w-lg border-2 border-ink bg-paper-raised px-5 py-3 font-mono text-sm leading-relaxed shadow-brutal-sm">
          Acme ships fast, hard-edged landing pages you can build in an afternoon. Bump a block to try it.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-13 items-center gap-2 border-2 border-ink bg-pink px-6 font-mono text-sm font-bold text-on-bright uppercase pixel-bevel shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Press start <ArrowRight aria-hidden className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-13 items-center border-2 border-ink bg-paper-raised px-6 font-mono text-sm font-bold uppercase shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            View the code
          </a>
        </div>
      </div>

      {/* Ground: grass over bricks, with pipes, a hill, and the mascot standing on it. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="relative h-24">
          <Pipe height={TILE * 1.5} style={{ left: "8%" }} />
          <Pipe height={TILE * 2.5} style={{ right: "10%" }} />
          <div className="absolute bottom-full flex flex-col items-center" style={{ left: "24%" }}>
            <span className="block h-6 w-16 rounded-t-full border-4 border-b-0 border-ink bg-lime-soft" />
            <span className="block h-6 w-28 border-4 border-b-0 border-ink bg-lime-soft" />
          </div>
          <div className="platformer-hop absolute bottom-full" style={{ left: "42%" }}>
            <Sprite />
          </div>
          <div className="h-4 border-y-4 border-ink bg-lime" />
          <div
            className="h-full bg-orange"
            style={{
              backgroundImage:
                "linear-gradient(var(--ink) 2px, transparent 2px), linear-gradient(90deg, var(--ink) 2px, transparent 2px)",
              backgroundSize: `${TILE}px ${TILE / 2}px`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
