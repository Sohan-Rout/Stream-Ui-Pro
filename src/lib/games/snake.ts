/** Snake rules. Pure functions, no React; randomness is injected. */

export type Point = { x: number; y: number };
export type Direction = "up" | "down" | "left" | "right";
export type Status = "ready" | "playing" | "paused" | "over" | "won";

export type SnakeGame = {
  size: number;
  /** Head first. */
  snake: Point[];
  direction: Direction;
  /** Turns pressed faster than the game ticks, applied one per step. */
  queue: Direction[];
  food: Point;
  score: number;
  status: Status;
};

const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITE: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };

/** Two buffered turns make quick U-turns (up, then left) feel responsive. */
const MAX_QUEUE = 2;

const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

/** A fresh board: a three-cell snake heading right, food up and ahead. Deterministic. */
export function createGame(size = 16, status: Status = "ready"): SnakeGame {
  const mid = Math.floor(size / 2);
  return {
    size,
    snake: [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ],
    direction: "right",
    queue: [],
    food: { x: Math.min(size - 1, mid + 3), y: Math.max(0, mid - 3) },
    score: 0,
    status,
  };
}

/** Queue a turn. Reversing into yourself or repeating the current heading is ignored. */
export function turn(game: SnakeGame, direction: Direction): SnakeGame {
  const heading = game.queue.at(-1) ?? game.direction;
  if (direction === heading || direction === OPPOSITE[heading] || game.queue.length >= MAX_QUEUE) return game;
  return { ...game, queue: [...game.queue, direction] };
}

/** A random empty cell, chosen by `randomInt(max)` (0 ≤ result < max). */
export function placeFood(snake: Point[], size: number, randomInt: (max: number) => number): Point {
  const taken = new Set(snake.map((p) => p.y * size + p.x));
  const free: number[] = [];
  for (let i = 0; i < size * size; i++) if (!taken.has(i)) free.push(i);
  const cell = free[randomInt(free.length)];
  return { x: cell % size, y: Math.floor(cell / size) };
}

/** Advance one tick. Hitting a wall or your own body ends the game. */
export function step(game: SnakeGame, randomInt: (max: number) => number): SnakeGame {
  if (game.status !== "playing") return game;

  const [direction = game.direction, ...queue] = game.queue;
  const v = VECTORS[direction];
  const head = { x: game.snake[0].x + v.x, y: game.snake[0].y + v.y };

  const outside = head.x < 0 || head.y < 0 || head.x >= game.size || head.y >= game.size;
  const eating = same(head, game.food);
  // The tail moves out of the way this tick unless the snake is growing.
  const body = eating ? game.snake : game.snake.slice(0, -1);

  if (outside || body.some((p) => same(p, head))) {
    return { ...game, direction, queue: [], status: "over" };
  }

  const snake = [head, ...body];
  if (!eating) return { ...game, snake, direction, queue };

  const score = game.score + 1;
  if (snake.length === game.size * game.size) {
    return { ...game, snake, direction, queue, score, status: "won" };
  }
  return { ...game, snake, direction, queue, score, food: placeFood(snake, game.size, randomInt) };
}

/** Milliseconds per tick: starts relaxed and speeds up as you eat. */
export const tickMs = (score: number) => Math.max(70, 150 - score * 4);
