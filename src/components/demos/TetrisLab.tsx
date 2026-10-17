"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowDownToLine, ChevronDown, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@streamuilib/react";
import { cn } from "@/lib/cn";
import { cryptoInt } from "@/lib/games/memory";
import { useBestScore } from "@/lib/games/best-score";
import {
  COLS,
  cells,
  createGame,
  dropDistance,
  gravityMs,
  hardDrop,
  move,
  rotate,
  softDrop,
  tick,
  type PieceType,
  type TetrisGame,
} from "@/lib/games/tetris";

/** One fill per piece, from the palette (there's no yellow or cyan here). */
export const PIECE_TONE: Record<PieceType, string> = {
  I: "bg-blue",
  O: "bg-orange",
  T: "bg-violet",
  S: "bg-lime",
  Z: "bg-pink",
  J: "bg-paper-raised",
  L: "bg-pink-soft",
};

/** The first board renders the same on server and client; randomness starts on Start. */
const fixed = () => 0;

function Block({ type, ghost }: { type: PieceType | null; ghost?: boolean }) {
  if (ghost) return <span className="block size-full border-2 border-dashed border-ink/50" />;
  if (!type) return <span className="block size-full" />;
  return <span className={cn("block size-full border-2 border-ink pixel-bevel", PIECE_TONE[type])} />;
}

