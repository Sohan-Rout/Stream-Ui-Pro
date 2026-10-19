"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowDown, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@streamuilib/react";
import { useBestScore } from "@/lib/games/best-score";
import { drawScene, readFonts } from "@/lib/games/runner-draw";
import { NOTE, blip } from "@/lib/games/arcade-sound";
import {
  WORLD,
  createGame,
  step,
  type RunnerEvent,
  type RunnerGame as Game,
  type RunnerInput,
  type RunnerStatus,
} from "@/lib/games/runner";

/* ------------------------------------------------------------------ */
/* Game                                                                */
/* ------------------------------------------------------------------ */

const JUMP_KEYS = new Set([" ", "ArrowUp", "w", "W"]);
const DUCK_KEYS = new Set(["ArrowDown", "s", "S"]);

function sound(e: RunnerEvent) {
  if (e === "jump") blip([{ f: NOTE.C5, dur: 0.09, to: NOTE.G5, gain: 0.035 }]);
  else if (e === "milestone") blip([{ f: NOTE.E6, dur: 0.07 }, { f: NOTE.G6, at: 0.08, dur: 0.1 }], 0.7);
  else blip([NOTE.G4, NOTE.E4, NOTE.C4].map((f, i) => ({ f, at: i * 0.12, dur: 0.16, type: "triangle" as const, gain: 0.12 })));
}

/** Keys typed into fields, or pressing a focused button or link, belong to that element. */
function ownedByControl(target: EventTarget | null) {
  return target instanceof HTMLElement && (target.isContentEditable || !!target.closest("input, textarea, select, button, a"));
}

type Hud = { score: number; status: RunnerStatus; flash: boolean };

/**
 * An endless runner. Space or Up to jump, Down to duck, or tap the strip.
 *
 * `keys="window"` (the 404 page) listens on the whole window, so there's
 * nothing to focus first. `keys="board"` (Labs, where several games share a
 * page) listens only once the strip is clicked or focused, so Space still
 * scrolls the page otherwise.
 */
