import { describe, expect, test } from "bun:test";
import { BIRD, GROUND, PIPE, WORLD, createGame, flap, hitsPipe, newGapY, step, type FlappyGame } from "@/lib/games/flappy";

const mid = () => 0;
const frame = 1 / 60;
const playing = (overrides: Partial<FlappyGame> = {}): FlappyGame => ({ ...flap(createGame()), ...overrides });
/** Runs the world for `seconds` in 60fps frames. */
function run(game: FlappyGame, seconds: number, randomInt = mid) {
  for (let t = 0; t < seconds && game.status === "playing"; t += frame) game = step(game, frame, randomInt);
  return game;
}

describe("flappy: flight", () => {
  test("waits on the ready screen until the first flap", () => {
    const g = createGame();
    expect(g.status).toBe("ready");
    expect(step(g, 1, mid)).toBe(g);
  });

  test("a flap starts the game and sends the bird upward", () => {
    const g = flap(createGame());
    expect(g.status).toBe("playing");
    expect(g.vy).toBeLessThan(0);
    expect(step(g, frame, mid).y).toBeLessThan(g.y);
  });

  test("gravity pulls the bird back down after a flap", () => {
    const later = run(playing({ pipes: [] }), 0.6);
    expect(later.vy).toBeGreaterThan(0);
  });

  test("the ceiling stops the bird instead of ending the game", () => {
    const g = step(playing({ y: 2, vy: -400 }), frame, mid);
    expect(g.y).toBe(0);
    expect(g.status).toBe("playing");
  });

  test("hitting the ground ends the game and rests the bird on it", () => {
    const g = run(playing({ vy: 300 }), 3);
    expect(g.status).toBe("over");
    expect(g.y + BIRD.size).toBe(WORLD.height - GROUND);
  });

  test("flaps are ignored after game over", () => {
    const over = { ...createGame(), status: "over" as const };
    expect(flap(over)).toBe(over);
  });

  test("a long frame is capped, so the bird can't tunnel through pipes", () => {
    const a = step(playing(), 1 / 30, mid);
    const b = step(playing(), 5, mid);
    expect(b.y).toBe(a.y);
    expect(b.distance).toBe(a.distance);
  });
});

describe("flappy: pipes", () => {
  test("the first pipe enters off-screen, and later ones keep their spacing", () => {
    let g = step(playing(), frame, mid);
    expect(g.pipes).toHaveLength(1);
    expect(g.pipes[0].x).toBeGreaterThan(WORLD.width);
    // Keep the bird safely in the gap while the world scrolls.
    for (let i = 0; i < 400 && g.pipes.length < 2; i++) g = step({ ...g, y: g.pipes[0].gapY + 40, vy: 0 }, frame, mid);
    expect(g.pipes[1].x - g.pipes[0].x).toBeCloseTo(PIPE.spacing, 5);
  });

  test("gaps always leave room above the ground and below the ceiling", () => {
    const lowest = newGapY((max) => max - 1);
    const highest = newGapY(() => 0);
    expect(highest).toBeGreaterThan(0);
    expect(lowest + PIPE.gap).toBeLessThan(WORLD.height - GROUND);
  });

  test("flying through the gap is safe; touching a pipe is not", () => {
    const pipe = { x: BIRD.x, gapY: 150, passed: false };
    expect(hitsPipe(150 + (PIPE.gap - BIRD.size) / 2, pipe)).toBe(false);
    expect(hitsPipe(120, pipe)).toBe(true); // clips the top pipe
    expect(hitsPipe(150 + PIPE.gap - 10, pipe)).toBe(true); // clips the bottom pipe
  });

  test("flying into a pipe ends the game", () => {
    // A pipe right at the bird, with the bird level with the top pipe.
    const g = step(playing({ pipes: [{ x: BIRD.x, gapY: 200, passed: false }], y: 100, vy: 0 }), frame, mid);
    expect(g.status).toBe("over");
  });

  test("flying through the gap keeps the game going", () => {
    const g = step(playing({ pipes: [{ x: BIRD.x, gapY: 150, passed: false }], y: 190, vy: 0 }), frame, mid);
    expect(g.status).toBe("playing");
  });

  test("passing a pipe scores exactly once", () => {
    let g = playing({ pipes: [{ x: BIRD.x - PIPE.width + 1, gapY: 150, passed: false }], y: 190, vy: 0 });
    g = step(g, frame, mid);
    expect(g.score).toBe(1);
    expect(g.pipes[0].passed).toBe(true);
    g = step({ ...g, vy: 0 }, frame, mid);
    expect(g.score).toBe(1);
  });

  test("pipes that leave the screen are dropped", () => {
    const g = step(playing({ pipes: [{ x: -PIPE.width + 1, gapY: 150, passed: true }] }), frame, mid);
    expect(g.pipes.every((p) => p.x + PIPE.width > 0)).toBe(true);
  });
});
