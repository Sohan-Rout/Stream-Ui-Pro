"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { CornerDownLeft } from "lucide-react";

const MAX = 500;
/** Grid cell size in px: the background grid, the falling blocks, and the floor share it. */
const CELL = 24;

const suggestions = ["Arcade landing page", "Leaderboard table", "Retro pricing cards"];

type Faller = {
  /** Filled cells of the piece, as [column, row]. */
  shape: [number, number][];
  tone: string;
  /** Horizontal position, as a share of the section width. */
  left: string;
  /** Seconds per fall, and the head start (negative, so pieces are mid-fall on load). */
  duration: number;
  delay: number;
  /** Where the piece rests when motion is reduced, as a share of the height. */
  rest: string;
};

// Tetromino shapes (I, O, T, S, Z, J, L), spread across the width at different speeds.
const I: [number, number][] = [[0, 0], [0, 1], [0, 2], [0, 3]];
const O: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
const T: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];
const S: [number, number][] = [[1, 0], [2, 0], [0, 1], [1, 1]];
const Z: [number, number][] = [[0, 0], [1, 0], [1, 1], [2, 1]];
const J: [number, number][] = [[1, 0], [1, 1], [1, 2], [0, 2]];
const L: [number, number][] = [[0, 0], [0, 1], [0, 2], [1, 2]];

const fallers: Faller[] = [
  { shape: T, tone: "bg-violet", left: "4%", duration: 9, delay: -2, rest: "18%" },
  { shape: I, tone: "bg-blue", left: "14%", duration: 12, delay: -7, rest: "52%" },
  { shape: S, tone: "bg-lime", left: "24%", duration: 10, delay: -4, rest: "8%" },
  { shape: O, tone: "bg-orange", left: "70%", duration: 8, delay: -1, rest: "30%" },
  { shape: L, tone: "bg-pink", left: "80%", duration: 11, delay: -6, rest: "60%" },
  { shape: Z, tone: "bg-pink", left: "90%", duration: 9.5, delay: -8, rest: "12%" },
  { shape: J, tone: "bg-blue", left: "60%", duration: 13, delay: -10, rest: "44%" },
  { shape: T, tone: "bg-lime", left: "36%", duration: 14, delay: -12, rest: "70%" },
];

/** Column heights of the locked stack along the bottom, repeated across the width. */
const floor = [2, 3, 1, 2, 2, 4, 1, 3, 2, 1, 3, 2, 0, 2, 3, 1];
const floorTones = ["bg-blue", "bg-pink", "bg-lime", "bg-violet", "bg-orange"];

function Block({ tone, style }: { tone: string; style?: CSSProperties }) {
  return <span className={`absolute border-2 border-ink pixel-bevel ${tone}`} style={{ width: CELL, height: CELL, ...style }} />;
}

/**
 * Pixel prompt hero: the prompt box in an arcade "screen" over a pixel grid
 * where tetrominoes fall one cell per tick onto a locked stack. The falling
 * pieces are decorative and hold still for reduced motion. Enter sends,
 * Shift+Enter adds a line; point the form `action` at your app.
 */
export function PixelPromptHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  const [prompt, setPrompt] = useState("");
  const box = useRef<HTMLTextAreaElement>(null);
  const empty = prompt.trim() === "";

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!empty) e.currentTarget.form?.requestSubmit();
    }
  }

  function suggest(text: string) {
    setPrompt(text);
    box.current?.focus();
  }

  return (
    <section
      className="@container relative overflow-hidden bg-paper-sunken bg-pixel-grid"
      style={{ backgroundSize: `${CELL}px ${CELL}px` }}
    >
      {/* Falls in whole cells (steps), like a game tick; still for reduced motion. */}
      <style href="pixel-prompt-hero" precedence="default">{`
        @keyframes pixel-hero-fall { from { top: -${CELL * 4}px; } to { top: 100%; } }
        .pixel-hero-faller { animation: pixel-hero-fall var(--fall) steps(28, end) var(--delay) infinite; }
        @media (prefers-reduced-motion: reduce) { .pixel-hero-faller { animation: none; top: var(--rest); } }
      `}</style>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {fallers.map((f, i) => (
          <div
            key={i}
            className="pixel-hero-faller absolute"
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
              <Block key={row} tone={floorTones[(col + row) % floorTones.length]} style={{ left: 0, bottom: row * CELL }} />
            ))}
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl px-4 pt-14 pb-28 @3xl:pt-20 @3xl:pb-32">
        <div className="border-4 border-ink bg-paper p-6 text-center shadow-brutal-lg @3xl:p-10">
          <p className="inline-flex items-center gap-2 border-2 border-ink bg-lime px-2 py-1 font-mono text-xs font-bold tracking-widest text-on-bright uppercase pixel-bevel">
            Level 01 · Public beta
          </p>
          <Heading
            className="mt-5 font-display text-4xl leading-none tracking-tight text-balance uppercase @3xl:text-6xl"
            style={{ textShadow: "4px 4px 0 var(--pink)" }}
          >
            Stack ideas. Ship pages.
          </Heading>
          <p className="mx-auto mt-5 max-w-md font-mono text-sm leading-relaxed text-ink-muted">
            Describe a page and Acme builds it block by block: responsive React you can edit, export, or deploy.
          </p>

          <form action="/new" method="get" className="mt-8 text-left">
            <div className="flex items-start gap-3 border-4 border-ink bg-paper-raised p-4 focus-within:outline-3 focus-within:outline-offset-4 focus-within:outline-blue">
              <span aria-hidden className="pt-0.5 font-mono text-lg font-bold text-pink">&gt;</span>
              <label htmlFor="pixel-hero-prompt" className="sr-only">
                Describe what you want to build
              </label>
              <textarea
                ref={box}
                id="pixel-hero-prompt"
                name="prompt"
                rows={3}
                maxLength={MAX}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="A high-score page with a pixel leaderboard…"
                className="block w-full resize-none bg-transparent font-mono leading-relaxed outline-none placeholder:text-ink-faint"
                style={{ caretShape: "block" } as CSSProperties}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span aria-hidden className="font-mono text-xs text-ink-muted tabular-nums">
                {String(prompt.length).padStart(3, "0")}/{MAX}
              </span>
              <button
                type="submit"
                disabled={empty}
                className="inline-flex cursor-pointer items-center gap-2 border-2 border-ink bg-lime px-4 py-2 font-mono text-sm font-bold text-on-bright uppercase pixel-bevel shadow-brutal-sm transition-[translate,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-brutal active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:pointer-events-none disabled:opacity-50"
              >
                Generate <CornerDownLeft aria-hidden className="size-4" />
              </button>
            </div>
          </form>

          <ul aria-label="Try an example" className="mt-6 flex flex-wrap justify-center gap-2">
            {suggestions.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => suggest(s)}
                  className={`cursor-pointer border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold text-on-bright uppercase pixel-bevel transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue ${floorTones[i + 1]}`}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
