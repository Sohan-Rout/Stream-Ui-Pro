"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowBigUp, ChevronLeft, ChevronRight, Heart, Pause, Play, RotateCcw } from "lucide-react";
import { Button, type ButtonProps } from "@streamuilib/react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/games/best-score";
import {
  FLAG_X,
  LEVEL_H,
  PLAYER,
  TILE,
  VIEW,
  WALKER,
  cameraX,
  createGame,
  step,
  type Input,
  type JumperGame,
  type Status,
  type Tile,
} from "@/lib/games/jumper";

const LINE = 2.5;

/* ------------------------------------------------------------------ */
/* Drawing: neo-brutalist shapes on a 2D canvas                        */
/* ------------------------------------------------------------------ */

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, shadow = 0, radius = 0) {
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

function drawBackdrop(ctx: CanvasRenderingContext2D, cam: number) {
  ctx.fillStyle = brand.blueSoft;
  ctx.fillRect(0, 0, VIEW.width, VIEW.height);
  // Hills and clouds scroll slower than the level, for depth.
  for (let i = 0; i < 6; i++) {
    const x = i * 260 - ((cam * 0.3) % 260) - 40;
    ctx.beginPath();
    ctx.ellipse(x + 80, 10 * TILE, 90, 54, 0, Math.PI, 0);
    ctx.fillStyle = brand.limeSoft;
    ctx.fill();
    ctx.lineWidth = LINE;
    ctx.strokeStyle = brand.ink;
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const x = i * 190 - ((cam * 0.15) % 190) - 30;
    box(ctx, x, 30 + (i % 2) * 34, 64, 20, brand.raised, 3, 10);
  }
}

function drawTile(ctx: CanvasRenderingContext2D, t: Tile, x: number, y: number, above: Tile, time: number) {
  const s = TILE;
  switch (t) {
    case "#": {
      ctx.fillStyle = brand.orange;
      ctx.fillRect(x, y, s, s);
      ctx.fillStyle = brand.ink;
      ctx.globalAlpha = 0.25;
      ctx.fillRect(x, y + s / 2, s, 2);
      ctx.fillRect(x + (Math.floor(y / s) % 2 ? s / 2 : 0), y, 2, s / 2);
      ctx.globalAlpha = 1;
      if (above !== "#") {
        ctx.fillStyle = brand.lime;
        ctx.fillRect(x, y, s, 7);
        ctx.fillStyle = brand.ink;
        ctx.fillRect(x, y, s, LINE);
        ctx.fillRect(x, y + 7, s, 2);
      }
      return;
    }
    case "=":
      box(ctx, x, y, s, s, brand.orange);
      ctx.fillStyle = brand.ink;
      ctx.fillRect(x, y + s / 2 - 1, s, 2);
      ctx.fillRect(x + s / 2 - 1, y, 2, s / 2);
      ctx.fillRect(x + s / 4, y + s / 2, 2, s / 2);
      return;
    case "!":
    case "u":
      box(ctx, x + 1, y + 1, s - 2, s - 2, t === "!" ? brand.lime : brand.sunken, 0, 3);
      if (t === "!") {
        ctx.fillStyle = brand.ink;
        ctx.font = "bold 16px 'Space Mono', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("!", x + s / 2, y + s / 2 + 1);
      }
      return;
    case "P": {
      const cap = above !== "P";
      if (cap) box(ctx, x - 2, y, s + 4, 10, brand.lime);
      box(ctx, x + 2, y + (cap ? 10 : 0), s - 4, s - (cap ? 10 : 0), brand.lime);
      return;
    }
    case "S":
      box(ctx, x + 1, y + 1, s - 2, s - 2, brand.raised, 0, 2);
      ctx.fillStyle = brand.faint;
      ctx.fillRect(x + 5, y + 5, s - 10, s - 10);
      return;
    case "c": {
      const w = 5 + Math.abs(Math.sin(time * 4 + x * 0.05)) * 6;
      ctx.beginPath();
      ctx.ellipse(x + s / 2, y + s / 2, w, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = brand.orange;
      ctx.fill();
      ctx.lineWidth = LINE;
      ctx.strokeStyle = brand.ink;
      ctx.stroke();
      return;
    }
  }
}

function drawFlag(ctx: CanvasRenderingContext2D, cam: number) {
  const x = FLAG_X * TILE + TILE / 2 - cam;
  if (x < -40 || x > VIEW.width + 40) return;
  ctx.fillStyle = brand.ink;
  ctx.fillRect(x - 2, 2 * TILE, 4, 8 * TILE);
  ctx.beginPath();
  ctx.moveTo(x + 2, 2 * TILE + 6);
  ctx.lineTo(x + 34, 2 * TILE + 18);
  ctx.lineTo(x + 2, 2 * TILE + 30);
  ctx.closePath();
  ctx.fillStyle = brand.pink;
  ctx.fill();
  ctx.lineWidth = LINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();
  box(ctx, x - 6, 2 * TILE - 10, 12, 12, brand.lime, 0, 6);
}

function drawWalker(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
  const stepUp = Math.sin(time * 10 + x) > 0 ? 2 : 0;
  box(ctx, x + 2, y + WALKER.h - 5 - stepUp, 6, 5, brand.ink);
  box(ctx, x + WALKER.w - 8, y + WALKER.h - 5 - (2 - stepUp), 6, 5, brand.ink);
  box(ctx, x, y, WALKER.w, WALKER.h - 4, brand.pink, 0, 8);
  ctx.fillStyle = brand.raised;
  ctx.fillRect(x + 4, y + 5, 5, 5);
  ctx.fillRect(x + 11, y + 5, 5, 5);
  ctx.fillStyle = brand.ink;
  ctx.fillRect(x + 5, y + 7, 2, 3);
  ctx.fillRect(x + 12, y + 7, 2, 3);
}

function drawPlayer(ctx: CanvasRenderingContext2D, game: JumperGame, cam: number, time: number) {
  const p = game.player;
  // Blink while respawn-safe.
  if (game.safeFor > 0 && Math.floor(time * 12) % 2 === 0) return;
  const x = p.x - cam;
  const y = p.y;
  const running = p.onGround && Math.abs(p.vx) > 10;
  const kick = running && Math.sin(time * 18) > 0 ? 2 : 0;
  box(ctx, x + 1, y + PLAYER.h - 5, 7, 5, brand.pink, 0, 2);
  box(ctx, x + PLAYER.w - 8, y + PLAYER.h - 5 - kick, 7, 5, brand.pink, 0, 2);
  box(ctx, x, y, PLAYER.w, PLAYER.h - 4, brand.lime, 2, 3);
  const eye = p.facing > 0 ? x + 10 : x + 3;
  ctx.fillStyle = brand.ink;
  ctx.fillRect(eye, y + 5, 3, 5);
  ctx.fillRect(eye + 4, y + 5, 3, 5);
}

function draw(ctx: CanvasRenderingContext2D, game: JumperGame, time: number) {
  const cam = cameraX(game);
  drawBackdrop(ctx, cam);
  const from = Math.floor(cam / TILE);
  for (let ty = 0; ty < LEVEL_H; ty++) {
    for (let tx = from; tx <= from + Math.ceil(VIEW.width / TILE); tx++) {
      const t = game.grid[ty]?.[tx];
      if (!t || t === " ") continue;
      drawTile(ctx, t, tx * TILE - cam, ty * TILE, game.grid[ty - 1]?.[tx] ?? " ", time);
    }
  }
  drawFlag(ctx, cam);
  for (const w of game.walkers) if (w.alive) drawWalker(ctx, w.x - cam, w.y, time);
  if (game.status !== "dead" || Math.floor(time * 8) % 2 === 0) drawPlayer(ctx, game, cam, time);
}

/* ------------------------------------------------------------------ */
/* Game                                                                */
/* ------------------------------------------------------------------ */

const LEFT = new Set(["ArrowLeft", "a", "A"]);
const RIGHT = new Set(["ArrowRight", "d", "D"]);
const JUMP = new Set([" ", "ArrowUp", "w", "W"]);

type Hud = { score: number; coins: number; lives: number; status: Status };
type HoldKey = "left" | "right" | "jump";

/** An on-screen button held while pressed: down on press, up on lift, leave, or cancel. */
function HoldButton({ onHold, ...props }: { onHold: (down: boolean) => void } & Omit<ButtonProps, "onPointerDown">) {
  return (
    <Button
      {...props}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
      onLostPointerCapture={() => onHold(false)}
    />
  );
}

export function JumperLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<JumperGame>(createGame());
  const input = useRef<Input>({ left: false, right: false, jump: false, jumpPressed: false });
  const [hud, setHud] = useState<Hud>({ score: 0, coins: 0, lives: 3, status: "ready" });
  const [best, saveBest] = useBestScore("jumper");
  const statusId = useId();

  // The loop runs outside React; React state changes only when the HUD does.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = VIEW.width * dpr;
      canvas.height = VIEW.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const seconds = (now - last) / 1000;
      last = now;
      const prev = gameRef.current;
      const next = step(prev, input.current, seconds);
      input.current.jumpPressed = false;
      gameRef.current = next;
      if (next.score !== prev.score || next.coins !== prev.coins || next.lives !== prev.lives || next.status !== prev.status) {
        setHud({ score: next.score, coins: next.coins, lives: next.lives, status: next.status });
        if ((next.status === "over" || next.status === "won") && next.status !== prev.status) saveBest(next.score);
      }
      if (ctx) draw(ctx, next, now / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [saveBest]);

  /** Show a change made outside the loop right away, without waiting for the next frame. */
  const sync = useCallback(() => {
    const g = gameRef.current;
    setHud({ score: g.score, coins: g.coins, lives: g.lives, status: g.status });
  }, []);

  const start = useCallback(() => {
    const g = gameRef.current;
    gameRef.current = g.status === "paused" ? { ...g, status: "playing" } : createGame("playing");
    input.current = { left: false, right: false, jump: false, jumpPressed: false };
    sync();
    boardRef.current?.focus();
  }, [sync]);

  const togglePause = useCallback(() => {
    const g = gameRef.current;
    if (g.status === "playing") gameRef.current = { ...g, status: "paused" };
    else if (g.status === "paused") gameRef.current = { ...g, status: "playing" };
    sync();
  }, [sync]);

  function onKey(e: KeyboardEvent, down: boolean) {
    const status = gameRef.current.status;
    if (LEFT.has(e.key)) input.current.left = down;
    else if (RIGHT.has(e.key)) input.current.right = down;
    else if (JUMP.has(e.key)) {
      if (down && !e.repeat) {
        if (status === "ready" || status === "over" || status === "won") start();
        input.current.jumpPressed = true;
      }
      input.current.jump = down;
    } else if (down && (e.key === "p" || e.key === "P" || e.key === "Escape")) togglePause();
    else if (down && e.key === "Enter" && status !== "playing") start();
    else return;
    e.preventDefault();
  }

  const hold = useCallback(
    (key: HoldKey, down: boolean) => {
      if (down && key === "jump") {
        const status = gameRef.current.status;
        if (status === "ready" || status === "over" || status === "won") start();
        input.current.jumpPressed = true;
      }
      input.current[key] = down;
    },
    [start],
  );

  const message =
    hud.status === "over"
      ? `Game over. Score ${hud.score}, ${hud.coins} coins.`
      : hud.status === "won"
        ? `You reached the flag! Score ${hud.score}.`
        : hud.status === "paused"
          ? "Paused."
          : hud.status === "dead"
            ? `Ouch. ${hud.lives} ${hud.lives === 1 ? "life" : "lives"} left.`
            : hud.status === "ready"
              ? "Press Space, or the jump button, to start."
              : `Score ${hud.score}. Coins ${hud.coins}.`;

  const showOverlay = hud.status === "ready" || hud.status === "over" || hud.status === "won" || hud.status === "paused";

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <div className="flex w-full max-w-96 items-center justify-between font-mono text-xs uppercase">
        <span>
          Score <span className="font-bold tabular-nums">{String(hud.score).padStart(5, "0")}</span>
        </span>
        <span>
          Coins ×<span className="font-bold tabular-nums">{String(hud.coins).padStart(2, "0")}</span>
        </span>
        <span className="flex items-center gap-1" aria-label={`${hud.lives} lives`}>
          {Array.from({ length: 3 }, (_, i) => (
            <Heart key={i} aria-hidden className={cn("size-3.5", i < hud.lives ? "fill-pink text-ink" : "text-ink-faint")} />
          ))}
        </span>
        <span className="text-ink-muted">
          Best <span className="font-bold text-ink tabular-nums">{best}</span>
        </span>
      </div>

      <div
        ref={boardRef}
        tabIndex={0}
        role="group"
        aria-label="Jumper. Left and right arrows or A and D to run, Space or Up to jump, P to pause."
        aria-describedby={statusId}
        onKeyDown={(e) => onKey(e, true)}
        onKeyUp={(e) => onKey(e, false)}
        onBlur={() => (input.current = { left: false, right: false, jump: false, jumpPressed: false })}
        className="relative aspect-10/9 w-full max-w-96 touch-none overflow-hidden border-2 border-ink bg-blue-soft shadow-brutal-lg select-none"
      >
        <canvas ref={canvasRef} aria-hidden className="block size-full" />

        {showOverlay && (
          <div className="absolute inset-0 grid place-items-center bg-paper/50 p-6">
            <div className="flex w-full max-w-60 flex-col items-center gap-3 border-2 border-ink bg-paper-raised p-5 text-center shadow-brutal">
              <p className="font-display text-2xl leading-none tracking-tight">
                {hud.status === "over" ? "Game over" : hud.status === "won" ? "You made it!" : hud.status === "paused" ? "Paused" : "Jumper"}
              </p>
              {hud.status === "ready" && (
                <p className="text-sm text-ink-muted">Run to the flag. Bump blocks, grab coins, stomp the walkers.</p>
              )}
              {(hud.status === "over" || hud.status === "won") && (
                <p className="font-mono text-xs uppercase">
                  Score <span className="font-bold">{hud.score}</span> · Coins <span className="font-bold">{hud.coins}</span>
                </p>
              )}
              <Button size="sm" onClick={hud.status === "paused" ? togglePause : start}>
                {hud.status === "over" || hud.status === "won" ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                {hud.status === "paused" ? "Resume" : hud.status === "ready" ? "Start" : "Play again"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      {/* Touch controls: hold to run, tap to jump. The keyboard works on the focused game. */}
      <div role="group" aria-label="Controls" className="flex w-full max-w-96 items-center justify-between gap-2">
        <div className="flex gap-2">
          <HoldButton size="icon" variant="secondary" className="size-12 touch-none" aria-label="Run left" onHold={(d) => hold("left", d)}>
            <ChevronLeft aria-hidden />
          </HoldButton>
          <HoldButton size="icon" variant="secondary" className="size-12 touch-none" aria-label="Run right" onHold={(d) => hold("right", d)}>
            <ChevronRight aria-hidden />
          </HoldButton>
        </div>
        <Button size="icon" variant="secondary" className="size-10" aria-label={hud.status === "paused" ? "Resume" : "Pause"} onClick={togglePause}>
          {hud.status === "paused" ? <Play aria-hidden /> : <Pause aria-hidden />}
        </Button>
        <HoldButton size="icon" variant="pink" className="size-12 touch-none" aria-label="Jump" onHold={(d) => hold("jump", d)}>
          <ArrowBigUp aria-hidden />
        </HoldButton>
      </div>
    </div>
  );
}
