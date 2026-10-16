"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@streamuilib/react";
import { cn } from "@/lib/cn";
import { cryptoInt } from "@/lib/games/memory";
import { createGame, step, tickMs, turn, type Direction, type Point, type SnakeGame } from "@/lib/games/snake";

export type SnakeStyle = "classic" | "funky" | "pixel";

const STYLES: { id: SnakeStyle; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "funky", label: "Funky" },
  { id: "pixel", label: "Pixelated" },
];

const SIZE = 16;

const KEYS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const FUNKY_TONES = ["bg-lime", "bg-pink", "bg-blue", "bg-violet", "bg-orange"];

/* Best score lives in this browser only; storage can be blocked, so every access is guarded. */
const BEST_KEY = "streamui:snake-best";
const BEST_EVENT = "streamui:snake-best";
function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function saveBest(score: number) {
  try {
    if (score <= readBest()) return;
    localStorage.setItem(BEST_KEY, String(score));
    window.dispatchEvent(new Event(BEST_EVENT));
  } catch {
    // Storage unavailable: the best score just isn't remembered.
  }
}
function subscribeBest(onChange: () => void) {
  window.addEventListener(BEST_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(BEST_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Where a cell sits on the board, as percentages so the board can scale. */
const place = (p: Point): CSSProperties => ({
  left: `${(p.x / SIZE) * 100}%`,
  top: `${(p.y / SIZE) * 100}%`,
  width: `${100 / SIZE}%`,
  height: `${100 / SIZE}%`,
});

/** Eye positions for the funky head, so it looks where it's going. */
const EYES: Record<Direction, string> = {
  up: "items-start justify-between px-0.5 pt-0.5",
  down: "items-end justify-between px-0.5 pb-0.5",
  left: "flex-col items-start justify-between py-0.5 pl-0.5",
  right: "flex-col items-end justify-between py-0.5 pr-0.5",
};

function Segment({ point, index, game, look }: { point: Point; index: number; game: SnakeGame; look: SnakeStyle }) {
  const head = index === 0;
  if (look === "classic") {
    return (
      <span className="absolute p-px" style={place(point)}>
        <span className="block size-full bg-ink" />
      </span>
    );
  }
  if (look === "pixel") {
    return (
      <span
        className={cn("absolute pixel-bevel", head ? "bg-pink" : index % 2 ? "bg-violet" : "bg-blue")}
        style={place(point)}
      />
    );
  }
  return (
    <span className="absolute p-px" style={place(point)}>
      <span
        className={cn(
          "flex size-full rounded-full border-2 border-ink",
          head ? cn("bg-lime", EYES[game.direction]) : FUNKY_TONES[index % FUNKY_TONES.length],
        )}
      >
        {head && (
          <>
            <span className="block size-1 rounded-full bg-ink" />
            <span className="block size-1 rounded-full bg-ink" />
          </>
        )}
      </span>
    </span>
  );
}

function Food({ point, look }: { point: Point; look: SnakeStyle }) {
  if (look === "classic") {
    return (
      <span className="absolute grid place-items-center" style={place(point)}>
        <span className="block size-1/2 rotate-45 bg-ink" />
      </span>
    );
  }
  if (look === "pixel") {
    return <span className="absolute bg-orange pixel-bevel" style={place(point)} />;
  }
  return (
    <span className="absolute grid place-items-center" style={place(point)}>
      <span className="block size-4/5 rounded-full border-2 border-ink bg-pink motion-safe:animate-bounce" />
    </span>
  );
}

const BOARD: Record<SnakeStyle, string> = {
  classic: "bg-lime-soft",
  funky: "bg-paper bg-dots",
  pixel: "bg-paper-sunken bg-pixel-grid",
};

export function SnakeLab({ tick }: { tick?: number }) {
  // Deterministic first render; food is only placed randomly after it's eaten.
  const [game, setGame] = useState<SnakeGame>(() => createGame(SIZE));
  const [look, setLook] = useState<SnakeStyle>("classic");
  const best = useSyncExternalStore(subscribeBest, readBest, () => 0);
  const board = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const statusId = useId();

  // The game loop: one step per tick while playing; faster as the score grows.
  useEffect(() => {
    if (game.status !== "playing") return;
    const id = setInterval(() => setGame((g) => step(g, cryptoInt)), tick ?? tickMs(game.score));
    return () => clearInterval(id);
  }, [game.status, game.score, tick]);

  useEffect(() => {
    if (game.status === "over" || game.status === "won") saveBest(game.score);
  }, [game.status, game.score]);

  const playing = game.status === "playing";

  function start() {
    setGame((g) => (g.status === "paused" ? { ...g, status: "playing" } : createGame(SIZE, "playing")));
    board.current?.focus();
  }

  function pause() {
    setGame((g) => (g.status === "playing" ? { ...g, status: "paused" } : g));
  }

  function steer(direction: Direction) {
    setGame((g) => (g.status === "playing" ? turn(g, direction) : g));
  }

  function onKeyDown(e: KeyboardEvent) {
    const direction = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
    if (direction) {
      e.preventDefault();
      if (game.status === "ready") start();
      steer(direction);
    } else if (e.key === " ") {
      e.preventDefault();
      if (playing) pause();
      else start();
    } else if (e.key === "Enter" && !playing) {
      e.preventDefault();
      start();
    }
  }

  function onPointerUp(e: PointerEvent) {
    const from = swipe.current;
    swipe.current = null;
    if (!from) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  }

  const message =
    game.status === "over"
      ? `Game over. Score ${game.score}.`
      : game.status === "won"
        ? `You filled the board! Score ${game.score}.`
        : game.status === "paused"
          ? "Paused."
          : game.status === "ready"
            ? "Press Start, or an arrow key on the board."
            : `Score ${game.score}`;

  const score = look === "pixel" ? String(game.score).padStart(4, "0") : String(game.score);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div role="group" aria-label="Style" className="flex border-2 border-ink shadow-brutal-sm">
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={look === s.id}
            onClick={() => setLook(s.id)}
            className={cn(
              "cursor-pointer px-3 py-1.5 font-mono text-xs font-bold transition-colors duration-150 not-first:border-l-2 not-first:border-ink",
              look === s.id ? "bg-lime text-on-bright" : "bg-paper-raised hover:bg-lime-soft",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex w-full max-w-72 items-baseline justify-between font-mono text-xs uppercase">
        <span>
          {look === "pixel" ? "Score " : "Score: "}
          <span className="font-bold tabular-nums">{score}</span>
        </span>
        <span className="text-ink-muted">
          Best <span className="font-bold tabular-nums">{best}</span>
        </span>
      </div>

      <div
        ref={board}
        tabIndex={0}
        role="group"
        aria-label="Snake board. Arrow keys or WASD to steer, Space to pause."
        aria-describedby={statusId}
        data-style={look}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
        style={{ "--cells": SIZE } as CSSProperties}
        className={cn(
          "relative aspect-square w-full max-w-72 touch-none overflow-hidden border-2 border-ink shadow-brutal select-none",
          BOARD[look],
        )}
      >
        <Food point={game.food} look={look} />
        {game.snake.map((p, i) => (
          <Segment key={i} point={p} index={i} game={game} look={look} />
        ))}

        {!playing && (
          <div className="absolute inset-0 grid place-items-center bg-paper/70">
            <div className="flex flex-col items-center gap-3 border-2 border-ink bg-paper-raised px-5 py-4 text-center shadow-brutal-sm">
              <p className="font-mono text-xs font-bold uppercase">
                {game.status === "over" ? "Game over" : game.status === "won" ? "You win!" : game.status === "paused" ? "Paused" : "Snake"}
              </p>
              <Button size="sm" onClick={start}>
                {game.status === "paused" ? <Play aria-hidden /> : game.status === "ready" ? <Play aria-hidden /> : <RotateCcw aria-hidden />}
                {game.status === "paused" ? "Resume" : game.status === "ready" ? "Start" : "Play again"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      {/* Touch and mouse controls; the keyboard works on the focused board. */}
      <div className="grid grid-cols-3 gap-1.5" aria-label="Direction pad" role="group">
        <span />
        <Button size="icon" variant="secondary" className="size-10" aria-label="Up" onClick={() => steer("up")}>
          <ChevronUp aria-hidden />
        </Button>
        <span />
        <Button size="icon" variant="secondary" className="size-10" aria-label="Left" onClick={() => steer("left")}>
          <ChevronLeft aria-hidden />
        </Button>
        <Button
          size="icon"
          variant={playing ? "secondary" : "primary"}
          className="size-10"
          aria-label={playing ? "Pause" : "Start"}
          onClick={playing ? pause : start}
        >
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        </Button>
        <Button size="icon" variant="secondary" className="size-10" aria-label="Right" onClick={() => steer("right")}>
          <ChevronRight aria-hidden />
        </Button>
        <span />
        <Button size="icon" variant="secondary" className="size-10" aria-label="Down" onClick={() => steer("down")}>
          <ChevronDown aria-hidden />
        </Button>
        <span />
      </div>
    </div>
  );
}
