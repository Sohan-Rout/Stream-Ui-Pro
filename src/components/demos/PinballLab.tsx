"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownToLine, CircleDot, Pause, Play, RotateCcw } from "lucide-react";
import { Button, type ButtonProps } from "@streamuilib/react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/games/best-score";
import {
  BALL_R,
  BUMPERS,
  FLIPPER,
  LANE,
  PIVOTS,
  SLINGS,
  TABLE,
  WALLS,
  createGame,
  flipperTip,
  step,
  type Input,
  type PinballGame,
  type Status,
} from "@/lib/games/pinball";

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const LINE = 3;

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, shadow = 0) {
  if (shadow) {
    ctx.beginPath();
    ctx.arc(x + shadow, y + shadow, r, 0, Math.PI * 2);
    ctx.fillStyle = brand.ink;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = LINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();
}

function line(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, width: number, color: string = brand.ink) {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.stroke();
}

const BUMPER_TONES = [brand.pink, brand.blue, brand.lime];

function draw(ctx: CanvasRenderingContext2D, game: PinballGame) {
  // Table: paper with a dot grid, the lane tinted.
  ctx.fillStyle = brand.paper;
  ctx.fillRect(0, 0, TABLE.width, TABLE.height);
  ctx.fillStyle = brand.faint;
  for (let x = 16; x < TABLE.width; x += 16) for (let y = 16; y < TABLE.height; y += 16) ctx.fillRect(x - 1, y - 1, 2, 2);
  ctx.fillStyle = brand.violetSoft;
  ctx.fillRect(LANE.left, LANE.top, LANE.right - LANE.left, TABLE.height - LANE.top);

  for (const w of WALLS) line(ctx, w.a.x, w.a.y, w.b.x, w.b.y, 5);

  // Slingshots: thick orange bars that flash white when hit.
  for (const s of SLINGS) {
    line(ctx, s.a.x + 3, s.a.y + 3, s.b.x + 3, s.b.y + 3, 12);
    line(ctx, s.a.x, s.a.y, s.b.x, s.b.y, 12);
    line(ctx, s.a.x, s.a.y, s.b.x, s.b.y, 6, game.lit[s.id!] ? brand.raised : brand.orange);
  }

  // Pop bumpers: a hard shadow, a colored cap, and a flash ring on a hit.
  BUMPERS.forEach((b, i) => {
    const hit = game.lit[`bumper-${i}`];
    circle(ctx, b.x, b.y, b.r, hit ? brand.raised : BUMPER_TONES[i % BUMPER_TONES.length], 5);
    circle(ctx, b.x, b.y, b.r * 0.45, brand.raised);
    if (hit) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r + 6, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = brand.ink;
      ctx.stroke();
    }
  });

  // Flippers: lime capsules with an ink outline, on ink pivots.
  for (const side of ["left", "right"] as const) {
    const p = PIVOTS[side];
    const tip = flipperTip(side, game.flippers[side].angle);
    line(ctx, p.x, p.y, tip.x, tip.y, FLIPPER.radius * 2 + LINE * 2);
    line(ctx, p.x, p.y, tip.x, tip.y, FLIPPER.radius * 2, brand.lime);
    circle(ctx, p.x, p.y, 3, brand.ink);
  }

  // Plunger: a spring that squashes as it's pulled back.
  const springTop = LANE.plungerY + game.charge * 14;
  const mid = (LANE.left + LANE.right) / 2;
  for (let i = 0; i < 4; i++) {
    const y = springTop + 4 + i * ((TABLE.height - 10 - springTop) / 4);
    line(ctx, mid - 7, y, mid + 7, y + 3, 2);
  }
  ctx.fillStyle = brand.pink;
  ctx.fillRect(LANE.left + 4, springTop, LANE.right - LANE.left - 8, 6);
  ctx.strokeStyle = brand.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(LANE.left + 4, springTop, LANE.right - LANE.left - 8, 6);

  // The ball, with a shine.
  circle(ctx, game.ball.x, game.ball.y, BALL_R, brand.raised, 2);
  ctx.beginPath();
  ctx.arc(game.ball.x - 2, game.ball.y - 2, 2, 0, Math.PI * 2);
  ctx.fillStyle = brand.blue;
  ctx.fill();
}

/* ------------------------------------------------------------------ */
/* Game                                                                */
/* ------------------------------------------------------------------ */

const LEFT = new Set(["ArrowLeft", "z", "Z", "a", "A"]);
const RIGHT = new Set(["ArrowRight", "/", "d", "D"]);
const LAUNCH = new Set([" ", "ArrowDown", "s", "S"]);

type Hud = { score: number; balls: number; status: Status };

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

