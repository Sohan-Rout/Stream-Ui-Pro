/** Tetris rules: shapes, movement, rotation, line clears, scoring, game over. */
import { describe, expect, test } from "bun:test";
import {
  COLS,
  PIECES,
  ROWS,
  bag,
  cells,
  clearLines,
  collides,
  createGame,
  dropDistance,
  emptyBoard,
  gravityMs,
  hardDrop,
  move,
  rotate,
  softDrop,
  spawn,
  tick,
  type Board,
  type TetrisGame,
} from "@/lib/games/tetris";

/** Always picks index 0: deterministic bags. */
const first = () => 0;

const playing = (overrides: Partial<TetrisGame> = {}): TetrisGame => ({ ...createGame(first, "playing"), ...overrides });

/** A board whose bottom rows are full except one gap column. */
function filledRows(count: number, gap: number): Board {
  const board = emptyBoard();
  for (let y = ROWS - count; y < ROWS; y++) board[y] = board[y].map((_, x) => (x === gap ? null : "Z"));
  return board;
}

describe("shapes", () => {
  test("every piece has four cells in every rotation", () => {
    for (const p of PIECES) for (let r = 0; r < 4; r++) expect(cells(p, r)).toHaveLength(4);
  });

  test("four clockwise turns come back to the start", () => {
    for (const p of PIECES) expect(cells(p, 4)).toEqual(cells(p, 0));
  });

  test("the I piece stands up after one turn", () => {
    const xs = new Set(cells("I", 1).map(([x]) => x));
    expect(xs.size).toBe(1);
  });
});

describe("bag", () => {
  test("holds each of the seven pieces exactly once", () => {
    let seed = 7;
    const random = (max: number) => (seed = (seed * 31 + 11) % 997) % max;
    expect([...bag(random)].sort()).toEqual([...PIECES].sort());
  });
});

describe("movement", () => {
  test("pieces slide until they hit a wall", () => {
    let g = playing({ piece: spawn("O") });
    for (let i = 0; i < COLS; i++) g = move(g, -1);
    expect(g.piece.x).toBe(0);
    for (let i = 0; i < COLS; i++) g = move(g, 1);
    expect(g.piece.x).toBe(COLS - 2);
  });

  test("nothing moves unless the game is playing", () => {
    const g = createGame(first, "paused");
    expect(move(g, 1)).toBe(g);
    expect(rotate(g)).toBe(g);
    expect(tick(g, first)).toBe(g);
  });

  test("rotating against a wall kicks the piece back inside", () => {
    // A vertical I against the right wall can only turn flat by kicking left.
    let g = playing({ piece: { type: "I", rotation: 1, x: COLS - 3, y: 5 } });
    g = rotate(g);
    expect(g.piece.rotation).toBe(2);
    expect(collides(g.board, g.piece)).toBe(false);
  });

  test("the O piece doesn't rotate", () => {
    const g = playing({ piece: spawn("O") });
    expect(rotate(g)).toBe(g);
  });
});

describe("dropping and locking", () => {
  test("the ghost distance reaches the floor on an empty board", () => {
    const piece = { type: "O" as const, rotation: 0, x: 4, y: 0 };
    expect(dropDistance(emptyBoard(), piece)).toBe(ROWS - 2);
  });

  test("gravity moves a row at a time, then locks on the floor", () => {
    let g = playing({ piece: { type: "O", rotation: 0, x: 0, y: ROWS - 3 } });
    g = tick(g, first);
    expect(g.piece.y).toBe(ROWS - 2);
    g = tick(g, first);
    expect(g.board[ROWS - 1][0]).toBe("O");
    expect(g.board[ROWS - 2][1]).toBe("O");
  });

  test("soft drop scores 1 a row; hard drop scores 2 a row and locks", () => {
    let g = playing({ piece: { type: "O", rotation: 0, x: 4, y: 0 } });
    g = softDrop(g, first);
    expect(g.score).toBe(1);
    g = hardDrop(g, first);
    expect(g.score).toBe(1 + (ROWS - 3) * 2);
    expect(g.board[ROWS - 1][4]).toBe("O");
  });
});

describe("line clears", () => {
  test("full rows disappear and the rest fall", () => {
    const board = filledRows(2, 0);
    board[ROWS - 3][5] = "T";
    board[ROWS - 1][0] = "I"; // completes the bottom row
    const { board: next, cleared } = clearLines(board);
    expect(cleared).toBe(1);
    expect(next[ROWS - 2][5]).toBe("T");
    expect(next[0].every((c) => c === null)).toBe(true);
  });

  test("a vertical I into a four-row well clears four lines for 800 × level", () => {
    let g = playing({ board: filledRows(4, 9), piece: { type: "I", rotation: 1, x: 7, y: 0 }, level: 2, lines: 10 });
    g = hardDrop(g, first);
    expect(g.lines).toBe(14);
    expect(g.board.flat().every((c) => c === null)).toBe(true);
    // 800 × level 2, plus 2 points per row dropped.
    expect(g.score).toBe(1600 + 16 * 2);
  });

  test("every 10 lines raises the level, and gravity speeds up", () => {
    let g = playing({ board: filledRows(1, 9), piece: { type: "I", rotation: 1, x: 7, y: 0 }, lines: 9 });
    g = hardDrop(g, first);
    expect(g.level).toBe(2);
    expect(gravityMs(2)).toBeLessThan(gravityMs(1));
    expect(gravityMs(99)).toBe(80);
  });
});

describe("game over", () => {
  test("no room for the next piece ends the game", () => {
    // Blocks where new pieces appear (top rows, middle columns), but no full rows.
    const board = emptyBoard();
    for (const y of [0, 1]) for (let x = 3; x <= 6; x++) board[y][x] = "Z";
    const g = hardDrop(playing({ board, piece: { type: "O", rotation: 0, x: 0, y: 0 } }), first);
    expect(g.status).toBe("over");
  });

  test("a piece that still fits keeps the game going", () => {
    const g = hardDrop(playing({ piece: { type: "O", rotation: 0, x: 0, y: 0 } }), first);
    expect(g.status).toBe("playing");
  });

  test("the queue always has upcoming pieces to show", () => {
    let g = playing();
    for (let i = 0; i < 30 && g.status === "playing"; i++) g = hardDrop(g, first);
    expect(g.queue.length).toBeGreaterThanOrEqual(3);
  });
});
