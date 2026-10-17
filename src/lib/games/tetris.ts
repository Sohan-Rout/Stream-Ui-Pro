/**
 * Tetris rules. Pure functions, no React; randomness is injected.
 *
 * The board is a grid of rows (top first). Pieces use the standard seven
 * tetrominoes with a 7-bag randomizer (every piece once per bag), simple
 * wall kicks, a ghost preview, and classic scoring.
 */

export type PieceType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
export type Cell = PieceType | null;
export type Board = Cell[][];
export type Status = "ready" | "playing" | "paused" | "over";

export type Piece = { type: PieceType; rotation: number; x: number; y: number };

export type TetrisGame = {
  board: Board;
  piece: Piece;
  /** Upcoming pieces, the next one first. */
  queue: PieceType[];
  score: number;
  lines: number;
  level: number;
  status: Status;
};

export const COLS = 10;
export const ROWS = 20;
export const PIECES: PieceType[] = ["I", "O", "T", "S", "Z", "J", "L"];

/** Spawn shapes as rows of a square box; rotations are computed from these. */
export const SHAPES: Record<PieceType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

/** Points for clearing 1–4 lines at once, times the level (the classic table). */
const LINE_POINTS = [0, 100, 300, 500, 800];
/** Wall kicks tried in order when a rotation collides: stay, sideways, then up. */
const KICKS: [number, number][] = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [-2, 0],
  [2, 0],
  [0, -1],
];
/** How many upcoming pieces the game keeps in view. */
const PREVIEW = 3;

/** The filled cells of a shape at a rotation (0–3, clockwise), relative to its box. */
export function cells(type: PieceType, rotation: number): [number, number][] {
  let shape = SHAPES[type];
  for (let r = 0; r < ((rotation % 4) + 4) % 4; r++) {
    // Rotate clockwise: new[row][col] = old[n - 1 - col][row].
    shape = shape.map((row, y) => row.map((_, x) => shape[shape.length - 1 - x][y]));
  }
  const out: [number, number][] = [];
  shape.forEach((row, y) => row.forEach((v, x) => v && out.push([x, y])));
  return out;
}

export const emptyBoard = (): Board => Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));

/** A shuffled bag of all seven pieces (Fisher–Yates with `randomInt(max)`, 0 ≤ result < max). */
export function bag(randomInt: (max: number) => number): PieceType[] {
  const out = [...PIECES];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A new piece at the top, centered. */
export function spawn(type: PieceType): Piece {
  const width = SHAPES[type][0].length;
  return { type, rotation: 0, x: Math.floor((COLS - width) / 2), y: type === "I" ? -1 : 0 };
}

/** Does this piece overlap a wall, the floor, or a locked block? Above the top is allowed. */
export function collides(board: Board, piece: Piece): boolean {
  return cells(piece.type, piece.rotation).some(([cx, cy]) => {
    const x = piece.x + cx;
    const y = piece.y + cy;
    if (x < 0 || x >= COLS || y >= ROWS) return true;
    return y >= 0 && board[y][x] !== null;
  });
}

/** A fresh game. Pass a fixed `randomInt` for a deterministic first render (server and client agree). */
export function createGame(randomInt: (max: number) => number, status: Status = "ready"): TetrisGame {
  const queue = [...bag(randomInt), ...bag(randomInt)];
  const first = queue.shift()!;
  return { board: emptyBoard(), piece: spawn(first), queue, score: 0, lines: 0, level: 1, status };
}

/** Milliseconds between gravity steps: faster every level, never below 80ms. */
export const gravityMs = (level: number) => Math.max(80, 800 - (level - 1) * 75);

const playing = (game: TetrisGame) => game.status === "playing";

/** Slide sideways by `dx`, if there's room. */
export function move(game: TetrisGame, dx: number): TetrisGame {
  if (!playing(game)) return game;
  const piece = { ...game.piece, x: game.piece.x + dx };
  return collides(game.board, piece) ? game : { ...game, piece };
}

/** Rotate (1 clockwise, -1 counterclockwise), trying wall kicks before giving up. */
export function rotate(game: TetrisGame, direction: 1 | -1 = 1): TetrisGame {
  if (!playing(game) || game.piece.type === "O") return game;
  const rotation = (game.piece.rotation + direction + 4) % 4;
  for (const [kx, ky] of KICKS) {
    const piece = { ...game.piece, rotation, x: game.piece.x + kx, y: game.piece.y + ky };
    if (!collides(game.board, piece)) return { ...game, piece };
  }
  return game;
}

/** How far the piece can fall from where it is: the ghost sits this many rows below. */
export function dropDistance(board: Board, piece: Piece): number {
  let d = 0;
  while (!collides(board, { ...piece, y: piece.y + d + 1 })) d++;
  return d;
}

/** Remove full rows, returning the new board and how many were cleared. */
export function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter((row) => row.some((c) => c === null));
  const cleared = ROWS - kept.length;
  const fresh = Array.from({ length: cleared }, () => Array<Cell>(COLS).fill(null));
  return { board: [...fresh, ...kept], cleared };
}

/** Lock the piece into the board, score cleared lines, and bring in the next piece. */
function lock(game: TetrisGame, randomInt: (max: number) => number, bonus = 0): TetrisGame {
  const board = game.board.map((row) => [...row]);
  let above = false;
  for (const [cx, cy] of cells(game.piece.type, game.piece.rotation)) {
    const y = game.piece.y + cy;
    if (y < 0) above = true;
    else board[y][game.piece.x + cx] = game.piece.type;
  }

  const { board: clearedBoard, cleared } = clearLines(board);
  const lines = game.lines + cleared;
  const score = game.score + bonus + LINE_POINTS[cleared] * game.level;
  const level = Math.floor(lines / 10) + 1;

  const queue = game.queue.length - 1 < PREVIEW ? [...game.queue, ...bag(randomInt)] : [...game.queue];
  const piece = spawn(queue.shift()!);
  // Locking above the top, or no room for the next piece, ends the game.
  const over = above || collides(clearedBoard, piece);
  return { ...game, board: clearedBoard, piece, queue, score, lines, level, status: over ? "over" : game.status };
}

/** One gravity step: fall a row, or lock if resting on something. */
export function tick(game: TetrisGame, randomInt: (max: number) => number): TetrisGame {
  if (!playing(game)) return game;
  const piece = { ...game.piece, y: game.piece.y + 1 };
  return collides(game.board, piece) ? lock(game, randomInt) : { ...game, piece };
}

/** Soft drop: one row down now, worth 1 point. Locks if it can't fall. */
export function softDrop(game: TetrisGame, randomInt: (max: number) => number): TetrisGame {
  if (!playing(game)) return game;
  const piece = { ...game.piece, y: game.piece.y + 1 };
  return collides(game.board, piece) ? lock(game, randomInt) : { ...game, piece, score: game.score + 1 };
}

/** Hard drop: straight to the ghost position and lock, worth 2 points a row. */
export function hardDrop(game: TetrisGame, randomInt: (max: number) => number): TetrisGame {
  if (!playing(game)) return game;
  const d = dropDistance(game.board, game.piece);
  return lock({ ...game, piece: { ...game.piece, y: game.piece.y + d } }, randomInt, d * 2);
}
