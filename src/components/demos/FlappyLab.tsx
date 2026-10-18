"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@streamuilib/react";
import { brand } from "@/lib/brand";
import { cryptoInt } from "@/lib/games/memory";
import { useBestScore } from "@/lib/games/best-score";
import { BIRD, GROUND, PIPE, WORLD, createGame, flap, step, type FlappyGame, type FlappyStatus } from "@/lib/games/flappy";

const LINE = 3; // ink outline width, in world units
const SHADOW = 5; // hard shadow offset

/* ------------------------------------------------------------------ */
/* Drawing: neo-brutalist shapes on a 2D canvas                        */
/* ------------------------------------------------------------------ */

/** A filled box with an ink outline and a hard ink shadow down and to the right. */
function block(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, shadow = SHADOW, radius = 0) {
  if (shadow) {
    ctx.fillStyle = brand.ink;
    ctx.beginPath();
    ctx.roundRect(x + shadow, y + shadow, w, h, radius);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = LINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();
}

const CLOUDS = [
  { x: 30, y: 70, w: 74, h: 26, speed: 0.18 },
  { x: 190, y: 40, w: 54, h: 20, speed: 0.12 },
  { x: 250, y: 150, w: 86, h: 28, speed: 0.24 },
];

function drawSky(ctx: CanvasRenderingContext2D, distance: number) {
  ctx.fillStyle = brand.blueSoft;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);

  // A sticker sun, fixed in the corner.
  ctx.beginPath();
  ctx.arc(WORLD.width - 46, 52, 22, 0, Math.PI * 2);
  ctx.fillStyle = brand.orange;
  ctx.fill();
  ctx.lineWidth = LINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();

  // Clouds drift slower than the pipes, for a little depth.
  for (const c of CLOUDS) {
    const span = WORLD.width + c.w + 40;
    const x = ((((c.x - distance * c.speed) % span) + span) % span) - c.w - 20;
    block(ctx, x, c.y, c.w, c.h, brand.raised, 3, 6);
  }
}

function drawPipe(ctx: CanvasRenderingContext2D, x: number, gapY: number) {
  const capH = 18;
  const capOver = 5;
  const bottomY = gapY + PIPE.gap;
  const groundY = WORLD.height - GROUND;

  // Shafts, then caps on top so their outlines read as separate pieces.
  block(ctx, x, -LINE, PIPE.width, gapY - capH + LINE, brand.pink);
  block(ctx, x, bottomY + capH, PIPE.width, groundY - bottomY - capH + LINE, brand.pink);
  // A light stripe down each shaft, like a highlight on plastic.
  ctx.fillStyle = brand.pinkSoft;
  ctx.fillRect(x + 9, 0, 7, gapY - capH - LINE);
  ctx.fillRect(x + 9, bottomY + capH + LINE, 7, groundY - bottomY - capH - LINE);

  block(ctx, x - capOver, gapY - capH, PIPE.width + capOver * 2, capH, brand.pink);
  block(ctx, x - capOver, bottomY, PIPE.width + capOver * 2, capH, brand.pink);
}

function drawGround(ctx: CanvasRenderingContext2D, distance: number) {
  const top = WORLD.height - GROUND;
  ctx.fillStyle = brand.lime;
  ctx.fillRect(0, top, WORLD.width, GROUND);
  // Hatching that scrolls with the world.
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, top, WORLD.width, GROUND);
  ctx.clip();
  ctx.strokeStyle = brand.ink;
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 2;
  const offset = distance % 16;
  for (let x = -GROUND - offset; x < WORLD.width + GROUND; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, WORLD.height);
    ctx.lineTo(x + GROUND, top);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = brand.ink;
  ctx.fillRect(0, top, WORLD.width, LINE);
}

