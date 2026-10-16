import { describe, expect, test } from "bun:test";
import { createGame, placeFood, step, tickMs, turn, type SnakeGame } from "@/lib/games/snake";

const first = () => 0;
const playing = (overrides: Partial<SnakeGame> = {}): SnakeGame => ({ ...createGame(16, "playing"), ...overrides });

describe("snake: movement", () => {
  test("starts as a three-cell snake heading right, food off its path", () => {
    const g = createGame(16);
    expect(g.snake).toEqual([{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]);
    expect(g.direction).toBe("right");
    expect(g.status).toBe("ready");
    expect(g.snake.some((p) => p.x === g.food.x && p.y === g.food.y)).toBe(false);
  });

  test("nothing moves unless the game is playing", () => {
    for (const status of ["ready", "paused", "over", "won"] as const) {
      const g = createGame(16, status);
      expect(step(g, first)).toBe(g);
    }
  });

  test("each step moves the head forward and drops the tail", () => {
    const next = step(playing(), first);
    expect(next.snake).toEqual([{ x: 9, y: 8 }, { x: 8, y: 8 }, { x: 7, y: 8 }]);
  });
});

describe("snake: turning", () => {
  test("a turn applies on the next step", () => {
    const next = step(turn(playing(), "up"), first);
    expect(next.direction).toBe("up");
    expect(next.snake[0]).toEqual({ x: 8, y: 7 });
  });

  test("reversing straight into yourself is ignored", () => {
    expect(turn(playing(), "left").queue).toEqual([]);
  });

  test("two quick turns are buffered, for a tight U-turn", () => {
    const g = turn(turn(playing(), "up"), "left");
    expect(g.queue).toEqual(["up", "left"]);
    const after = step(step(g, first), first);
    expect(after.snake[0]).toEqual({ x: 7, y: 7 });
  });

  test("the buffer is capped so mashing keys can't pile up moves", () => {
    const g = turn(turn(turn(playing(), "up"), "left"), "down");
    expect(g.queue).toHaveLength(2);
  });

  test("a reversal is judged against the last queued turn", () => {
    const g = turn(turn(playing(), "up"), "down");
    expect(g.queue).toEqual(["up"]);
  });
});

describe("snake: eating and growing", () => {
  test("eating grows the snake, scores, and places new food on a free cell", () => {
    const g = playing({ food: { x: 9, y: 8 } });
    const next = step(g, first);
    expect(next.score).toBe(1);
    expect(next.snake).toHaveLength(4);
    expect(next.snake.some((p) => p.x === next.food.x && p.y === next.food.y)).toBe(false);
  });

  test("food never lands on the snake", () => {
    const snake = Array.from({ length: 15 }, (_, x) => ({ x, y: 0 }));
    for (let pick = 0; pick < 16 * 16 - snake.length; pick++) {
      const food = placeFood(snake, 16, () => pick);
      expect(snake.some((p) => p.x === food.x && p.y === food.y)).toBe(false);
    }
  });

  test("filling the board wins", () => {
    // 2x2 board: three cells of snake, food in the last free cell.
    const g: SnakeGame = {
      size: 2,
      snake: [{ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 }],
      direction: "right",
      queue: [],
      food: { x: 1, y: 1 },
      score: 0,
      status: "playing",
    };
    expect(step(g, first).status).toBe("won");
  });

  test("it speeds up with the score, down to a floor", () => {
    expect(tickMs(0)).toBe(150);
    expect(tickMs(5)).toBeLessThan(tickMs(0));
    expect(tickMs(1000)).toBe(70);
  });
});

describe("snake: game over", () => {
  test("hitting a wall ends the game", () => {
    const g = playing({ snake: [{ x: 15, y: 8 }, { x: 14, y: 8 }, { x: 13, y: 8 }] });
    expect(step(g, first).status).toBe("over");
  });

  test("running into your own body ends the game", () => {
    // A hook shape: heading down into its own body.
    const g = playing({
      snake: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }],
      direction: "left",
      queue: ["down"],
    });
    expect(step(g, first).status).toBe("over");
  });

  test("moving into the cell the tail is leaving is allowed", () => {
    const g = playing({
      snake: [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }],
      direction: "left",
      queue: ["down"],
      food: { x: 0, y: 0 },
    });
    expect(step(g, first).status).toBe("playing");
  });
});
