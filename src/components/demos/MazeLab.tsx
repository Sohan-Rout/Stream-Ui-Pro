"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Heart, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@streamuilib/react";
import { cn } from "@/lib/cn";
import { cryptoInt } from "@/lib/games/memory";
import { useBestScore } from "@/lib/games/best-score";
import { COLS, MAP, ROWS, createGame, isWall, step, tickMs, turn, type Bot, type Dir, type MazeGame } from "@/lib/games/maze";

const KEYS: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const BOT_TONES = ["bg-pink", "bg-blue", "bg-orange"];
const ROTATION: Record<Dir, number> = { right: 0, down: 90, left: 180, up: 270 };
const LOOK: Record<Dir, string> = { up: "-translate-y-px", down: "translate-y-px", left: "-translate-x-px", right: "translate-x-px" };

/** Where a cell sits on the board, as percentages so the board can scale. */
const place = (x: number, y: number): CSSProperties => ({
  left: `${(x / COLS) * 100}%`,
  top: `${(y / ROWS) * 100}%`,
  width: `${100 / COLS}%`,
  height: `${100 / ROWS}%`,
});

/** Wall cells, each with an ink edge only where it meets a path: the maze reads as outlined shapes. */
const WALLS = MAP.flatMap((row, y) =>
  [...row].flatMap((c, x) =>
    c === "#"
      ? [
          {
            x,
            y,
            edges: cn(
              !isWall(x, y - 1) && y > 0 && "border-t-2",
              !isWall(x, y + 1) && y < ROWS - 1 && "border-b-2",
              !isWall(x - 1, y) && x > 0 && "border-l-2",
              !isWall(x + 1, y) && x < COLS - 1 && "border-r-2",
            ),
          },
        ]
      : [],
  ),
);

/** The chomper: a pie with a mouth that opens and closes each tick, facing its direction. */
function Player({ game }: { game: MazeGame }) {
  const open = game.status !== "playing" || game.tick % 2 === 0;
  const a = open ? 0.75 : 0.15; // half the mouth angle, in radians
  const path = `M5 5 L${5 + 4 * Math.cos(a)} ${5 - 4 * Math.sin(a)} A4 4 0 1 0 ${5 + 4 * Math.cos(a)} ${5 + 4 * Math.sin(a)} Z`;
  return (
    <span className="absolute grid place-items-center" style={place(game.player.x, game.player.y)}>
      <svg viewBox="0 0 10 10" className="size-full scale-110" style={{ transform: `rotate(${ROTATION[game.player.dir]}deg)` }}>
        <path d={path} className="fill-lime stroke-ink" strokeWidth={1} strokeLinejoin="round" />
        <circle cx={5.4} cy={3.1} r={0.6} className="fill-ink" />
      </svg>
    </span>
  );
}

function BotSprite({ bot, index, frightened }: { bot: Bot; index: number; frightened: boolean }) {
  const scared = frightened && bot.mode === "chase";
  return (
    <span className="absolute p-px" style={place(bot.x, bot.y)}>
      {bot.mode === "eyes" ? (
        <span className="flex size-full items-center justify-center gap-px">
          <Eye dir={bot.dir} />
          <Eye dir={bot.dir} />
        </span>
      ) : (
        <span
          className={cn(
            "flex size-full items-start justify-center gap-px rounded-t-full border-2 border-ink pt-1",
            scared ? "border-dashed bg-paper-raised" : BOT_TONES[index % BOT_TONES.length],
          )}
        >
          {scared ? <span className="mt-1 h-0.5 w-2/3 bg-ink" /> : (
            <>
              <Eye dir={bot.dir} />
              <Eye dir={bot.dir} />
            </>
          )}
        </span>
      )}
    </span>
  );
}

function Eye({ dir }: { dir: Dir }) {
  return (
    <span className="grid size-1.5 place-items-center rounded-full bg-paper-raised ring-1 ring-ink">
      <span className={cn("block size-0.5 rounded-full bg-ink", LOOK[dir])} />
    </span>
  );
}

