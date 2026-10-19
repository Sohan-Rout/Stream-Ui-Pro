/**
 * Endless-runner rules for the 404 page. Pure functions in world units (a
 * 720×240 strip), time in seconds, randomness injected. Rendering lives in
 * the component.
 *
 * The dino runs in place while the world scrolls left. Jump the cacti;
 * flyers come at three heights once the score passes
 * BIRDS_FROM: jump the low ones, duck the middle ones, run under the high
 * ones. The world speeds up as you go.
 */

export const WORLD = { width: 720, height: 240 } as const;
/** Top of the ground line. */
export const GROUND = 200;
export const DINO = { x: 64, w: 60, h: 56, duckW: 74, duckH: 32 } as const;
export const SPEED = { start: 320, accel: 9, max: 760 } as const;
export const BIRDS_FROM = 300;

const GRAVITY = 2600; // px/s²
const JUMP = -800; // px/s
const SHORT_HOP = -320; // releasing jump early cuts the rise to this
const FAST_FALL = 3800; // extra gravity while ducking in the air
const MAX_DT = 1 / 30;
const HITBOX_INSET = 7;

export type ObstacleKind = "cactus" | "tall" | "cluster" | "bird-low" | "bird-mid" | "bird-high";
export type Obstacle = { kind: ObstacleKind; x: number; y: number; w: number; h: number };

/** Sizes and heights. Birds are placed by the bottom of their box above the ground. */
export const SHAPES: Record<ObstacleKind, { w: number; h: number; lift: number }> = {
  cactus: { w: 24, h: 42, lift: 0 },
  tall: { w: 28, h: 58, lift: 0 },
  cluster: { w: 56, h: 42, lift: 0 },
  "bird-low": { w: 48, h: 28, lift: 6 }, // must jump
  "bird-mid": { w: 48, h: 28, lift: 38 }, // duck under (or jump)
  "bird-high": { w: 48, h: 28, lift: 64 }, // run under
};

export type RunnerStatus = "ready" | "playing" | "over";

export type RunnerGame = {
  status: RunnerStatus;
  /** Height of the dino's feet above the ground (0 = on the ground). */
  height: number;
  /** Vertical speed; negative is up. */
  vy: number;
  ducking: boolean;
  /** Whether jump is held, so letting go early makes a short hop. */
  jumpHeld: boolean;
  speed: number;
  distance: number;
  score: number;
  obstacles: Obstacle[];
  /** Distance left until the next obstacle spawns at the right edge. */
  nextIn: number;
};

export type RunnerInput = { jump: boolean; duck: boolean };

/** What happened in a step, for sounds and flashes. */
export type RunnerEvent = "jump" | "milestone" | "crash";

export const createGame = (status: RunnerStatus = "ready"): RunnerGame => ({
  status,
  height: 0,
  vy: 0,
  ducking: false,
  jumpHeld: false,
  speed: SPEED.start,
  distance: 0,
  score: 0,
  obstacles: [],
  nextIn: 320,
});

/** The dino's box in world coordinates (y down), before hitbox inset. */
export function dinoBox(game: Pick<RunnerGame, "height" | "ducking">) {
  const duck = game.ducking && game.height === 0;
  const w = duck ? DINO.duckW : DINO.w;
  const h = duck ? DINO.duckH : DINO.h;
  return { x: DINO.x, y: GROUND - game.height - h, w, h };
}

export function makeObstacle(kind: ObstacleKind, x: number): Obstacle {
  const s = SHAPES[kind];
  return { kind, x, y: GROUND - s.lift - s.h, w: s.w, h: s.h };
}

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export function hits(game: Pick<RunnerGame, "height" | "ducking">, o: Obstacle) {
  const d = dinoBox(game);
  const i = HITBOX_INSET;
  // The tail is thin, so the left edge forgives more than the right.
  return overlaps({ x: d.x + i * 2, y: d.y + i, w: d.w - i * 3, h: d.h - i }, { x: o.x + 3, y: o.y + 3, w: o.w - 6, h: o.h - 6 });
}

/** Pick the next obstacle and the gap after it. `random()` is in [0, 1). */
export function nextObstacle(score: number, speed: number, random: () => number) {
  const birds = score >= BIRDS_FROM;
  const r = random();
  let kind: ObstacleKind;
  if (birds && r < 0.3) kind = (["bird-low", "bird-mid", "bird-high"] as const)[Math.floor(random() * 3)];
  else kind = (["cactus", "cactus", "tall", "cluster"] as const)[Math.floor(random() * 4)];
  // Always room to land and jump again; more room at speed.
  const gap = speed * 0.72 + 70 + random() * speed * 0.6;
  return { kind, gap };
}

/** Advance by `seconds`. Returns the next state and what happened. */
export function step(game: RunnerGame, input: RunnerInput, seconds: number, random: () => number): { game: RunnerGame; events: RunnerEvent[] } {
  if (game.status !== "playing") return { game, events: [] };
  const dt = Math.min(seconds, MAX_DT);
  const events: RunnerEvent[] = [];
  let { height, vy, speed, distance, nextIn } = game;

  // Jump on a fresh press while on the ground; let go early for a short hop.
  if (input.jump && !game.jumpHeld && height === 0) {
    vy = JUMP;
    events.push("jump");
  }
  if (!input.jump && vy < SHORT_HOP) vy = SHORT_HOP;
  vy += (GRAVITY + (input.duck && height > 0 ? FAST_FALL : 0)) * dt;
  height = Math.max(0, height - vy * dt);
  if (height === 0 && vy > 0) vy = 0;

  speed = Math.min(SPEED.max, speed + SPEED.accel * dt);
  const moved = speed * dt;
  distance += moved;
  const score = Math.floor(distance / 32);
  if (Math.floor(score / 100) > Math.floor(game.score / 100)) events.push("milestone");

  let obstacles = game.obstacles.map((o) => ({ ...o, x: o.x - moved })).filter((o) => o.x + o.w > -10);
  nextIn -= moved;
  if (nextIn <= 0) {
    const { kind, gap } = nextObstacle(score, speed, random);
    obstacles = [...obstacles, makeObstacle(kind, WORLD.width + 10)];
    nextIn = gap;
  }

  const next: RunnerGame = { ...game, height, vy, ducking: input.duck, jumpHeld: input.jump, speed, distance, score, obstacles, nextIn };
  if (obstacles.some((o) => hits(next, o))) {
    events.push("crash");
    return { game: { ...next, status: "over" }, events };
  }
  return { game: next, events };
}
