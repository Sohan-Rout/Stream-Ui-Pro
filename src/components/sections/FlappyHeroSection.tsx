"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowRight } from "lucide-react";

/** Horizontal distance between pipe pairs, in px. */
const SPACING = 220;
/** Height of the ground strip, in px. */
const GROUND = 64;
/** Pipe shaft width (w-14) and how far each cap overhangs it. */
const PIPE_W = 56;
const CAP = 6;
/** Bird box size (size-12) and a little forgiveness on every side. */
const BIRD = 48;
const INSET = 8;

const SPEED = 80; // px/s, matching the ground hatching
const GRAVITY = 1500; // px/s²
const FLAP = -430; // px/s
const MAX_FALL = 620; // px/s
const MAX_DT = 1 / 30; // a long frame can't tunnel through a pipe

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
/** First pipe's distance from the track's left edge. */
const LEAD = 120;

export type FlyMode = "auto" | "play" | "crash";
export type Flight = { offset: number; y: number; vy: number; mode: FlyMode; score: number; crashFor: number };

/** Every pipe pair on screen at this scroll offset: its left edge and its gap, in px. */
export function pipesAt(offset: number, sky: number) {
  const out: { x: number; top: number; bottom: number }[] = [];
  for (let copy = 0; copy < 2; copy++) {
    GAPS.forEach(([top, bottom], i) => {
      out.push({ x: copy * TRACK + i * SPACING + LEAD - offset, top: (top / 100) * sky, bottom: (bottom / 100) * sky });
    });
  }
  return out;
}

/** The bird's horizontal center: a little in from the left, more room on wide heroes. */
export const birdX = (width: number) => Math.max(44, Math.min(180, width * 0.14));

/** Does the bird (centered at x, y) touch a pipe or the ground? */
export function crashed(x: number, y: number, offset: number, sky: number) {
  const left = x - BIRD / 2 + INSET;
  const right = x + BIRD / 2 - INSET;
  const top = y - BIRD / 2 + INSET;
  const bottom = y + BIRD / 2 - INSET;
  if (bottom >= sky) return true;
  return pipesAt(offset, sky).some(
    (p) => right > p.x - CAP && left < p.x + PIPE_W + CAP && (top < p.top || bottom > p.bottom),
  );
}

/**
 * One frame of flight. On autopilot the bird aims for the middle of the next
 * gap and flaps whenever it sinks below it; in play it only flaps when told
 * to, crashes are checked, and every pipe passed scores a point.
 */
export function fly(f: Flight, seconds: number, width: number, sky: number, flap = false): Flight {
  const dt = Math.min(seconds, MAX_DT);
  const x = birdX(width);

  if (f.mode === "crash") {
    // The world stops; the bird drops to the ground, then autopilot takes over again.
    const vy = Math.min(MAX_FALL, f.vy + GRAVITY * dt);
    const y = Math.min(sky - BIRD / 2, f.y + vy * dt);
    const crashFor = f.crashFor - dt;
    if (crashFor > 0) return { ...f, y, vy, crashFor };
    return { ...f, mode: "auto", y: sky * 0.45, vy: 0, crashFor: 0 };
  }

  const offset = (f.offset + SPEED * dt) % TRACK;
  let vy = f.vy;
  if (f.mode === "auto") {
    const next = pipesAt(offset, sky).find((p) => p.x + PIPE_W + CAP > x - BIRD / 2) ?? { top: sky * 0.3, bottom: sky * 0.6 };
    const target = (next.top + next.bottom) / 2 + 10;
    if (f.y > target && vy >= 0) vy = FLAP;
  } else if (flap) {
    vy = FLAP;
  }
  vy = Math.min(MAX_FALL, vy + GRAVITY * dt);
  const y = Math.max(BIRD / 2, f.y + vy * dt);

  // A pipe whose trailing edge just slipped past the bird is a point.
  const passedLine = x - BIRD / 2;
  const scored = pipesAt(offset, sky).some((p) => {
    const before = p.x + SPEED * dt + PIPE_W;
    return before >= passedLine && p.x + PIPE_W < passedLine;
  });
  const next: Flight = { ...f, offset, y, vy, score: f.mode === "play" && scored ? f.score + 1 : f.score };

  if (f.mode === "play" && crashed(x, y, offset, sky)) return { ...next, mode: "crash", crashFor: 1.2, vy: Math.max(vy, 0) };
  return next;
}

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
        <div key={i} className="absolute inset-y-0 w-14" style={{ left: i * SPACING + LEAD }}>
          <Pipe from="top" height={`${top}%`} />
          <Pipe from="bottom" height={`${100 - bottom}%`} />
        </div>
      ))}
    </>
  );
}

function Bird() {
  return (
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
  );
}

/**
 * Flappy hero: pink pipe pairs scroll past and the bird flies itself through
 * every gap. Tap the sky (or the badge, or press Space once it's focused) to
 * take over: each tap flaps, pipes passed score, and a crash hands the bird
 * back to autopilot. Everything holds still for reduced motion.
 */