/** A small preview of an upcoming piece, centered in a 4×4 box. */
function Preview({ type, small }: { type: PieceType; small?: boolean }) {
  const shape = cells(type, 0);
  const xs = shape.map(([x]) => x);
  const ys = shape.map(([, y]) => y);
  const w = Math.max(...xs) - Math.min(...xs) + 1;
  const h = Math.max(...ys) - Math.min(...ys) + 1;
  const filled = new Set(shape.map(([x, y]) => `${x - Math.min(...xs)},${y - Math.min(...ys)}`));
  return (
    <div
      className={cn("grid gap-px", small ? "w-8" : "w-12")}
      style={{ gridTemplateColumns: `repeat(${w}, 1fr)`, aspectRatio: `${w} / ${h}` }}
    >
      {Array.from({ length: w * h }, (_, i) => (
        <Block key={i} type={filled.has(`${i % w},${Math.floor(i / w)}`) ? type : null} />
      ))}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-2 border-ink bg-paper-raised px-2 py-1.5">
      <p className="font-mono text-xs font-bold tracking-wider text-ink-muted uppercase">{label}</p>
      <p className="font-mono text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

export function TetrisLab({ gravity }: { gravity?: number }) {
  const [game, setGame] = useState<TetrisGame>(() => createGame(fixed));
  const [best, saveBest] = useBestScore("tetris");
  const board = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const statusId = useId();
  const playing = game.status === "playing";

  // Gravity: one row per tick while playing, faster every level.
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setGame((g) => tick(g, cryptoInt)), gravity ?? gravityMs(game.level));
    return () => clearInterval(id);
  }, [playing, game.level, gravity]);

  useEffect(() => {
    if (game.status === "over") saveBest(game.score);
  }, [game.status, game.score, saveBest]);

  // The board as drawn: locked blocks, then the ghost, then the falling piece.
  const view = useMemo(() => {
    const grid: { type: PieceType | null; ghost?: boolean }[][] = game.board.map((row) => row.map((type) => ({ type })));
    const shape = cells(game.piece.type, game.piece.rotation);
    if (playing) {
      const d = dropDistance(game.board, game.piece);
      for (const [cx, cy] of shape) {
        const y = game.piece.y + cy + d;
        if (y >= 0 && !grid[y][game.piece.x + cx].type) grid[y][game.piece.x + cx] = { type: null, ghost: true };
      }
    }
    if (game.status !== "ready") {
      for (const [cx, cy] of shape) {
        const y = game.piece.y + cy;
        if (y >= 0) grid[y][game.piece.x + cx] = { type: game.piece.type };
      }
    }
    return grid;
  }, [game, playing]);

  function start() {
    setGame((g) => (g.status === "paused" ? { ...g, status: "playing" } : createGame(cryptoInt, "playing")));
    board.current?.focus();
  }

  const pause = () => setGame((g) => (g.status === "playing" ? { ...g, status: "paused" } : g));
  const act = (fn: (g: TetrisGame) => TetrisGame) => setGame((g) => fn(g));

  function onKeyDown(e: KeyboardEvent) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => act((g) => move(g, -1)),
      ArrowRight: () => act((g) => move(g, 1)),
      ArrowDown: () => act((g) => softDrop(g, cryptoInt)),
      ArrowUp: () => act((g) => rotate(g, 1)),
      x: () => act((g) => rotate(g, 1)),
      z: () => act((g) => rotate(g, -1)),
      " ": () => (playing ? act((g) => hardDrop(g, cryptoInt)) : start()),
      p: () => (playing ? pause() : start()),
      Escape: pause,
      Enter: () => !playing && start(),
    };
    const run = actions[key];
    if (!run) return;
    e.preventDefault();
    run();
  }

  // Touch: tap rotates, a sideways swipe moves a column per 24px, a downward swipe drops.
  function onPointerUp(e: PointerEvent) {
    const from = swipe.current;
    swipe.current = null;
    if (!from || !playing) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return act((g) => rotate(g, 1));
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 40) act((g) => hardDrop(g, cryptoInt));
      return;
    }
    const steps = Math.max(1, Math.round(Math.abs(dx) / 24));
    act((g) => {
      let next = g;
      for (let i = 0; i < steps; i++) next = move(next, Math.sign(dx));
      return next;
    });
  }

  const message =
    game.status === "over"
      ? `Game over. Score ${game.score}, ${game.lines} lines.`
      : game.status === "paused"
        ? "Paused."
        : game.status === "ready"
          ? "Press Start, or Enter on the board."
          : `Score ${game.score}. Lines ${game.lines}. Level ${game.level}.`;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          ref={board}
          tabIndex={0}
          role="group"
          aria-label="Tetris board. Arrows to move and rotate, Space to drop, P to pause."
          aria-describedby={statusId}
          onKeyDown={onKeyDown}
          onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
          className="relative grid w-40 touch-none gap-px border-2 border-ink bg-ink-faint shadow-brutal select-none sm:w-48"
          // Square cells set the height; a fixed 1:2 box plus the 1px gaps overflowed by a pixel or two.
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {view.flat().map((c, i) => (
            <span key={i} className="aspect-square bg-paper-sunken">
              <Block type={c.type} ghost={c.ghost} />
            </span>
          ))}

          {!playing && (
            <div className="absolute inset-0 grid place-items-center bg-paper/70">
              <div className="flex flex-col items-center gap-3 border-2 border-ink bg-paper-raised px-4 py-3 text-center shadow-brutal-sm">
                <p className="font-mono text-xs font-bold uppercase">
                  {game.status === "over" ? "Game over" : game.status === "paused" ? "Paused" : "Tetris"}
                </p>
                <Button size="sm" onClick={start}>
                  {game.status === "over" ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                  {game.status === "paused" ? "Resume" : game.status === "ready" ? "Start" : "Play again"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-20 flex-col gap-2 sm:w-24">
          <div className="flex flex-col items-center gap-2 border-2 border-ink bg-paper-raised p-2 shadow-brutal-sm">
            <p className="self-start font-mono text-xs font-bold tracking-wider text-ink-muted uppercase">Next</p>
            <Preview type={game.queue[0]} />
            <div className="flex w-full items-end justify-around gap-1 border-t-2 border-ink pt-2">
              <Preview type={game.queue[1]} small />
              <Preview type={game.queue[2]} small />
            </div>
          </div>
          <Stat label="Score" value={game.score} />
          <Stat label="Lines" value={game.lines} />
          <Stat label="Level" value={game.level} />
          <Stat label="Best" value={best} />
        </div>
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

      {/* Mouse and touch controls; the keyboard works on the focused board. */}
      <div role="group" aria-label="Controls" className="flex flex-wrap justify-center gap-1.5">
        <Button size="icon" variant="secondary" className="size-10" aria-label="Move left" onClick={() => act((g) => move(g, -1))}>
          <ChevronLeft aria-hidden />
        </Button>
        <Button size="icon" variant="secondary" className="size-10" aria-label="Rotate" onClick={() => act((g) => rotate(g, 1))}>
          <RotateCw aria-hidden />
        </Button>
        <Button size="icon" variant="secondary" className="size-10" aria-label="Move right" onClick={() => act((g) => move(g, 1))}>
          <ChevronRight aria-hidden />
        </Button>
        <Button size="icon" variant="secondary" className="size-10" aria-label="Soft drop" onClick={() => act((g) => softDrop(g, cryptoInt))}>
          <ChevronDown aria-hidden />
        </Button>
        <Button size="icon" variant="pink" className="size-10" aria-label="Hard drop" onClick={() => act((g) => hardDrop(g, cryptoInt))}>
          <ArrowDownToLine aria-hidden />
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
      </div>
    </div>
  );
}
