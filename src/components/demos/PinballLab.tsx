"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDownToLine, CircleDot, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button, type ButtonProps } from "@streamuilib/react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { useBestScore } from "@/lib/games/best-score";
import { NOTE, blip } from "@/lib/games/arcade-sound";
import {
  BALL_R,
  BUMPERS,
  FLIPPER,
  LANE,
  LANE_BOTTOM,
  LANE_LABELS,
  LANE_POSTS,
  LANE_TOP,
  PIVOTS,
  POSTS,
  SLINGS,
  TABLE,
  TARGETS,
  WALLS,
  createGame,
  flipperTip,
  step,
  type Input,
  type PinEvent,
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

/** Visual-only state the loop keeps beside the game: trail, score popups, banner, shake. */
type Fx = {
  trail: { x: number; y: number }[];
  popups: { x: number; y: number; text: string; age: number }[];
  banner: { text: string; fill: string; age: number } | null;
  shake: number;
  time: number;
};
const newFx = (): Fx => ({ trail: [], popups: [], banner: null, shake: 0, time: 0 });
const POPUP_LIFE = 0.8;
const BANNER_LIFE = 1.3;

type Fonts = { display: string; mono: string };

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, shadow = 3) {
  ctx.fillStyle = brand.ink;
  ctx.fillRect(x + shadow, y + shadow, w, h);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.lineWidth = 2;
  ctx.strokeStyle = brand.ink;
  ctx.strokeRect(x, y, w, h);
}