export function PinballLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PinballGame>(createGame());
  const input = useRef<Input>({ left: false, right: false, launch: false });
  const [hud, setHud] = useState<Hud>({ score: 0, balls: 3, status: "ready" });
  const [best, saveBest] = useBestScore("pinball");
  const statusId = useId();

  // Physics and drawing run outside React; React state changes only with the HUD.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = TABLE.width * dpr;
      canvas.height = TABLE.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const prev = gameRef.current;
      const next = step(prev, input.current, (now - last) / 1000);
      last = now;
      gameRef.current = next;
      if (next.score !== prev.score || next.balls !== prev.balls || next.status !== prev.status) {
        setHud({ score: next.score, balls: next.balls, status: next.status });
        if (next.status === "over" && prev.status !== "over") saveBest(next.score);
      }
      if (ctx) draw(ctx, next);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [saveBest]);

  /** Show a change made outside the loop right away. */
  const sync = useCallback(() => {
    const g = gameRef.current;
    setHud({ score: g.score, balls: g.balls, status: g.status });
  }, []);

  const start = useCallback(() => {
    const g = gameRef.current;
    gameRef.current = g.status === "paused" ? { ...g, status: "playing" } : createGame("playing");
    input.current = { left: false, right: false, launch: false };
    sync();
    boardRef.current?.focus();
  }, [sync]);

  const togglePause = useCallback(() => {
    const g = gameRef.current;
    if (g.status === "playing") gameRef.current = { ...g, status: "paused" };
    else if (g.status === "paused") gameRef.current = { ...g, status: "playing" };
    sync();
  }, [sync]);

  const hold = useCallback(
    (key: keyof Input, down: boolean) => {
      if (down && gameRef.current.status !== "playing" && gameRef.current.status !== "paused") start();
      input.current[key] = down;
    },
    [start],
  );

  function onKey(e: KeyboardEvent, down: boolean) {
    const key = LEFT.has(e.key) ? "left" : RIGHT.has(e.key) ? "right" : LAUNCH.has(e.key) ? "launch" : null;
    if (key) {
      e.preventDefault();
      if (!e.repeat || !down) hold(key, down);
    } else if (down && (e.key === "p" || e.key === "P" || e.key === "Escape")) {
      e.preventDefault();
      togglePause();
    } else if (down && e.key === "Enter" && hud.status !== "playing") {
      e.preventDefault();
      start();
    }
  }

  const message =
    hud.status === "over"
      ? `Game over. Score ${hud.score}.`
      : hud.status === "paused"
        ? "Paused."
        : hud.status === "ready"
          ? "Press Start, or hold Space to pull the plunger."
          : `Score ${hud.score}. ${hud.balls} ${hud.balls === 1 ? "ball" : "balls"} left.`;

  const showOverlay = hud.status !== "playing";

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <div className="flex w-full max-w-80 items-center justify-between font-mono text-xs uppercase">
        <span>
          Score <span className="font-bold tabular-nums">{String(hud.score).padStart(5, "0")}</span>
        </span>
        <span className="flex items-center gap-1" aria-label={`${hud.balls} balls left`}>
          {Array.from({ length: 3 }, (_, i) => (
            <CircleDot key={i} aria-hidden className={cn("size-3.5", i < hud.balls ? "text-ink" : "text-ink-faint")} />
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
        aria-label="Pinball. Z or Left for the left flipper, slash or Right for the right, hold Space to launch, P to pause."
        aria-describedby={statusId}
        onKeyDown={(e) => onKey(e, true)}
        onKeyUp={(e) => onKey(e, false)}
        onBlur={() => (input.current = { left: false, right: false, launch: false })}
        className="relative aspect-2/3 w-full max-w-80 touch-none overflow-hidden border-2 border-ink bg-paper shadow-brutal-lg select-none"
      >
        <canvas ref={canvasRef} aria-hidden className="block size-full" />

        {showOverlay && (
          <div className="absolute inset-0 grid place-items-center bg-paper/60 p-6">
            <div className="flex w-full max-w-56 flex-col items-center gap-3 border-2 border-ink bg-paper-raised p-5 text-center shadow-brutal">
              <p className="font-display text-2xl leading-none tracking-tight">
                {hud.status === "over" ? "Game over" : hud.status === "paused" ? "Paused" : "Pinball"}
              </p>
              {hud.status === "ready" && (
                <p className="text-sm text-ink-muted">Hold Space to pull the plunger, let go to launch. Keep it off the drain.</p>
              )}
              {hud.status === "over" && (
                <p className="font-mono text-xs uppercase">
                  Score <span className="font-bold">{hud.score}</span>
                </p>
              )}
              <Button size="sm" onClick={hud.status === "paused" ? togglePause : start}>
                {hud.status === "over" ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                {hud.status === "paused" ? "Resume" : hud.status === "ready" ? "Start" : "Play again"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      {/* Touch controls: hold a flipper, hold Launch to pull the plunger. */}
      <div role="group" aria-label="Controls" className="grid w-full max-w-80 grid-cols-4 gap-2">
        <HoldButton variant="secondary" className="h-12 touch-none" aria-label="Left flipper" onHold={(d) => hold("left", d)}>
          L
        </HoldButton>
        <HoldButton variant="pink" className="h-12 touch-none" aria-label="Launch" onHold={(d) => hold("launch", d)}>
          <ArrowDownToLine aria-hidden />
        </HoldButton>
        <Button variant="secondary" className="h-12" aria-label={hud.status === "paused" ? "Resume" : "Pause"} onClick={togglePause}>
          {hud.status === "paused" ? <Play aria-hidden /> : <Pause aria-hidden />}
        </Button>
        <HoldButton variant="secondary" className="h-12 touch-none" aria-label="Right flipper" onHold={(d) => hold("right", d)}>
          R
        </HoldButton>
      </div>
    </div>
  );
}
