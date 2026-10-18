import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/** Grid cell size in px: the background grid, the falling pieces, and the floor share it. */
const CELL = 24;

const TONES = ["bg-lime", "bg-pink", "bg-blue", "bg-violet", "bg-orange"];

/** The headline, one tile per letter; each line wraps between words, never inside one. */
const LINES = [["Block", "by"], ["block."]];

type Faller = { shape: [number, number][]; tone: string; left: string; duration: number; delay: number; rest: string };

const I: [number, number][] = [[0, 0], [0, 1], [0, 2], [0, 3]];
const O: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
const T: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];
const S: [number, number][] = [[1, 0], [2, 0], [0, 1], [1, 1]];
const Z: [number, number][] = [[0, 0], [1, 0], [1, 1], [2, 1]];
const L: [number, number][] = [[0, 0], [0, 1], [0, 2], [1, 2]];

const fallers: Faller[] = [
  { shape: S, tone: "bg-lime", left: "5%", duration: 10, delay: -3, rest: "14%" },
  { shape: I, tone: "bg-blue", left: "15%", duration: 13, delay: -9, rest: "48%" },
  { shape: Z, tone: "bg-pink", left: "27%", duration: 11, delay: -1, rest: "6%" },
  { shape: O, tone: "bg-orange", left: "68%", duration: 9, delay: -5, rest: "26%" },
  { shape: T, tone: "bg-violet", left: "79%", duration: 12, delay: -7, rest: "58%" },
  { shape: L, tone: "bg-blue", left: "91%", duration: 10.5, delay: -2, rest: "10%" },
];

/** Column heights of the locked stack along the bottom, repeated across the width. */
const floor = [1, 2, 3, 2, 1, 2, 4, 2, 1, 3, 2, 2, 1, 0, 2, 3];

function Block({ tone, style }: { tone: string; style?: CSSProperties }) {
  return <span className={`absolute border-2 border-ink pixel-bevel ${tone}`} style={{ width: CELL, height: CELL, ...style }} />;
}

/**
 * Falling-blocks hero: a centered headline built from letter tiles that
 * drop into place one by one, over a pixel grid where tetrominoes fall onto
 * a locked stack. All motion is decorative and holds still for reduced
 * motion. No JavaScript: a server component.
 */
export function BlocksHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  let n = 0; // letter index across the whole headline, for colors and the drop order

  return (
    <section
      className="@container relative overflow-hidden bg-paper-sunken bg-pixel-grid text-ink"
      style={{ backgroundSize: `${CELL}px ${CELL}px` }}
    >
      {/* Pieces and letters move in whole steps, like a game tick; still for reduced motion. */}
      <style href="blocks-hero" precedence="default">{`
        @keyframes blocks-hero-fall { from { top: -${CELL * 4}px; } to { top: 100%; } }
        @keyframes blocks-hero-drop { from { transform: translateY(-480%); } to { transform: translateY(0); } }
        .blocks-hero-faller { animation: blocks-hero-fall var(--fall) steps(28, end) var(--delay) infinite; }
        .blocks-hero-tile { animation: blocks-hero-drop 0.5s steps(6, end) calc(var(--i) * 70ms) both; }
        @media (prefers-reduced-motion: reduce) {
          .blocks-hero-faller { animation: none; top: var(--rest); }
          .blocks-hero-tile { animation: none; }
        }
      `}</style>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {fallers.map((f, i) => (
          <div
            key={i}
            className="blocks-hero-faller absolute opacity-80"
            style={{ left: f.left, "--fall": `${f.duration}s`, "--delay": `${f.delay}s`, "--rest": f.rest } as CSSProperties}
          >
            {f.shape.map(([x, y]) => (
              <Block key={`${x}-${y}`} tone={f.tone} style={{ left: x * CELL, top: y * CELL }} />
            ))}
          </div>
        ))}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end">
        {Array.from({ length: 64 }, (_, col) => (
          <div key={col} className="relative shrink-0" style={{ width: CELL, height: floor[col % floor.length] * CELL }}>
            {Array.from({ length: floor[col % floor.length] }, (_, row) => (
              <Block key={row} tone={TONES[(col + row) % TONES.length]} style={{ left: 0, bottom: row * CELL }} />
            ))}
          </div>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pt-16 pb-36 text-center @3xl:pt-24 @3xl:pb-44">
        <p className="border-2 border-ink bg-paper-raised px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase shadow-brutal-sm">
          Level 01 · The component kit
        </p>

        <Heading className="mt-8 flex flex-col items-center gap-2 @3xl:gap-3">
          <span className="sr-only">{LINES.flat().join(" ")}</span>
          {LINES.map((words, li) => (
            <span key={li} aria-hidden className="flex flex-wrap justify-center gap-x-4 gap-y-2 @3xl:gap-x-6">
              {words.map((word) => (
                <span key={word} className="flex gap-1 @3xl:gap-1.5">
                  {[...word].map((ch, ci) => {
                    const i = n++;
                    return (
                      <span
                        key={ci}
                        className={`blocks-hero-tile grid size-11 place-items-center border-2 border-ink font-display text-2xl text-on-bright uppercase shadow-brutal-sm pixel-bevel @md:size-14 @md:text-3xl @3xl:size-20 @3xl:border-4 @3xl:text-5xl @3xl:shadow-brutal ${TONES[i % TONES.length]}`}
                        style={{ "--i": i } as CSSProperties}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          ))}
        </Heading>

        <p className="mt-8 max-w-xl border-2 border-ink bg-paper px-5 py-4 text-lg leading-relaxed text-ink-muted shadow-brutal-sm">
          Acme gives you snap-together components for landing pages. Drop them in, line them up, and
          ship.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-13 items-center gap-2 border-2 border-ink bg-lime px-6 font-mono text-sm font-bold text-on-bright uppercase pixel-bevel shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Start building <ArrowRight aria-hidden className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-13 items-center border-2 border-ink bg-paper-raised px-6 font-mono text-sm font-bold uppercase shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            See the pieces
          </a>
        </div>
      </div>
    </section>
  );
}
