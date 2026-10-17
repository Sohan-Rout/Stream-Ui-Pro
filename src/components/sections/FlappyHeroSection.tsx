import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/** Horizontal distance between pipe pairs, in px. */
const SPACING = 220;
/** Height of the ground strip, in px. */
const GROUND = 64;

/** Where each pair's gap opens, as [top of gap, bottom of gap] in % of the sky's height. */
const GAPS: [number, number][] = [
  [18, 52],
  [34, 68],
  [26, 60],
  [44, 78],
  [14, 48],
  [38, 72],
  [22, 56],
  [30, 64],
];
const TRACK = GAPS.length * SPACING;

function Pipe({ from, height }: { from: "top" | "bottom"; height: string }) {
  // The cap faces the gap: at the bottom of a top pipe, the top of a bottom pipe.
  const cap = <span className="relative -mx-1.5 block h-6 shrink-0 border-4 border-ink bg-pink" />;
  return (
    <div className={`absolute inset-x-0 flex flex-col ${from === "top" ? "top-0" : "bottom-0"}`} style={{ height }}>
      {from === "bottom" && cap}
      <span className={`block flex-1 border-x-4 border-ink bg-pink ${from === "top" ? "-mb-1" : "-mt-1"}`}>
        <span className="ml-2 block h-full w-2 bg-pink-soft" />
      </span>
      {from === "top" && cap}
    </div>
  );
}

function PipePairs() {
  return (
    <>
      {GAPS.map(([top, bottom], i) => (
        <div key={i} className="absolute inset-y-0 w-14" style={{ left: i * SPACING + 120 }}>
          <Pipe from="top" height={`${top}%`} />
          <Pipe from="bottom" height={`${100 - bottom}%`} />
        </div>
      ))}
    </>
  );
}

/**
 * Flappy hero: a sky where pink pipe pairs scroll past endlessly and an
 * orange bird bobs in place, flapping, behind a centered headline card.
 * All motion is decorative and holds still for reduced motion. No
 * JavaScript: a server component.
 */
export function FlappyHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  return (
    <section className="@container relative overflow-hidden bg-blue-soft">
      <style href="flappy-hero" precedence="default">{`
        @keyframes flappy-hero-scroll { to { transform: translateX(-${TRACK}px); } }
        @keyframes flappy-hero-ground { to { background-position: -32px 0; } }
        @keyframes flappy-hero-bob { 0%, 100% { transform: translateY(-14px) rotate(-8deg); } 50% { transform: translateY(14px) rotate(6deg); } }
        @keyframes flappy-hero-wing { 50% { transform: translateY(-6px) scaleY(0.6); } }
        .flappy-hero-track { animation: flappy-hero-scroll ${TRACK / 80}s linear infinite; }
        .flappy-hero-ground { animation: flappy-hero-ground 0.4s linear infinite; }
        .flappy-hero-bird { animation: flappy-hero-bob 1.4s ease-in-out infinite; }
        .flappy-hero-wing { animation: flappy-hero-wing 0.18s steps(2, end) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .flappy-hero-track, .flappy-hero-ground, .flappy-hero-bird, .flappy-hero-wing { animation: none; }
        }
      `}</style>

      {/* Sky: sun, then two copies of the pipe track so the loop is seamless. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ bottom: GROUND }}>
        <span className="absolute top-8 right-10 block size-16 rounded-full border-4 border-ink bg-orange" />
        <div className="flappy-hero-track absolute inset-y-0 left-0 flex" style={{ width: TRACK * 2 }}>
          <div className="relative h-full" style={{ width: TRACK }}>
            <PipePairs />
          </div>
          <div className="relative h-full" style={{ width: TRACK }}>
            <PipePairs />
          </div>
        </div>

      </div>

      {/* Ground, with hatching that scrolls with the pipes. */}
      <div
        aria-hidden
        className="flappy-hero-ground absolute inset-x-0 bottom-0 border-t-4 border-ink bg-lime"
        style={{
          height: GROUND,
          backgroundImage: "repeating-linear-gradient(-45deg, oklch(0 0 0 / 0.16) 0 3px, transparent 3px 16px)",
          backgroundSize: "32px 100%",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 pt-24 text-center @3xl:pt-28" style={{ paddingBottom: GROUND + 72 }}>
        <div className="relative flex flex-col items-center border-4 border-ink bg-paper-raised px-6 py-8 shadow-brutal-lg @3xl:px-12 @3xl:py-10">
          {/* The bird, bobbing just above the card: square body, beak, eye, and a flapping wing. */}
          <div aria-hidden className="flappy-hero-bird pointer-events-none absolute -top-16 left-6 z-10 @3xl:left-10">
            <div className="relative size-12">
              <span
                className="absolute top-4 -right-3 block size-0 border-y-8 border-l-14 border-y-transparent border-l-pink"
                style={{ filter: "drop-shadow(2px 0 0 var(--ink)) drop-shadow(-0.5px 0 0 var(--ink))" }}
              />
              <span className="absolute inset-0 block rounded-md border-4 border-ink bg-orange shadow-brutal-sm" />
              <span className="absolute top-2 right-2 grid size-4 place-items-center rounded-full border-2 border-ink bg-paper-raised">
                <span className="block size-1.5 rounded-full bg-ink" />
              </span>
              <span className="flappy-hero-wing absolute top-6 left-1 block h-3 w-5 rounded-sm border-2 border-ink bg-violet" />
            </div>
          </div>

          <p className="border-2 border-ink bg-orange px-3 py-1 font-mono text-xs font-bold tracking-widest text-on-bright uppercase">
            Best 128 · Tap to fly
          </p>
          <Heading
            className="mt-6 font-display text-4xl leading-none tracking-tight text-balance @3xl:text-6xl"
            style={{ textShadow: "4px 4px 0 var(--pink)" } as CSSProperties}
          >
            Launch day, no crash landings.
          </Heading>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
            Acme keeps your landing page light and fast, so it clears every pipe between you and your
            first customer.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#"
              className="inline-flex h-13 items-center gap-2 border-2 border-ink bg-lime px-6 font-bold text-on-bright shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              Start flying <ArrowRight aria-hidden className="size-4" />
            </a>
            <a
              href="#"
              className="inline-flex h-13 items-center border-2 border-ink bg-paper-raised px-6 font-bold shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              See the code
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
