"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { autopilot, createGame, makeObstacle, step, type RunnerGame } from "@/lib/games/runner";
import { drawScene, readFonts } from "@/lib/games/runner-draw";

const TONES = ["bg-lime", "bg-pink", "bg-blue", "bg-violet", "bg-orange"];

/** The headline, one tile per letter; each line wraps between words, never inside one. */
const LINES = [["Outrun"], ["the", "deadline."]];

/** World units per screen pixel, from the section width: bigger scenery on wide screens. */
const scaleFor = (width: number) => Math.min(1.25, Math.max(0.7, width / 1100));
/** Calm enough for a background: the run speeds up to here and holds. */
const TOP_SPEED = 520;

/** A first frame (and the still frame for reduced motion): a cactus coming, a flyer overhead. */
function startingGame(viewWidth: number): RunnerGame {
  return {
    ...createGame("playing"),
    distance: 300 * 32, // past the point where flyers join in
    score: 300,
    nextIn: 260,
    obstacles: [makeObstacle("cactus", viewWidth * 0.55), makeObstacle("bird-high", viewWidth * 0.82)],
  };
}

/**
 * Runner hero: the Dino Runner scene fills the background, with the dino
 * jumping cacti and ducking flyers on autopilot, behind a letter-tile
 * headline, a hard-shadowed subheading, and two buttons. The scene renders
 * at the section's size and pauses off screen; it's a still frame for
 * reduced motion.
 */
export function DinoHeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;
    const fonts = readFonts();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let view = { w: 900, h: 400 };
    let game: RunnerGame | null = null;
    let time = 0;
    const paint = () => game && drawScene(ctx, game, time, { fonts, width: view.w, height: view.h, label: null });
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth: w, clientHeight: h } = canvas;
      const s = scaleFor(w);
      view = { w: w / s, h: h / s };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, 0, 0);
      game ??= startingGame(view.w);
      paint();
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    if (still) return () => resize.disconnect();

    // Run only while the section is on screen.
    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      time += dt;
      if (game) {
        const next = step(game, autopilot(game), dt, Math.random, view.w).game;
        game = next.status === "over" ? startingGame(view.w) : { ...next, speed: Math.min(next.speed, TOP_SPEED) };
      }
      paint();
      raf = requestAnimationFrame(frame);
    };
    const visible = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(frame);
    });
    visible.observe(section);
    return () => {
      cancelAnimationFrame(raf);
      visible.disconnect();
      resize.disconnect();
    };
  }, []);

  let n = 0; // letter index across the whole headline, for colors and the drop order

  return (
    <section ref={sectionRef} className="@container relative isolate overflow-hidden bg-blue-soft text-ink">
      {/* Letter tiles drop in one by one, like pieces landing; still for reduced motion. */}
      <style href="dino-hero" precedence="default">{`
        @keyframes dino-hero-drop { from { transform: translateY(-420%); } to { transform: translateY(0); } }
        .dino-hero-tile { animation: dino-hero-drop 0.5s steps(6, end) calc(var(--i) * 70ms) both; }
        @media (prefers-reduced-motion: reduce) { .dino-hero-tile { animation: none; } }
      `}</style>

      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 -z-10 block size-full" />

      {/* Bottom padding keeps the copy clear of the scenery (sun, clouds, flyers); it grows as the scene scales up. */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pt-12 pb-44 text-center @3xl:pt-20 @3xl:pb-56 @5xl:pb-68 @7xl:pb-72">
        <Heading className="flex flex-col items-center gap-2 @3xl:gap-3">
          <span className="sr-only">{LINES.flat().join(" ")}</span>
          {LINES.map((words, li) => (
            <span key={li} aria-hidden className="flex flex-wrap justify-center gap-x-4 gap-y-2 @3xl:gap-x-6">
              {/* Tiles shrink with the container so the longest word (nine tiles) always fits. */}
              {words.map((word) => (
                <span key={word} className="flex gap-1 @3xl:gap-1.5">
                  {[...word].map((ch, ci) => {
                    const i = n++;
                    return (
                      <span
                        key={ci}
                        className={`dino-hero-tile grid size-7 place-items-center border-2 border-ink font-display text-sm text-on-bright uppercase shadow-brutal-sm pixel-bevel @sm:size-8 @sm:text-base @md:size-10 @md:text-xl @xl:size-13 @xl:text-3xl @3xl:size-18 @3xl:border-4 @3xl:text-5xl @3xl:shadow-brutal ${TONES[i % TONES.length]}`}
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

        {/* A white outline painted under the letters keeps the subheading readable over the scene. */}
        <p
          className="mt-8 max-w-2xl font-display text-lg leading-snug tracking-tight @md:text-xl @3xl:text-2xl"
          style={{ WebkitTextStroke: "6px var(--paper-raised)", paintOrder: "stroke fill", textShadow: "4px 4px 0 var(--pink)" } as CSSProperties}
        >
          Acme gets your launch page live before the next obstacle shows up. No detours, no dead ends.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="inline-flex h-13 items-center gap-2 border-2 border-ink bg-lime px-6 font-mono text-sm font-bold text-on-bright uppercase pixel-bevel shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Start running <ArrowRight aria-hidden className="size-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-13 items-center border-2 border-ink bg-paper-raised px-6 font-mono text-sm font-bold uppercase shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            See the code
          </a>
        </div>
      </div>
    </section>
  );
}
