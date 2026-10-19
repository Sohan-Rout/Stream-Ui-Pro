"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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
type Pt = readonly [number, number];

const OUTLINE = 2.5;

/** Fill and outline a closed polygon, with a hard ink shadow behind it. */
function shape(ctx: CanvasRenderingContext2D, pts: readonly Pt[], fill: string, shadow = 3) {
  const path = () => {
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
  };
  ctx.lineJoin = "round";
  if (shadow) {
    ctx.save();
    ctx.translate(shadow, shadow);
    path();
    ctx.fillStyle = brand.ink;
    ctx.fill();
    ctx.restore();
  }
  path();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = OUTLINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();
}

/** Repeat a layer across the strip, scrolled by `offset`. */
function tiled(offset: number, span: number, drawAt: (x: number) => void) {
  const start = -(((offset % span) + span) % span);
  for (let x = start; x < WORLD.width + span; x += span) drawAt(x);
}

/**
 * A puffy cloud: three bumps on a flat base, with a hard shadow. Every part is
 * stroked thick, then filled on top, so only the outer edge keeps an outline.
 */
function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  const parts = (dx: number, dy: number) => {
    ctx.beginPath();
    ctx.arc(x + dx + 14 * s, y + dy + 13 * s, 10 * s, 0, Math.PI * 2);
    ctx.moveTo(x + dx + 44 * s, y + dy + 8 * s);
    ctx.arc(x + dx + 30 * s, y + dy + 8 * s, 14 * s, 0, Math.PI * 2);
    ctx.moveTo(x + dx + 57 * s, y + dy + 13 * s);
    ctx.arc(x + dx + 48 * s, y + dy + 13 * s, 9 * s, 0, Math.PI * 2);
    ctx.rect(x + dx + 5 * s, y + dy + 12 * s, 52 * s, 10 * s);
  };
  parts(3, 3);
  ctx.fillStyle = brand.ink;
  ctx.fill();
  ctx.lineWidth = OUTLINE * 2;
  ctx.strokeStyle = brand.ink;
  ctx.lineJoin = "round";
  ctx.stroke();
  parts(0, 0);
  ctx.stroke();
  ctx.fillStyle = brand.raised;
  ctx.fill();
}

/*
 * The dino, standing, in a 60×56 box: big head and snout, tiny arm, two
 * legs, and a long tail. `a` and `b` lift the front and back foot for the
 * run cycle. Ducking squashes the same outline into the duck box.
 */
function dinoOutline(a: number, b: number): Pt[] {
  return [
    [28, 0], [55, 0], [60, 5], [60, 18], [48, 18], [48, 22], [56, 22], [56, 27], [42, 27], // head and jaw
    [42, 31], [50, 31], [50, 35], [42, 35], // arm
    [42, 47], [42, 56 - a], [34, 56 - a], [34, 49], // front leg
    [26, 49], [26, 56 - b], [18, 56 - b], [18, 47], // back leg
    [9, 41], [0, 26], [4, 25], [14, 32], // tail
    [20, 27], [28, 19], // back up to the neck
  ];
}
const SPIKES: Pt[][] = [
  [[6, 27], [8, 20], [12, 29]],
  [[13, 30], [15, 22], [19, 27]],
  [[20, 26], [22, 17], [26, 21]],
];

