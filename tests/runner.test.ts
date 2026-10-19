/** Runner (404 page) rules: jumping, ducking, obstacles, speed, scoring. */
import { describe, expect, test } from "bun:test";
import {
  BIRDS_FROM,
  DINO,
  GROUND,
  SPEED,
  WORLD,
  autopilot,
  createGame,
  dinoBox,
  hits,
  makeObstacle,
  nextObstacle,
  step,
  type RunnerGame,
  type RunnerInput,
} from "@/lib/games/runner";

const DT = 1 / 60;
const NONE: RunnerInput = { jump: false, duck: false };
const never = () => 0.99; // keeps spawns far apart when a test doesn't care
const playing = (over: Partial<RunnerGame> = {}): RunnerGame => ({ ...createGame("playing"), nextIn: 1e9, ...over });
const run = (g: RunnerGame, input: Partial<RunnerInput>, seconds: number, random = never) => {
  for (let t = 0; t < seconds; t += DT) g = step(g, { ...NONE, ...input }, DT, random).game;
  return g;
};

describe("jumping", () => {
  test("a jump rises and lands back on the ground", () => {
    let g = step(playing(), { jump: true, duck: false }, DT, never).game;
    let peak = 0;
    for (let t = 0; t < 1.2; t += DT) {
      g = step(g, { jump: true, duck: false }, DT, never).game;
      peak = Math.max(peak, g.height);
    }
    expect(peak).toBeGreaterThan(100);
    expect(g.height).toBe(0);
  });

  test("holding jump doesn't bounce; it takes a fresh press", () => {
    let g = run(playing(), { jump: true }, 1.2);
    expect(g.height).toBe(0);
    g = step(g, { jump: true, duck: false }, DT, never).game;
    expect(g.height).toBe(0);
  });

  test("letting go early makes a shorter hop", () => {
    const full = (() => {
      let g = playing(), peak = 0;
      for (let t = 0; t < 1; t += DT) {
        g = step(g, { jump: true, duck: false }, DT, never).game;
        peak = Math.max(peak, g.height);
      }
      return peak;
    })();
    let g = step(playing(), { jump: true, duck: false }, DT, never).game;
    let peak = 0;
    for (let t = 0; t < 1; t += DT) {
      g = step(g, NONE, DT, never).game;
      peak = Math.max(peak, g.height);
    }
    expect(peak).toBeLessThan(full * 0.5);
  });

  test("ducking in the air drops faster", () => {
    const up = run(playing(), { jump: true }, 0.2);
    const slow = run(up, { jump: true }, 0.15);
    const fast = run(up, { jump: true, duck: true }, 0.15);
    expect(fast.height).toBeLessThan(slow.height);
  });
});

describe("obstacles", () => {
  test("running into a cactus ends the game", () => {
    const g = run(playing({ obstacles: [makeObstacle("cactus", DINO.x + 60)] }), {}, 0.5);
    expect(g.status).toBe("over");
  });

  test("a held jump clears the widest cluster, at the start and at top speed", () => {
    for (const speed of [SPEED.start, SPEED.max]) {
      const g = run(playing({ speed, obstacles: [makeObstacle("cluster", DINO.x + speed * 0.32)] }), { jump: true }, 1.2);
      expect(g.status).toBe("playing");
    }
  });

  test("a mid bird hits a standing dino but passes over a ducking one", () => {
    const bird = makeObstacle("bird-mid", DINO.x + 5);
    expect(hits({ height: 0, ducking: false }, bird)).toBe(true);
    expect(hits({ height: 0, ducking: true }, bird)).toBe(false);
  });

  test("a high bird passes over a standing dino; a low one doesn't", () => {
    expect(hits({ height: 0, ducking: false }, makeObstacle("bird-high", DINO.x + 5))).toBe(false);
    expect(hits({ height: 0, ducking: false }, makeObstacle("bird-low", DINO.x + 5))).toBe(true);
  });

  test("obstacles spawn at the right edge and scroll off the left", () => {
    let g = playing({ nextIn: 0 });
    g = step(g, NONE, DT, () => 0).game;
    expect(g.obstacles).toHaveLength(1);
    expect(g.obstacles[0].x).toBeGreaterThan(WORLD.width - 10);
    g = run({ ...g, obstacles: [makeObstacle("cactus", -20)], nextIn: 1e9 }, {}, 0.1);
    expect(g.obstacles).toHaveLength(0);
  });

  test("no birds before the score threshold", () => {
    for (let i = 0; i < 50; i++) {
      const r = (i * 0.137) % 1;
      expect(nextObstacle(BIRDS_FROM - 1, SPEED.start, () => r).kind.startsWith("bird")).toBe(false);
    }
    expect(nextObstacle(BIRDS_FROM, SPEED.start, () => 0).kind.startsWith("bird")).toBe(true);
  });

  test("every gap leaves room to land and jump again", () => {
    for (const speed of [SPEED.start, SPEED.max]) {
      expect(nextObstacle(0, speed, () => 0).gap).toBeGreaterThan(speed * 0.62 + 52);
    }
  });
});

describe("speed and score", () => {
  test("the world speeds up, up to a cap", () => {
    expect(run(playing(), {}, 5).speed).toBeGreaterThan(SPEED.start);
    expect(run(playing({ speed: SPEED.max - 1 }), {}, 2).speed).toBe(SPEED.max);
  });

  test("score follows distance, with a milestone every 100", () => {
    const g = step(playing({ distance: 99.9 * 32, score: 99 }), NONE, DT, never);
    expect(g.game.score).toBe(100);
    expect(g.events).toContain("milestone");
  });

  test("a ducking dino on the ground is low and wide", () => {
    const d = dinoBox({ height: 0, ducking: true });
    expect(d.h).toBe(DINO.duckH);
    expect(d.y + d.h).toBe(GROUND);
  });

  test("nothing moves unless playing", () => {
    const g = createGame();
    expect(step(g, { jump: true, duck: false }, DT, never).game).toBe(g);
  });
});

describe("autopilot (the hero background)", () => {
  /** A small seeded generator, so every run of the test plays the same course. */
  const seeded = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);

  for (const seed of [1, 7, 42, 2024]) {
    test(`plays two minutes without crashing (seed ${seed}), birds and top speed included`, () => {
      const random = seeded(seed);
      let g = playing({ nextIn: 300 });
      let sawBirds = false;
      for (let t = 0; t < 120; t += DT) {
        g = step(g, autopilot(g), DT, random, 1100).game;
        if (g.obstacles.some((o) => o.kind.startsWith("bird"))) sawBirds = true;
        if (g.status === "over") break;
      }
      expect(g.status).toBe("playing");
      expect(sawBirds).toBe(true);
      expect(g.speed).toBe(SPEED.max);
    });
  }

  test("a wide view spawns obstacles past its right edge", () => {
    const g = step(playing({ nextIn: 0 }), NONE, DT, () => 0, 1100).game;
    expect(g.obstacles[0].x).toBeGreaterThan(1100);
  });
});