function draw(ctx: CanvasRenderingContext2D, game: PinballGame, fx: Fx, fonts: Fonts) {
  ctx.save();
  if (fx.shake > 0) {
    const m = fx.shake * 18;
    ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
  }

  // Table: paper with a dot grid, the lane tinted.
  ctx.fillStyle = brand.paper;
  ctx.fillRect(-10, -10, TABLE.width + 20, TABLE.height + 20);
  ctx.fillStyle = brand.faint;
  for (let x = 16; x < TABLE.width; x += 16) for (let y = 16; y < TABLE.height; y += 16) ctx.fillRect(x - 1, y - 1, 2, 2);
  ctx.fillStyle = brand.violetSoft;
  ctx.fillRect(LANE.left, LANE.top, LANE.right - LANE.left, TABLE.height - LANE.top);

  // The multiplier, painted on the playfield between the slings.
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `28px ${fonts.display}`;
  ctx.fillStyle = game.mult > 1 ? brand.ink : "rgba(14,15,20,0.12)";
  ctx.fillText(`×${game.mult}`, 142, 300);

  // S/UI rollover lanes: a light in each, lit lime once rolled over.
  LANE_LABELS.forEach((label, i) => {
    const cx = (LANE_POSTS[i] + LANE_POSTS[i + 1]) / 2;
    const flash = game.lit[`lane-${i}`];
    const on = game.lanes[i];
    box(ctx, cx - 9, (LANE_TOP + LANE_BOTTOM) / 2 - 9, 18, 18, flash ? brand.raised : on ? brand.lime : brand.paper, on ? 2 : 0);
    ctx.font = `bold 11px ${fonts.mono}`;
    ctx.fillStyle = on || flash ? brand.ink : brand.muted;
    ctx.fillText(label, cx, (LANE_TOP + LANE_BOTTOM) / 2 + 1);
  });
  for (const p of POSTS) line(ctx, p.a.x, p.a.y, p.b.x, p.b.y, 5);

  for (const w of WALLS) line(ctx, w.a.x, w.a.y, w.b.x, w.b.y, 5);

  // Drop targets: pink blocks with a hard shadow; knocked-down ones leave an outline.
  TARGETS.forEach((t, i) => {
    const y = t.a.y;
    const h = t.b.y - t.a.y;
    if (game.targets[i]) {
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = brand.muted;
      ctx.strokeRect(t.a.x - 4, y, 8, h);
      ctx.setLineDash([]);
    } else {
      box(ctx, t.a.x - 4, y, 8, h, brand.pink, 2);
    }
  });

  // Slingshots: thick orange bars that flash white when hit.
  for (const s of SLINGS) {
    line(ctx, s.a.x + 3, s.a.y + 3, s.b.x + 3, s.b.y + 3, 12);
    line(ctx, s.a.x, s.a.y, s.b.x, s.b.y, 12);
    line(ctx, s.a.x, s.a.y, s.b.x, s.b.y, 6, game.lit[s.id!] ? brand.raised : brand.orange);
  }

  // Pop bumpers: a hard shadow, a colored cap that swells and flashes on a hit.
  BUMPERS.forEach((b, i) => {
    const hit = game.lit[`bumper-${i}`];
    const r = hit ? b.r * 1.12 : b.r;
    circle(ctx, b.x, b.y, r, hit ? brand.raised : BUMPER_TONES[i % BUMPER_TONES.length], 5);
    circle(ctx, b.x, b.y, r * 0.45, hit ? BUMPER_TONES[i % BUMPER_TONES.length] : brand.raised);
    if (hit) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, r + 7, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = brand.ink;
      ctx.stroke();
    }
  });

  // Flippers: lime capsules with a hard shadow and an ink outline, on ink pivots.
  for (const side of ["left", "right"] as const) {
    const p = PIVOTS[side];
    const tip = flipperTip(side, game.flippers[side].angle);
    line(ctx, p.x + 3, p.y + 3, tip.x + 3, tip.y + 3, FLIPPER.radius * 2 + LINE * 2);
    line(ctx, p.x, p.y, tip.x, tip.y, FLIPPER.radius * 2 + LINE * 2);
    line(ctx, p.x, p.y, tip.x, tip.y, FLIPPER.radius * 2, brand.lime);
    circle(ctx, p.x, p.y, 3, brand.ink);
  }

  // Ball save: a blinking tag over the drain while it's active.
  if (game.ballSave > 0 && !game.onPlunger && Math.floor(fx.time * 4) % 2 === 0) {
    box(ctx, 132, 452, 56, 18, brand.blue, 2);
    ctx.font = `bold 10px ${fonts.mono}`;
    ctx.fillStyle = brand.ink;
    ctx.fillText("SAVE", 160, 462);
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

  // The ball's trail, then the ball with a shine.
  fx.trail.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, BALL_R * (0.35 + (0.5 * i) / fx.trail.length), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(14,15,20,${(0.18 * (i + 1)) / fx.trail.length})`;
    ctx.fill();
  });
  circle(ctx, game.ball.x, game.ball.y, BALL_R, brand.raised, 2);
  ctx.beginPath();
  ctx.arc(game.ball.x - 2, game.ball.y - 2, 2, 0, Math.PI * 2);
  ctx.fillStyle = brand.blue;
  ctx.fill();

  // Score popups float up and fade.
  ctx.font = `bold 12px ${fonts.mono}`;
  ctx.lineJoin = "round";
  for (const p of fx.popups) {
    const k = p.age / POPUP_LIFE;
    ctx.globalAlpha = 1 - k * k;
    const y = p.y - 26 * k;
    ctx.lineWidth = 4;
    ctx.strokeStyle = brand.paper;
    ctx.strokeText(p.text, p.x, y);
    ctx.fillStyle = brand.ink;
    ctx.fillText(p.text, p.x, y);
  }
  ctx.globalAlpha = 1;

  // Banner for the big moments: pops in, holds, then drops away.
  if (fx.banner) {
    const { text, fill, age } = fx.banner;
    const pop = Math.min(1, age / 0.15);
    const scale = 0.6 + 0.4 * (1 - Math.pow(1 - pop, 3)) + (pop < 1 ? 0 : 0.04 * Math.sin(Math.min(1, (age - 0.15) / 0.2) * Math.PI));
    const fade = age > BANNER_LIFE - 0.2 ? (BANNER_LIFE - age) / 0.2 : 1;
    ctx.save();
    ctx.globalAlpha = Math.max(0, fade);
    ctx.translate(TABLE.width / 2 - 18, 262);
    ctx.scale(scale, scale);
    ctx.rotate(-0.04);
    ctx.font = `22px ${fonts.display}`;
    const w = ctx.measureText(text).width + 28;
    box(ctx, -w / 2, -20, w, 40, fill, 4);
    ctx.fillStyle = brand.ink;
    ctx.fillText(text, 0, 1);
    ctx.restore();
  }

  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Game                                                                */
/* ------------------------------------------------------------------ */

const LEFT = new Set(["ArrowLeft", "z", "Z", "a", "A"]);
const RIGHT = new Set(["ArrowRight", "/", "d", "D"]);
const LAUNCH = new Set([" ", "ArrowDown", "s", "S"]);

type Hud = { score: number; balls: number; status: Status; mult: number };

const BANNERS: Partial<Record<PinEvent["kind"], { text: string; fill: string }>> = {
  bank: { text: "BANK CLEARED", fill: brand.pink },
  save: { text: "BALL SAVED", fill: brand.blue },
  extra: { text: "EXTRA BALL", fill: brand.orange },
  drain: { text: "DRAINED", fill: brand.raised },
};

/** Each event's sound, all in C major. */
function sound(e: PinEvent) {
  switch (e.kind) {
    case "bumper": return blip([{ f: NOTE.G5, dur: 0.07, to: NOTE.C6 }]);
    case "sling": return blip([{ f: NOTE.E5, dur: 0.05, gain: 0.035 }]);
    case "lane": return blip([{ f: NOTE.C6, dur: 0.06 }, { f: NOTE.E6, at: 0.05, dur: 0.08 }]);
    case "target": return blip([{ f: NOTE.C5, dur: 0.09, type: "triangle", gain: 0.12 }]);
    case "flip": return blip([{ f: 140, dur: 0.04, type: "triangle", gain: 0.08 }]);
    case "launch": return blip([{ f: NOTE.C4, dur: 0.25, to: NOTE.C6, type: "triangle", gain: 0.08 }]);
    case "bank": return blip([NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].map((f, i) => ({ f, at: i * 0.07, dur: 0.12 })));
    case "mult": return blip([NOTE.G5, NOTE.C6, NOTE.E6, NOTE.G6].map((f, i) => ({ f, at: 0.3 + i * 0.06, dur: 0.1, gain: 0.04 })));
    case "save": return blip([{ f: NOTE.E5, dur: 0.1 }, { f: NOTE.A5, at: 0.1, dur: 0.15 }]);
    case "extra": return blip([NOTE.C5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.C6, NOTE.E6].map((f, i) => ({ f, at: i * 0.08, dur: 0.1 })));
    case "drain": return blip([{ f: NOTE.G4, dur: 0.5, to: 110, type: "triangle", gain: 0.12 }]);
    case "over": return blip([NOTE.G4, NOTE.E4, NOTE.C4].map((f, i) => ({ f, at: i * 0.18, dur: 0.22, type: "triangle", gain: 0.12 })));
  }
}

/** Fold one step's events into the visual effects. */
function applyFx(fx: Fx, events: PinEvent[], reduceMotion: boolean) {
  for (const e of events) {
    if ("points" in e && "x" in e) fx.popups.push({ x: e.x, y: e.y - 6, text: `+${e.points}`, age: 0 });
    if (e.kind === "mult") fx.banner = { text: `×${e.mult} MULTIPLIER`, fill: brand.lime, age: 0 };
    else if (BANNERS[e.kind] && !(e.kind === "drain" && fx.banner)) fx.banner = { ...BANNERS[e.kind]!, age: 0 };
    if (!reduceMotion && (e.kind === "bumper" || e.kind === "bank" || e.kind === "drain")) fx.shake = Math.max(fx.shake, e.kind === "bumper" ? 0.12 : 0.25);
  }
}

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
  const [hud, setHud] = useState<Hud>({ score: 0, balls: 3, status: "ready", mult: 1 });
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const fxRef = useRef<Fx>(newFx());
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
    const css = getComputedStyle(document.documentElement);
    const fonts: Fonts = {
      display: css.getPropertyValue("--font-archivo-black").trim() || "sans-serif",
      mono: css.getPropertyValue("--font-space-mono").trim() || "monospace",
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fx = fxRef.current;
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      const prev = gameRef.current;
      const next = step(prev, input.current, (now - last) / 1000);
      last = now;
      gameRef.current = next;
      if (next !== prev) {
        applyFx(fx, next.events, reduceMotion);
        if (!mutedRef.current) next.events.forEach(sound);
      }
      if (next.score !== prev.score || next.balls !== prev.balls || next.status !== prev.status || next.mult !== prev.mult) {
        setHud({ score: next.score, balls: next.balls, status: next.status, mult: next.mult });
        if (next.status === "over" && prev.status !== "over") saveBest(next.score);
      }
      // Effects age only while the table runs, so a pause freezes them too.
      if (next.status === "playing") {
        fx.time += dt;
        fx.popups = fx.popups.filter((p) => (p.age += dt) < POPUP_LIFE);
        if (fx.banner && (fx.banner.age += dt) >= BANNER_LIFE) fx.banner = null;
        fx.shake = Math.max(0, fx.shake - dt);
        if (!reduceMotion && !next.onPlunger) fx.trail = [...fx.trail, { x: next.ball.x, y: next.ball.y }].slice(-7);
        else fx.trail = [];
      }
      if (ctx) draw(ctx, next, fx, fonts);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [saveBest]);

  /** Show a change made outside the loop right away. */
  const sync = useCallback(() => {
    const g = gameRef.current;
    setHud({ score: g.score, balls: g.balls, status: g.status, mult: g.mult });
  }, []);

  const start = useCallback(() => {
    const g = gameRef.current;
    if (g.status !== "paused") Object.assign(fxRef.current, newFx());
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
        <span
          aria-label={`Multiplier ${hud.mult}`}
          className={cn("border-2 border-ink px-1 font-bold tabular-nums", hud.mult > 1 ? "bg-lime text-on-bright" : "text-ink-muted")}
        >
          ×{hud.mult}
        </span>
        <span className="text-ink-muted">
          Best <span className="font-bold text-ink tabular-nums">{best}</span>
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
                <p className="text-sm text-ink-muted">Hold Space to launch. Light the S/UI lanes and drop the pink targets to raise the multiplier.</p>
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