function drawBird(ctx: CanvasRenderingContext2D, game: FlappyGame, time: number) {
  const s = BIRD.size;
  // Idle bob before the first flap; tilt with speed once flying.
  const y = game.status === "ready" ? game.y + Math.sin(time * 3) * 6 : game.y;
  const tilt = game.status === "ready" ? 0 : Math.max(-0.45, Math.min(1.1, game.vy / 560));
  const flapping = game.status === "ready" || game.vy < 0;

  ctx.save();
  ctx.translate(BIRD.x + s / 2, y + s / 2);
  ctx.rotate(tilt);
  ctx.translate(-s / 2, -s / 2);

  // Beak first, so the body's outline sits over its base.
  ctx.beginPath();
  ctx.moveTo(s - 2, s * 0.42);
  ctx.lineTo(s + 11, s * 0.56);
  ctx.lineTo(s - 2, s * 0.72);
  ctx.closePath();
  ctx.fillStyle = brand.pink;
  ctx.fill();
  ctx.lineWidth = LINE - 0.5;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();

  block(ctx, 0, 0, s, s, brand.orange, 3, 4);

  // Eye.
  ctx.beginPath();
  ctx.arc(s * 0.66, s * 0.34, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = brand.raised;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(s * 0.7, s * 0.34, 2.4, 0, Math.PI * 2);
  ctx.fillStyle = brand.ink;
  ctx.fill();

  // Wing: flaps while climbing, holds still while falling.
  const lift = flapping ? Math.sin(time * 24) * 5 : 2;
  block(ctx, 3, s * 0.48 - lift, 14, 9, brand.violet, 0, 2);

  ctx.restore();
}

function draw(ctx: CanvasRenderingContext2D, game: FlappyGame, time: number) {
  drawSky(ctx, game.distance);
  for (const p of game.pipes) drawPipe(ctx, p.x, p.gapY);
  drawGround(ctx, game.distance);
  drawBird(ctx, game, time);
}

/* ------------------------------------------------------------------ */
/* Game                                                                */
/* ------------------------------------------------------------------ */

/** After a crash, ignore flaps briefly so a mashed key doesn't restart instantly. */
const RESTART_GRACE_MS = 450;

const FLAP_KEYS = new Set([" ", "ArrowUp", "w", "W"]);

export function FlappyLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<FlappyGame>(createGame());
  const pausedRef = useRef(false);
  const overAtRef = useRef(0);
  const [status, setStatus] = useState<FlappyStatus>("ready");
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [best, saveBest] = useBestScore("flappy");
  const statusId = useId();

  // The loop runs outside React: physics and drawing every frame, and React
  // state only changes when the score or status does.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = WORLD.width * dpr;
      canvas.height = WORLD.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const seconds = (now - last) / 1000;
      last = now;
      if (!pausedRef.current) {
        const prev = gameRef.current;
        const next = step(prev, seconds, cryptoInt);
        gameRef.current = next;
        if (next.score !== prev.score) setScore(next.score);
        if (next.status !== prev.status) {
          setStatus(next.status);
          if (next.status === "over") {
            overAtRef.current = now;
            saveBest(next.score);
          }
        }
      }
      if (ctx) draw(ctx, gameRef.current, now / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [saveBest]);

  const setPause = useCallback((value: boolean) => {
    pausedRef.current = value;
    setPaused(value);
  }, []);

  const start = useCallback(() => {
    if (gameRef.current.status === "over") gameRef.current = createGame();
    gameRef.current = flap(gameRef.current);
    setScore(gameRef.current.score);
    setStatus("playing");
    setPause(false);
  }, [setPause]);

  const press = useCallback(() => {
    const game = gameRef.current;
    if (pausedRef.current) return setPause(false);
    if (game.status === "over") {
      if (performance.now() - overAtRef.current > RESTART_GRACE_MS) start();
      return;
    }
    if (game.status === "ready") return start();
    gameRef.current = flap(game);
  }, [start, setPause]);

  function onKeyDown(e: KeyboardEvent) {
    if (FLAP_KEYS.has(e.key)) {
      e.preventDefault();
      press();
    } else if ((e.key === "p" || e.key === "P" || e.key === "Escape") && gameRef.current.status === "playing") {
      e.preventDefault();
      setPause(!pausedRef.current);
    }
  }

  function onPointerDown(e: PointerEvent) {
    // Buttons in the overlay handle their own clicks.
    if ((e.target as HTMLElement).closest("button")) return;
    if (e.button !== 0) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).focus();
    press();
  }

  const announcement =
    status === "over"
      ? `Game over. Score ${score}. Best ${Math.max(best, score)}.`
      : paused
        ? "Paused."
        : status === "playing"
          ? "Flying. Press Space to flap."
          : "Press Space, or tap the game, to start.";

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <div className="flex w-full max-w-80 items-center justify-between font-mono text-xs uppercase">
        <span className="text-ink-muted">Space · ↑ · tap to flap</span>
        <span className="text-ink-muted">
          Best <span className="font-bold text-ink tabular-nums">{best}</span>
        </span>
      </div>

      <div
        tabIndex={0}
        role="group"
        aria-label="Flappy game. Space, Up arrow, W, or tap to flap. P to pause."
        aria-describedby={statusId}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        className="relative aspect-2/3 w-full max-w-80 cursor-pointer touch-none overflow-hidden border-2 border-ink bg-blue-soft shadow-brutal-lg select-none"
      >
        <canvas ref={canvasRef} aria-hidden className="block size-full" />

        {status !== "ready" && (
          <div className="pointer-events-none absolute inset-x-0 top-5 flex justify-center">
            <span className="border-2 border-ink bg-paper-raised px-3 py-0.5 font-display text-3xl tabular-nums shadow-brutal-sm">
              {score}
            </span>
          </div>
        )}

        {(status !== "playing" || paused) && (
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="flex w-full max-w-56 flex-col items-center gap-3 border-2 border-ink bg-paper-raised p-5 text-center shadow-brutal">
              {status === "ready" && (
                <>
                  <p className="font-display text-2xl leading-none tracking-tight">Flappy</p>
                  <p className="text-sm text-ink-muted">Fly through the gaps. Don&apos;t touch the pipes.</p>
                  <Button size="sm" onClick={start}>
                    <Play aria-hidden /> Start
                  </Button>
                </>
              )}
              {status === "playing" && paused && (
                <>
                  <p className="font-display text-2xl leading-none tracking-tight">Paused</p>
                  <Button size="sm" onClick={() => setPause(false)}>
                    <Play aria-hidden /> Resume
                  </Button>
                </>
              )}
              {status === "over" && (
                <>
                  <p className="font-display text-2xl leading-none tracking-tight">Game over</p>
                  <dl className="grid w-full grid-cols-2 gap-0.5 border-2 border-ink bg-ink font-mono text-xs uppercase">
                    <div className="bg-pink-soft py-2">
                      <dt className="text-ink-muted">Score</dt>
                      <dd className="font-display text-2xl normal-case">{score}</dd>
                    </div>
                    <div className="bg-lime-soft py-2">
                      <dt className="text-ink-muted">Best</dt>
                      <dd className="font-display text-2xl normal-case">{Math.max(best, score)}</dd>
                    </div>
                  </dl>
                  <Button size="sm" onClick={start}>
                    <RotateCcw aria-hidden /> Play again
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
