"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Circle, RotateCcw, X } from "lucide-react";
import { AnimatedIcon, Button, cn } from "@streamuilib/react";
import { cryptoInt } from "@/lib/games/memory";
import {
  cpuMove,
  emptyBoard,
  isFull,
  other,
  place,
  winner,
  type Board,
  type Mark,
} from "@/lib/games/tictactoe";

type Mode = "easy" | "hard" | "friend";

const MODES: { id: Mode; label: string }[] = [
  { id: "easy", label: "CPU · easy" },
  { id: "hard", label: "CPU · hard" },
  { id: "friend", label: "2 players" },
];

/** In CPU modes the human is X and the computer is O. */
const CPU: Mark = "O";

export function TicTacToeLab({ cpuDelay = 380 }: { cpuDelay?: number }) {
  // Fixed first render (X starts, empty board) keeps hydration stable.
  const [mode, setMode] = useState<Mode>("hard");
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [turn, setTurn] = useState<Mark>("X");
  const [round, setRound] = useState(0);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [thinking, setThinking] = useState(false);
  const [focus, setFocus] = useState(4);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const won = winner(board);
  const draw = !won && isFull(board);
  const over = won !== null || draw;
  const vsCpu = mode !== "friend";

  function record(next: Board) {
    const result = winner(next);
    if (result) setScores((s) => ({ ...s, [result.mark]: s[result.mark] + 1 }));
    else if (isFull(next)) setScores((s) => ({ ...s, draw: s.draw + 1 }));
    return result !== null || isFull(next);
  }

  function cpuTurn(current: Board, level: Mode) {
    setThinking(true);
    timer.current = setTimeout(() => {
      const next = place(current, cpuMove(current, CPU, level === "hard" ? "hard" : "easy", cryptoInt), CPU);
      setBoard(next);
      setTurn(other(CPU));
      setThinking(false);
      record(next);
    }, cpuDelay);
  }

  function play(index: number) {
    if (board[index] !== null || over || thinking) return;
    const next = place(board, index, turn);
    setBoard(next);
    if (record(next)) return;
    setTurn(other(turn));
    if (vsCpu) cpuTurn(next, mode);
  }

  function newRound(nextMode: Mode = mode, nextRound = round + 1) {
    clearTimeout(timer.current);
    setThinking(false);
    setRound(nextRound);
    const fresh = emptyBoard();
    setBoard(fresh);
    // Alternate who opens, so the CPU gets to start every other round.
    const starter: Mark = nextRound % 2 === 0 ? "X" : "O";
    setTurn(starter);
    if (nextMode !== "friend" && starter === CPU) cpuTurn(fresh, nextMode);
  }

  function changeMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setScores({ X: 0, O: 0, draw: 0 });
    newRound(next, 0);
  }

  // Arrow keys move between cells; only one cell is in the tab order.
  function onKeyDown(e: KeyboardEvent) {
    const row = Math.floor(focus / 3);
    const col = focus % 3;
    const target =
      e.key === "ArrowRight" ? row * 3 + ((col + 1) % 3)
      : e.key === "ArrowLeft" ? row * 3 + ((col + 2) % 3)
      : e.key === "ArrowDown" ? ((row + 1) % 3) * 3 + col
      : e.key === "ArrowUp" ? ((row + 2) % 3) * 3 + col
      : null;
    if (target === null) return;
    e.preventDefault();
    setFocus(target);
    cells.current[target]?.focus();
  }

  const name = (mark: Mark) => (vsCpu ? (mark === CPU ? "CPU" : "You") : mark);
  const status = won
    ? vsCpu
      ? won.mark === CPU ? "CPU wins." : "You win!"
      : `${won.mark} wins!`
    : draw
      ? "Draw."
      : thinking
        ? "CPU is thinking…"
        : vsCpu
          ? "Your move (X)"
          : `${turn} to move`;

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div role="group" aria-label="Opponent" className="flex flex-wrap justify-center border-2 border-ink shadow-brutal-sm">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={mode === m.id}
            onClick={() => changeMode(m.id)}
            className={cn(
              "cursor-pointer px-3 py-1.5 font-mono text-xs font-bold transition-colors duration-150 not-first:border-l-2 not-first:border-ink",
              mode === m.id ? "bg-lime text-on-bright" : "bg-paper-raised hover:bg-lime-soft",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-label="Board"
        onKeyDown={onKeyDown}
        className="grid size-60 grid-cols-3 grid-rows-3 gap-0.5 border-2 border-ink bg-ink shadow-brutal"
      >
        {board.map((cell, i) => {
          const winning = won?.line.includes(i);
          const playable = cell === null && !over && !thinking;
          return (
            <button
              key={i}
              ref={(el) => {
                cells.current[i] = el;
              }}
              type="button"
              tabIndex={i === focus ? 0 : -1}
              aria-disabled={!playable}
              aria-label={`Row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}: ${cell ?? "empty"}`}
              onFocus={() => setFocus(i)}
              onClick={() => play(i)}
              className={cn(
                "grid place-items-center transition-colors duration-150",
                winning ? "bg-lime" : cell === "X" ? "bg-pink-soft" : cell === "O" ? "bg-blue-soft" : "bg-paper-raised",
                playable ? "cursor-pointer hover:bg-lime-soft" : "cursor-default",
              )}
            >
              {cell && (
                <AnimatedIcon animation="pop" trigger="once" duration={260}>
                  {cell === "X" ? (
                    <X aria-hidden className="size-11" strokeWidth={3} />
                  ) : (
                    <Circle aria-hidden className="size-9" strokeWidth={3.25} />
                  )}
                </AnimatedIcon>
              )}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="min-h-6 font-mono text-sm font-bold">
        {status}
      </p>

      <div className="flex w-full max-w-60 items-center justify-between gap-4">
        <dl className="flex gap-4 font-mono text-xs tabular-nums">
          <div className="flex gap-1.5">
            <dt className="text-ink-muted">{name("X")}</dt>
            <dd className="font-bold">{scores.X}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-ink-muted">Draw</dt>
            <dd className="font-bold">{scores.draw}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-ink-muted">{name("O")}</dt>
            <dd className="font-bold">{scores.O}</dd>
          </div>
        </dl>
        <Button size="sm" variant="secondary" onClick={() => newRound()}>
          <RotateCcw aria-hidden /> New
        </Button>
      </div>
    </div>
  );
}
