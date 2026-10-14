/** Tic-tac-toe rules and a minimax opponent. Pure functions, no React. */

export type Mark = "X" | "O";
export type Board = (Mark | null)[];
export type Level = "easy" | "hard";

export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const emptyBoard = (): Board => Array<Mark | null>(9).fill(null);

export const other = (mark: Mark): Mark => (mark === "X" ? "O" : "X");

export function winner(board: Board): { mark: Mark; line: readonly number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) return { mark, line };
  }
  return null;
}

export const isFull = (board: Board) => board.every((cell) => cell !== null);

export const isOver = (board: Board) => winner(board) !== null || isFull(board);

export const openCells = (board: Board) =>
  board.flatMap((cell, i) => (cell === null ? [i] : []));

export function place(board: Board, index: number, mark: Mark): Board {
  if (board[index] !== null) throw new Error(`Cell ${index} is already taken`);
  const next = board.slice();
  next[index] = mark;
  return next;
}

/**
 * Minimax with alpha-beta pruning. Scores favor faster wins and slower
 * losses, so the AI finishes games instead of toying with the player.
 */
function score(board: Board, me: Mark, turn: Mark, depth: number, alpha: number, beta: number): number {
  const won = winner(board);
  if (won) return won.mark === me ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;

  const maximizing = turn === me;
  let best = maximizing ? -Infinity : Infinity;
  for (const i of openCells(board)) {
    const value = score(place(board, i, turn), me, other(turn), depth + 1, alpha, beta);
    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, value);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, value);
    }
    if (beta <= alpha) break;
  }
  return best;
}

/** The strongest move for `me`. Never loses. */
export function bestMove(board: Board, me: Mark): number {
  const open = openCells(board);
  if (open.length === 0) throw new Error("No moves left");
  // Opening book: every first move scores the same, so skip the full search.
  if (open.length === 9) return 4;

  let best = open[0];
  let bestScore = -Infinity;
  for (const i of open) {
    const value = score(place(board, i, me), me, other(me), 1, -Infinity, Infinity);
    if (value > bestScore) {
      bestScore = value;
      best = i;
    }
  }
  return best;
}

/** Any open cell, chosen by `randomInt(max)` (0 ≤ result < max). */
export function randomMove(board: Board, randomInt: (max: number) => number): number {
  const open = openCells(board);
  if (open.length === 0) throw new Error("No moves left");
  return open[randomInt(open.length)];
}

/** Easy plays randomly but still takes a win it can see; hard is perfect. */
export function cpuMove(board: Board, me: Mark, level: Level, randomInt: (max: number) => number): number {
  if (level === "hard") return bestMove(board, me);
  const winning = openCells(board).find((i) => winner(place(board, i, me))?.mark === me);
  return winning ?? randomMove(board, randomInt);
}