export function MazeLab({ tick }: { tick?: number }) {
  const [game, setGame] = useState<MazeGame>(() => createGame());
  const [best, saveBest] = useBestScore("maze");
  const board = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const statusId = useId();
  const playing = game.status === "playing";

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setGame((g) => step(g, cryptoInt)), tick ?? tickMs(game.level));
    return () => clearInterval(id);
  }, [playing, game.level, tick]);

  useEffect(() => {
    if (game.status === "over") saveBest(game.score);
  }, [game.status, game.score, saveBest]);

  function start() {
    setGame((g) => (g.status === "paused" ? { ...g, status: "playing" } : createGame("playing")));
    board.current?.focus();
  }

  const pause = () => setGame((g) => (g.status === "playing" ? { ...g, status: "paused" } : g));
  const steer = (dir: Dir) => setGame((g) => turn(g, dir));

  function onKeyDown(e: KeyboardEvent) {
    const dir = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
    if (dir) {
      e.preventDefault();
      if (game.status === "ready") start();
      steer(dir);
    } else if (e.key === " " || e.key === "p" || e.key === "P") {
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
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  }

  const message =
    game.status === "over"
      ? `Game over. Score ${game.score}, level ${game.level}.`
      : game.status === "paused"
        ? "Paused."
        : game.status === "ready"
          ? "Press Start, or an arrow key on the board."
          : `Score ${game.score}. ${game.lives} ${game.lives === 1 ? "life" : "lives"} left. Level ${game.level}.`;

  return (
    <div className="flex w-full flex-col items-center gap-4 text-ink">
      <div className="flex w-full max-w-80 items-center justify-between font-mono text-xs uppercase">
        <span>
          Score <span className="font-bold tabular-nums">{game.score}</span>
        </span>
        <span className="flex items-center gap-1" aria-label={`${game.lives} lives`}>
          {Array.from({ length: 3 }, (_, i) => (
            <Heart key={i} aria-hidden className={cn("size-3.5", i < game.lives ? "fill-pink text-ink" : "text-ink-faint")} />
          ))}
        </span>
        <span className="text-ink-muted">
          Lv {game.level} · Best <span className="font-bold text-ink tabular-nums">{best}</span>
        </span>
      </div>

      <div
        ref={board}
        tabIndex={0}
        role="group"
        aria-label="Muncher maze. Arrow keys or WASD to steer, Space to pause."
        aria-describedby={statusId}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipe.current = null)}
        className="relative aspect-square w-full max-w-80 touch-none overflow-hidden border-2 border-ink bg-paper-sunken shadow-brutal select-none"
      >
        {WALLS.map((w) => (
          <span key={`${w.x}-${w.y}`} className={cn("absolute border-ink bg-violet-soft", w.edges)} style={place(w.x, w.y)} />
        ))}
        {game.pellets.flatMap((row, y) =>
          row.map((v, x) =>
            v === 0 ? null : (
              <span key={`p${x}-${y}`} className="absolute grid place-items-center" style={place(x, y)}>
                {v === 1 ? (
                  <span className="block size-1/5 bg-ink" />
                ) : (
                  <span className="block size-1/2 rounded-full border-2 border-ink bg-pink motion-safe:animate-pulse" />
                )}
              </span>
            ),
          ),
        )}
        {game.bots.map((b, i) => (
          <BotSprite key={i} bot={b} index={i} frightened={game.fright > 0} />
        ))}
        <Player game={game} />

        {!playing && (
          <div className="absolute inset-0 grid place-items-center bg-paper/70">
            <div className="flex flex-col items-center gap-3 border-2 border-ink bg-paper-raised px-5 py-4 text-center shadow-brutal-sm">
              <p className="font-mono text-xs font-bold uppercase">
                {game.status === "over" ? "Game over" : game.status === "paused" ? "Paused" : "Muncher"}
              </p>
              {game.status === "ready" && <p className="max-w-44 text-xs text-ink-muted">Eat every dot. Pink pellets turn the bots.</p>}
              <Button size="sm" onClick={start}>
                {game.status === "over" ? <RotateCcw aria-hidden /> : <Play aria-hidden />}
                {game.status === "paused" ? "Resume" : game.status === "ready" ? "Start" : "Play again"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p id={statusId} aria-live="polite" className="sr-only">
        {message}
      </p>

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