function dino(ctx: CanvasRenderingContext2D, game: Game, time: number) {
  const box = dinoBox(game);
  const dead = game.status === "over";
  const duck = box.h < DINO.h;
  const running = game.height === 0 && game.status === "playing";
  const phase = running ? Math.floor(game.distance / 26) % 2 : 0;
  const sx = box.w / DINO.w;
  const sy = box.h / DINO.h;
  const at = (pts: readonly Pt[]): Pt[] => pts.map(([x, y]) => [box.x + x * sx, box.y + y * sy]);

  for (const spike of SPIKES) shape(ctx, at(spike), brand.pink, 0);
  shape(ctx, at(dinoOutline(phase ? 5 : 0, phase ? 0 : 5)), brand.lime, 4);

  // Belly stripe, eye, cheek, and a nostril.
  const [[bx, by]] = at([[30, 36]]);
  ctx.fillStyle = brand.limeSoft;
  ctx.fillRect(bx, by, 9 * sx, 10 * sy);
  const [[ex, ey]] = at([[45, 5]]);
  const es = 8 * Math.min(sx, 1);
  ctx.fillStyle = brand.raised;
  ctx.fillRect(ex, ey, es, es);
  ctx.lineWidth = 2;
  ctx.strokeStyle = brand.ink;
  ctx.strokeRect(ex, ey, es, es);
  if (dead) {
    ctx.beginPath();
    ctx.moveTo(ex + 1.5, ey + 1.5);
    ctx.lineTo(ex + es - 1.5, ey + es - 1.5);
    ctx.moveTo(ex + es - 1.5, ey + 1.5);
    ctx.lineTo(ex + 1.5, ey + es - 1.5);
    ctx.stroke();
  } else {
    const blink = Math.floor(time * 10) % 45 === 0;
    ctx.fillStyle = brand.ink;
    ctx.fillRect(ex + es / 2, ey + (blink ? es / 2 : 2), 3, blink ? 1.5 : es - 4);
  }
  const [[cx, cy]] = at([[50, 13]]);
  ctx.fillStyle = brand.pink;
  ctx.fillRect(cx, cy, 6, 3);
  const [[nx, ny]] = at([[56, 5]]);
  ctx.fillStyle = brand.ink;
  ctx.fillRect(nx, ny, 2, 2);
  if (duck && running) {
    // Speed lines behind a crouching dash.
    ctx.strokeStyle = brand.muted;
    ctx.lineWidth = 2;
    for (const dy of [6, 14, 22]) {
      ctx.beginPath();
      ctx.moveTo(box.x - 16 - (dy % 8), box.y + dy);
      ctx.lineTo(box.x - 4, box.y + dy);
      ctx.stroke();
    }
  }
}

/** A cactus: a trunk with an arm or two, pink with white spines. */
function cactus(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const t = Math.max(10, w * 0.45); // trunk width
  const tx = x + (w - t) / 2;
  shape(ctx, [[tx, y + 3], [tx + 3, y], [tx + t - 3, y], [tx + t, y + 3], [tx + t, y + h], [tx, y + h]], brand.pink);
  // Arms: left one higher, right one lower.
  const arm = (side: -1 | 1, top: number) => {
    const ax = side < 0 ? x : tx + t;
    const aw = side < 0 ? tx - x : x + w - (tx + t);
    if (aw < 3) return;
    const pts: Pt[] =
      side < 0
        ? [[ax, top], [ax + 6, top], [ax + 6, top + h * 0.2], [tx, top + h * 0.2], [tx, top + h * 0.2 + 7], [ax, top + h * 0.2 + 7]]
        : [[ax + aw - 6, top], [ax + aw, top], [ax + aw, top + h * 0.2 + 7], [ax, top + h * 0.2 + 7], [ax, top + h * 0.2], [ax + aw - 6, top + h * 0.2]];
    shape(ctx, pts, brand.pink, 2);
  };
  arm(-1, y + h * 0.18);
  arm(1, y + h * 0.32);
  ctx.fillStyle = brand.raised;
  for (let sy = y + 8; sy < y + h - 6; sy += 9) {
    ctx.fillRect(tx + 3, sy, 2, 2);
    ctx.fillRect(tx + t - 5, sy + 4, 2, 2);
  }
}

/** A flyer: a violet body, a beak, a crest, and wings that flap. */
function flyer(ctx: CanvasRenderingContext2D, o: Obstacle, time: number) {
  const up = Math.floor(time * 7) % 2 === 0;
  const { x, y, w, h } = o;
  const midY = y + h / 2;
  shape(ctx, [[x + 14, midY - 2], [x + 26, up ? y - 12 : midY + 18], [x + 34, midY - 2]], brand.violet, 2); // wing
  shape(ctx, [[x, midY], [x + 12, midY - 4], [x + 40, midY - 6], [x + w, midY], [x + 40, midY + 6], [x + 12, midY + 4]], brand.violet);
  shape(ctx, [[x - 8, midY + 1], [x + 2, midY - 3], [x + 2, midY + 4]], brand.orange, 0); // beak
  shape(ctx, [[x + 8, midY - 4], [x + 2, midY - 12], [x + 14, midY - 5]], brand.violet, 0); // crest
  ctx.fillStyle = brand.ink;
  ctx.fillRect(x + 7, midY - 2, 3, 3);
}