export function FlappyHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  const section = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const flight = useRef<Flight>({ offset: 0, y: 0, vy: 0, mode: "auto", score: 0, crashFor: 0 });
  const flapQueued = useRef(false);
  const [hud, setHud] = useState<{ mode: FlyMode; score: number }>({ mode: "auto", score: 0 });
  const [best, setBest] = useState(0);

  useEffect(() => {
    const sky = skyRef.current;
    if (!sky) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    flight.current.y = sky.clientHeight * 0.45;

    const paint = () => {
      const f = flight.current;
      const x = birdX(sky.clientWidth);
      if (trackRef.current) trackRef.current.style.transform = `translateX(${-f.offset}px)`;
      if (birdRef.current) {
        const tilt = f.mode === "crash" ? 70 : Math.max(-25, Math.min(60, f.vy / 9));
        birdRef.current.style.transform = `translate(${x - BIRD / 2}px, ${f.y - BIRD / 2}px) rotate(${tilt}deg)`;
      }
    };
    paint();
    if (still) return;

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const prev = flight.current;
      const next = fly(prev, (now - last) / 1000, sky.clientWidth, sky.clientHeight, flapQueued.current);
      flapQueued.current = false;
      last = now;
      flight.current = next;
      if (next.mode !== prev.mode || next.score !== prev.score) {
        setHud({ mode: next.mode, score: next.score });
        if (next.mode === "crash") setBest((b) => Math.max(b, next.score));
      }
      paint();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  /** Take over from autopilot, or flap if already flying. Ignored while crashed. */
  const flap = useCallback(() => {
    const f = flight.current;
    if (f.mode === "crash") return;
    if (f.mode === "auto") {
      flight.current = { ...f, mode: "play", score: 0 };
      setHud({ mode: "play", score: 0 });
    }
    flapQueued.current = true;
  }, []);

  function onPointerDown(e: PointerEvent) {
    // Links and buttons do their own thing; anywhere else in the sky flaps.
    if (e.button !== 0 || (e.target as HTMLElement).closest("a, button")) return;
    section.current?.focus({ preventScroll: true });
    flap();
  }

  function onKeyDown(e: KeyboardEvent) {
    if ((e.key === " " || e.key === "ArrowUp") && e.target === section.current) {
      e.preventDefault();
      flap();
    }
  }

  const badge =
    hud.mode === "play" ? `Score ${hud.score}` : hud.mode === "crash" ? `Crashed · ${hud.score}` : `Best ${best} · Tap to fly`;

  return (
    <section
      ref={section}
      tabIndex={-1}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className="@container relative cursor-pointer overflow-hidden bg-blue-soft outline-none select-none"
    >
      <style href="flappy-hero" precedence="default">{`
        @keyframes flappy-hero-ground { to { background-position: -32px 0; } }
        @keyframes flappy-hero-wing { 50% { transform: translateY(-6px) scaleY(0.6); } }
        .flappy-hero-ground { animation: flappy-hero-ground 0.4s linear infinite; }
        .flappy-hero-ground[data-stopped] { animation-play-state: paused; }
        .flappy-hero-wing { animation: flappy-hero-wing 0.18s steps(2, end) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .flappy-hero-ground, .flappy-hero-wing { animation: none; }
        }
      `}</style>

      {/* Sky: sun, two copies of the pipe track (so the loop is seamless), and the bird. */}
      <div ref={skyRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0" style={{ bottom: GROUND }}>
        <span className="absolute top-8 right-10 block size-16 rounded-full border-4 border-ink bg-orange" />
        <div ref={trackRef} className="absolute inset-y-0 left-0 flex will-change-transform" style={{ width: TRACK * 2 }}>
          <div className="relative h-full" style={{ width: TRACK }}>
            <PipePairs />
          </div>
          <div className="relative h-full" style={{ width: TRACK }}>
            <PipePairs />
          </div>
        </div>
        <div ref={birdRef} className="absolute top-0 left-0 will-change-transform" style={{ transform: "translate(60px, 40%)" }}>
          <Bird />
        </div>
      </div>

      {/* Ground, with hatching that scrolls with the pipes (and stops on a crash). */}
      <div
        aria-hidden
        data-stopped={hud.mode === "crash" ? "" : undefined}
        className="flappy-hero-ground absolute inset-x-0 bottom-0 border-t-4 border-ink bg-lime"
        style={{
          height: GROUND,
          backgroundImage: "repeating-linear-gradient(-45deg, oklch(0 0 0 / 0.16) 0 3px, transparent 3px 16px)",
          backgroundSize: "32px 100%",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 pt-24 text-center @3xl:pt-28" style={{ paddingBottom: GROUND + 72 }}>
        <button
          type="button"
          onClick={() => {
            section.current?.focus({ preventScroll: true });
            flap();
          }}
          className="cursor-pointer border-2 border-ink bg-orange px-3 py-1 font-mono text-xs font-bold tracking-widest text-on-bright uppercase shadow-brutal-sm transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          <span aria-live="polite">{badge}</span>
        </button>
        {/* No card behind the text: a thick white outline keeps it readable over the moving pipes. */}
        <Heading
          className="mt-6 font-display text-5xl leading-none tracking-tight text-balance @3xl:text-7xl"
          style={{ WebkitTextStroke: "10px var(--paper-raised)", paintOrder: "stroke fill", textShadow: "6px 6px 0 var(--pink)" } as CSSProperties}
        >
          Launch day, no crash landings.
        </Heading>
        <p
          className="mt-6 max-w-md text-lg leading-relaxed font-semibold"
          style={{ WebkitTextStroke: "5px var(--paper-raised)", paintOrder: "stroke fill" } as CSSProperties}
        >
          Acme keeps your landing page light and fast, so it clears every pipe between you and your first
          customer.
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
    </section>
  );
}
