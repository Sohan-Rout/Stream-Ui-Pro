"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowDown, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@streamuilib/react";
import { brand } from "@/lib/brand";
import { useBestScore } from "@/lib/games/best-score";
import { NOTE, blip } from "@/lib/games/arcade-sound";
import {
  DINO,
  GROUND,
  WORLD,
  createGame,
  dinoBox,
  step,
  type Obstacle,
  type RunnerEvent,
  type RunnerGame as Game,
  type RunnerInput,
  type RunnerStatus,
} from "@/lib/games/runner";

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

type Fonts = { display: string; mono: string };

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, shadow = 3) {
  if (shadow) {
    ctx.fillStyle = brand.ink;
    ctx.fillRect(x + shadow, y + shadow, w, h);
  }
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = brand.ink;
  ctx.strokeRect(x, y, w, h);
}

/** A rounded, outlined cloud that drifts slower than the ground. */
function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  const h = 16;
  ctx.beginPath();
  ctx.roundRect(x + 3, y + 3, w, h, h / 2);
  ctx.fillStyle = brand.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = brand.raised;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();
}

/** The dino: our own chunky block design, lime with an ink outline and hard shadow. */
function dino(ctx: CanvasRenderingContext2D, game: Game, time: number) {
  const b = dinoBox(game);
  const dead = game.status === "over";
  const duck = b.h < DINO.h;
  const legPhase = game.height === 0 && game.status === "playing" ? Math.floor(game.distance / 22) % 2 : 0;

  // Legs: two stubby ink blocks that alternate while running.
  ctx.fillStyle = brand.ink;
  const legY = b.y + b.h - 2;
  ctx.fillRect(b.x + 8, legY, 7, legPhase ? 7 : 4);
  ctx.fillRect(b.x + (duck ? 30 : 22), legY, 7, legPhase ? 4 : 7);

  if (duck) {
    // Low and long: body with the head pushed forward.
    box(ctx, b.x, b.y + 4, b.w - 14, b.h - 4, brand.lime);
    box(ctx, b.x + b.w - 20, b.y, 20, 16, brand.lime);
  } else {
    box(ctx, b.x - 6, b.y + 16, 10, 10, brand.lime, 2); // tail
    box(ctx, b.x, b.y + 12, b.w - 10, b.h - 12, brand.lime); // body
    box(ctx, b.x + b.w - 26, b.y, 26, 20, brand.lime); // head
    box(ctx, b.x + b.w - 16, b.y + 26, 8, 5, brand.lime, 0); // arm
  }

  // Eye: a white square with an ink pupil; an X once it's over.
  const headX = duck ? b.x + b.w - 20 : b.x + b.w - 26;
  const eyeX = headX + (duck ? 9 : 14);
  const eyeY = b.y + (duck ? 3 : 4);
  ctx.fillStyle = brand.raised;
  ctx.fillRect(eyeX, eyeY, 8, 8);
  ctx.strokeStyle = brand.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(eyeX, eyeY, 8, 8);
  if (dead) {
    ctx.beginPath();
    ctx.moveTo(eyeX + 1, eyeY + 1);
    ctx.lineTo(eyeX + 7, eyeY + 7);
    ctx.moveTo(eyeX + 7, eyeY + 1);
    ctx.lineTo(eyeX + 1, eyeY + 7);
    ctx.stroke();
  } else {
    const blink = Math.floor(time * 10) % 40 === 0;
    ctx.fillStyle = brand.ink;
    ctx.fillRect(eyeX + 4, eyeY + (blink ? 4 : 2), 3, blink ? 1 : 4);
  }
  // A pink cheek, for charm.
  ctx.fillStyle = brand.pink;
  ctx.fillRect(headX + (duck ? 4 : 6), b.y + (duck ? 10 : 13), 5, 3);
}

function obstacle(ctx: CanvasRenderingContext2D, o: Obstacle, time: number, fonts: Fonts) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (o.kind.startsWith("bird")) {
    // A flying "?" block with flapping wings.
    const up = Math.floor(time * 6) % 2 === 0;
    ctx.fillStyle = brand.ink;
    ctx.beginPath();
    ctx.moveTo(o.x + 10, o.y + 8);
    ctx.lineTo(o.x + 18, up ? o.y - 10 : o.y + 22);
    ctx.lineTo(o.x + 26, o.y + 8);
    ctx.fill();
    box(ctx, o.x + 6, o.y, o.w - 12, o.h, brand.blue);
    ctx.font = `bold 15px ${fonts.mono}`;
    ctx.fillStyle = brand.ink;
    ctx.fillText("?", o.x + o.w / 2, o.y + o.h / 2 + 1);
    return;
  }
  if (o.kind === "stack") {
    box(ctx, o.x, o.y, o.w / 2, o.h, brand.pink);
    box(ctx, o.x + o.w / 2, o.y + 10, o.w / 2, o.h - 10, brand.orange);
  } else {
    box(ctx, o.x, o.y, o.w, o.h, o.kind === "tall" ? brand.orange : brand.pink);
  }
  ctx.font = `bold 13px ${fonts.mono}`;
  ctx.fillStyle = brand.ink;
  ctx.fillText("!", o.x + (o.kind === "stack" ? o.w / 4 : o.w / 2), o.y + 13);
}