function draw(ctx: CanvasRenderingContext2D, game: Game, time: number, shake: number, fonts: Fonts) {
  const d = game.distance;
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * shake * 30, (Math.random() - 0.5) * shake * 30);

  // Sky.
  ctx.fillStyle = brand.blueSoft;
  ctx.fillRect(-10, -10, WORLD.width + 20, GROUND + 10);

  // Sun, nearly still.
  const sunX = WORLD.width - 110 - ((d * 0.01) % 40);
  ctx.beginPath();
  ctx.arc(sunX + 4, 56 + 4, 30, 0, Math.PI * 2);
  ctx.fillStyle = brand.ink;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sunX, 56, 30, 0, Math.PI * 2);
  ctx.fillStyle = brand.orange;
  ctx.fill();
  ctx.lineWidth = OUTLINE;
  ctx.strokeStyle = brand.ink;
  ctx.stroke();

  // A giant outlined 404 in the far sky.
  ctx.font = `110px ${fonts.display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(14,15,20,0.12)";
  tiled(d * 0.04, WORLD.width + 260, (x) => ctx.strokeText("404", x + 300, 120));

  // Far mountains, then near hills, each scrolling at its own pace.
  tiled(d * 0.12, 260, (x) =>
    shape(ctx, [[x, GROUND], [x + 70, GROUND - 74], [x + 110, GROUND - 46], [x + 160, GROUND - 92], [x + 260, GROUND]], brand.violetSoft, 0),
  );
  tiled(d * 0.35, 220, (x) => {
    ctx.beginPath();
    ctx.moveTo(x, GROUND);
    ctx.quadraticCurveTo(x + 55, GROUND - 58, x + 110, GROUND);
    ctx.quadraticCurveTo(x + 165, GROUND - 34, x + 220, GROUND);
    ctx.fillStyle = brand.limeSoft;
    ctx.fill();
    ctx.lineWidth = OUTLINE;
    ctx.strokeStyle = brand.ink;
    ctx.stroke();
  });

  // Clouds.
  tiled(d * 0.2, 300, (x) => {
    cloud(ctx, x + 20, 30, 1);
    cloud(ctx, x + 170, 74, 0.7);
  });

  // Ground: a lime grass edge over striped orange earth.
  ctx.fillStyle = brand.orange;
  ctx.fillRect(0, GROUND, WORLD.width, WORLD.height - GROUND);
  ctx.fillStyle = "rgba(14,15,20,0.12)";
  tiled(d, 32, (x) => {
    ctx.fillRect(x + 6, GROUND + 18, 12, 4);
    ctx.fillRect(x + 22, GROUND + 30, 8, 4);
  });
  ctx.fillStyle = brand.lime;
  ctx.fillRect(0, GROUND, WORLD.width, 9);
  ctx.fillStyle = brand.ink;
  ctx.fillRect(0, GROUND - 1, WORLD.width, 3);
  ctx.fillRect(0, GROUND + 9, WORLD.width, 2);
  tiled(d, 18, (x) => ctx.fillRect(x + 4, GROUND + 2, 2, 5));

  for (const o of game.obstacles) {
    if (o.kind.startsWith("bird")) flyer(ctx, o, time);
    else if (o.kind === "cluster") {
      cactus(ctx, o.x, o.y + 10, o.w * 0.45, o.h - 10);
      cactus(ctx, o.x + o.w * 0.4, o.y, o.w * 0.6, o.h);
    } else cactus(ctx, o.x, o.y, o.w, o.h);
  }
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
