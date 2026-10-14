import { describe, expect, test } from "bun:test";
import {
  LINES,
  bestMove,
  cpuMove,
  emptyBoard,
  isFull,
  openCells,
  other,
  place,
  randomMove,
  winner,
  type Board,
  type Mark,
} from "@/lib/games/tictactoe";
import { createDeck, cryptoInt, shuffle } from "@/lib/games/memory";

const board = (cells: string): Board => [...cells].map((c) => (c === "." ? null : (c as Mark)));

describe("tic-tac-toe rules", () => {
  test("detects every winning line for both marks", () => {
    for (const line of LINES) {
      for (const mark of ["X", "O"] as const) {
        const b = emptyBoard();
        for (const i of line) b[i] = mark;
        expect(winner(b)).toEqual({ mark, line });
      }
    }
  });

  test("a full board with no line is a draw", () => {
    const draw = board("XOXXOOOXX");
    expect(winner(draw)).toBeNull();
    expect(isFull(draw)).toBe(true);
  });

  test("place never overwrites a taken cell", () => {
    expect(() => place(board("X........"), 0, "O")).toThrow();
    expect(place(emptyBoard(), 4, "X")[4]).toBe("X");
  });

  test("openCells lists empty cells only", () => {
    expect(openCells(board("XO.X.O..."))).toEqual([2, 4, 6, 7, 8]);
  });
});

describe("tic-tac-toe AI", () => {
  test("takes an immediate win", () => {
    expect(bestMove(board("OO.XX...."), "O")).toBe(2);
  });

  test("blocks the opponent's winning move", () => {
    expect(bestMove(board("XX..O...."), "O")).toBe(2);
  });

  test("easy mode still takes a win it can see", () => {
    const neverFirstCell = (max: number) => max - 1;
    expect(cpuMove(board("OO.XX...."), "O", "easy", neverFirstCell)).toBe(2);
  });

  test("random moves only pick open cells", () => {
    const b = board("XOX.O.X..");
    for (let i = 0; i < 50; i++) expect(openCells(b)).toContain(randomMove(b, cryptoInt));
  });

  test("hard mode never loses: every possible game, either side starting", () => {
    let games = 0;
    // The human may play any open cell; the hard CPU answers. Explore all.
    function explore(b: Board, turn: Mark, cpu: Mark) {
      const won = winner(b);
      if (won || isFull(b)) {
        games++;
        expect(won?.mark).not.toBe(other(cpu));
        return;
      }
      if (turn === cpu) explore(place(b, bestMove(b, cpu), cpu), other(turn), cpu);
      else for (const i of openCells(b)) explore(place(b, i, turn), other(turn), cpu);
    }
    explore(emptyBoard(), "X", "O"); // human starts
    explore(emptyBoard(), "O", "O"); // CPU starts
    expect(games).toBeGreaterThan(100);
  });
});

describe("memory deck", () => {
  test("has exactly two cards per pair", () => {
    const deck = createDeck(8);
    expect(deck).toHaveLength(16);
    for (let pair = 0; pair < 8; pair++) expect(deck.filter((c) => c.pair === pair)).toHaveLength(2);
    expect(new Set(deck.map((c) => c.id)).size).toBe(16);
  });

  test("shuffle returns a permutation and leaves the input alone", () => {
    const deck = createDeck(8);
    const copy = structuredClone(deck);
    const shuffled = shuffle(deck);
    expect(deck).toEqual(copy);
    expect([...shuffled].sort((a, b) => a.id - b.id)).toEqual(deck);
  });

  test("shuffle uses the random source it's given (Fisher–Yates)", () => {
    // Always swapping with index 0 rotates the array by one.
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
  });

  test("cryptoInt stays in range and covers every value", () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const n = cryptoInt(7);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(7);
      seen.add(n);
    }
    expect(seen.size).toBe(7);
  });
});