function draw(ctx: CanvasRenderingContext2D, game: Game, time: number, shake: number, fonts: Fonts) {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * shake * 30, (Math.random() - 0.5) * shake * 30);

  ctx.fillStyle = brand.paper;
  ctx.fillRect(-10, -10, WORLD.width + 20, WORLD.height + 20);
  ctx.fillStyle = brand.faint;
  const dotShift = (game.distance * 0.1) % 20;
  for (let x = 10 - dotShift; x < WORLD.width; x += 20) for (let y = 10; y < GROUND; y += 20) ctx.fillRect(x - 1, y - 1, 2, 2);

  // A huge faint 404 far behind everything, drifting slowest.
  ctx.font = `120px ${fonts.display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(14,15,20,0.05)";
  const far = ((WORLD.width * 0.62 - game.distance * 0.05) % (WORLD.width + 300)) + 150;
  ctx.fillText("404", far < -150 ? far + WORLD.width + 300 : far, GROUND - 22);

  // Clouds at their own parallax.
  for (const [base, y, w] of [[90, 34, 64], [330, 56, 48], [520, 26, 80]] as const) {
    const span = WORLD.width + 140;
    const x = ((((base - game.distance * 0.25) % span) + span) % span) - 90;
    cloud(ctx, x, y, w);
  }

  // Ground: a heavy ink line with hatch marks that scroll with the world.
  ctx.fillStyle = brand.ink;
  ctx.fillRect(0, GROUND, WORLD.width, 3);
  ctx.strokeStyle = brand.ink;
  ctx.lineWidth = 2;
  const hatch = game.distance % 24;
  for (let x = -hatch; x < WORLD.width + 24; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, GROUND + 18);
    ctx.lineTo(x + 10, GROUND + 8);
    ctx.stroke();
  }
  ctx.fillStyle = brand.muted;
  for (let x = (-game.distance * 1) % 70; x < WORLD.width; x += 70) ctx.fillRect(x + 35, GROUND + 22, 6, 2);

  for (const o of game.obstacles) obstacle(ctx, o, time, fonts);
  dino(ctx, game, time);
  ctx.restore();
}

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
 * An endless runner for the 404 page. Space or Up to jump, Down to duck, or
 * tap the strip. It listens on the window, so there's nothing to focus first.
 */
export function RunnerGame() {
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
    if (canvas && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = WORLD.width * dpr;
      canvas.height = WORLD.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const css = getComputedStyle(document.documentElement);
    const fonts: Fonts = {
      display: css.getPropertyValue("--font-archivo-black").trim() || "sans-serif",
      mono: css.getPropertyValue("--font-space-mono").trim() || "monospace",
    };
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
      if (ctx) draw(ctx, game, time, shake, fonts);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (ownedByControl(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = JUMP_KEYS.has(e.key) ? "jump" : DUCK_KEYS.has(e.key) ? "duck" : null;
      if (!key) return;
      e.preventDefault(); // keep Space and the arrows from scrolling the page
      if (down && e.repeat) return;
      press(key, down);
    };
    const keydown = (e: KeyboardEvent) => onKey(e, true);
    const keyup = (e: KeyboardEvent) => onKey(e, false);
    const blur = () => (input.current = { jump: false, duck: false });
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", blur);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", blur);
    };
  }, [press, saveBest]);

  const message =
    hud.status === "over"
      ? `Game over. Score ${hud.score}. Press Space or tap to run again.`
      : hud.status === "ready"
        ? "Press Space or tap the strip to run. Jump the blocks; duck the middle flyers."
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
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          press("jump", true);
        }}
        onPointerUp={() => press("jump", false)}
        onPointerCancel={() => press("jump", false)}
        className="relative aspect-3/1 w-full cursor-pointer touch-none overflow-hidden border-2 border-ink bg-paper shadow-brutal-lg select-none"
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
                  <span className="font-mono text-xs font-bold uppercase pointer-coarse:hidden">Press Space to run</span>
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