export function RunnerGame({ keys = "window" }: { keys?: "window" | "board" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(createGame());
  const input = useRef<RunnerInput>({ jump: false, duck: false });
  const mutedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [hud, setHud] = useState<Hud>({ score: 0, status: "ready", flash: false });
  const [best, saveBest] = useBestScore("runner");
  const statusId = useId();

  const start = useCallback(() => {
    gameRef.current = createGame("playing");
    // The press that starts the run shouldn't also jump.
    gameRef.current.jumpHeld = input.current.jump;
    setHud({ score: 0, status: "playing", flash: false });
  }, []);

  const press = useCallback(
    (key: keyof RunnerInput, down: boolean) => {
      if (down && key === "jump" && gameRef.current.status !== "playing") {
        input.current.jump = true;
        start();
        return;
      }
      input.current[key] = down;
    },
    [start],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    // Match the canvas to its on-screen size so the strip stays crisp at any width.
    const fit = () => {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = (canvas.clientWidth / WORLD.width) * dpr;
      canvas.width = Math.round(WORLD.width * scale);
      canvas.height = Math.round(WORLD.height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    };
    fit();
    const resize = new ResizeObserver(fit);
    if (canvas) resize.observe(canvas);
    const fonts = readFonts();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let time = 0;
    let shake = 0;
    let flashUntil = 0;
    const hudFlash = { current: false };
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      time += dt;
      const prev = gameRef.current;
      const { game, events } = step(prev, input.current, dt, Math.random);
      gameRef.current = game;
      if (!mutedRef.current) events.forEach(sound);
      if (events.includes("milestone")) flashUntil = time + 0.8;
      if (events.includes("crash")) {
        if (!reduceMotion) shake = 0.25;
        saveBest(game.score);
      }
      shake = Math.max(0, shake - dt);
      const flash = time < flashUntil && Math.floor(time * 8) % 2 === 0;
      if (game.score !== prev.score || game.status !== prev.status || flash !== hudFlash.current) {
        hudFlash.current = flash;
        setHud({ score: game.score, status: game.status, flash });
      }
      if (ctx) drawScene(ctx, game, time, { fonts, shake });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, [saveBest]);

  const onKey = useCallback(
    (e: KeyboardEvent | ReactKeyboardEvent, down: boolean) => {
      if (ownedByControl(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = JUMP_KEYS.has(e.key) ? "jump" : DUCK_KEYS.has(e.key) ? "duck" : null;
      if (!key) return;
      e.preventDefault(); // keep Space and the arrows from scrolling the page
      if (down && e.repeat) return;
      press(key, down);
    },
    [press],
  );
  const release = useCallback(() => (input.current = { jump: false, duck: false }), []);

  useEffect(() => {
    if (keys !== "window") return;
    const keydown = (e: KeyboardEvent) => onKey(e, true);
    const keyup = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", release);
    };
  }, [keys, onKey, release]);
  const board = keys === "board";

  const message =
    hud.status === "over"
      ? `Game over. Score ${hud.score}. Press Space or tap to run again.`
      : hud.status === "ready"
        ? `${board ? "Click" : "Press Space"} or tap the strip to run. Jump the cacti; duck the middle flyers.`
        : "";

  return (
    <div className="flex w-full flex-col gap-3 text-ink">
      <div className="flex items-center justify-between gap-4 font-mono text-xs uppercase">
        {/* Key hints for keyboards; touch screens get a tap hint instead. */}
        <span className="text-ink-muted pointer-coarse:hidden">
          <kbd className="border-2 border-ink bg-paper-raised px-1.5 py-0.5 font-bold text-ink">Space</kbd> jump ·{" "}
          <kbd className="border-2 border-ink bg-paper-raised px-1.5 py-0.5 font-bold text-ink">↓</kbd> duck
        </span>
        <span className="hidden text-ink-muted pointer-coarse:inline">Tap to jump</span>
        <span className="flex items-center gap-4">
          <span className="text-ink-muted">
            HI <span className="font-bold text-ink tabular-nums">{String(best).padStart(5, "0")}</span>
          </span>
          <span className={hud.flash ? "bg-lime px-1 text-on-bright" : "px-1"}>
            <span className="font-bold tabular-nums">{String(hud.score).padStart(5, "0")}</span>
          </span>
          <button
            type="button"
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            aria-pressed={!muted}
            onClick={() => setMuted((m) => (mutedRef.current = !m))}
            className="grid size-6 place-items-center text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {muted ? <VolumeX aria-hidden className="size-4" /> : <Volume2 aria-hidden className="size-4" />}
          </button>
        </span>
      </div>

      <div
        role="group"
        aria-label="Runner game. Space or Up to jump, Down to duck, or tap to jump."
        aria-describedby={statusId}
        tabIndex={board ? 0 : undefined}
        onKeyDown={board ? (e) => onKey(e, true) : undefined}
        onKeyUp={board ? (e) => onKey(e, false) : undefined}
        onBlur={board ? release : undefined}
        onPointerDown={(e) => {
          e.preventDefault();
          if (board) e.currentTarget.focus();
          e.currentTarget.setPointerCapture(e.pointerId);
          press("jump", true);
        }}
        onPointerUp={() => press("jump", false)}
        onPointerCancel={() => press("jump", false)}
        className="relative aspect-3/1 w-full cursor-pointer touch-none overflow-hidden border-2 border-ink bg-paper shadow-brutal-lg select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <canvas ref={canvasRef} aria-hidden className="block size-full" />
        {hud.status !== "playing" && (
          <div className="absolute inset-0 grid place-items-center bg-paper/50">
            <div className="flex items-center gap-2 border-2 border-ink bg-paper-raised px-2.5 py-1.5 shadow-brutal sm:gap-3 sm:px-4 sm:py-2.5">
              {hud.status === "over" ? (
                <>
                  <span className="font-display tracking-tight sm:text-lg">Game over</span>
                  <span className="hidden font-mono text-xs uppercase sm:inline">
                    Score <span className="font-bold">{hud.score}</span>
                  </span>
                  <Button size="sm" tabIndex={-1} onPointerDown={(e) => e.stopPropagation()} onClick={start}>
                    <RotateCcw aria-hidden /> Run again
                  </Button>
                </>
              ) : (
                <>
                  <Play aria-hidden className="size-4" />
                  <span className="font-mono text-xs font-bold uppercase pointer-coarse:hidden">{board ? "Click to run" : "Press Space to run"}</span>
                  <span className="hidden font-mono text-xs font-bold uppercase pointer-coarse:inline">Tap to run</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      {/* Phones and tablets: a duck button (tap the strip to jump). */}
      <Button
        variant="secondary"
        className="hidden h-12 touch-none self-end pointer-coarse:inline-flex"
        aria-label="Duck"
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          press("duck", true);
        }}
        onPointerUp={() => press("duck", false)}
        onPointerCancel={() => press("duck", false)}
        onLostPointerCapture={() => press("duck", false)}
      >
        <ArrowDown aria-hidden /> Duck
      </Button>
    </div>
  );
}

/** The runner as a Labs experiment: keys work once the strip is clicked or focused. */
export function RunnerLab() {
  return <RunnerGame keys="board" />;
}
