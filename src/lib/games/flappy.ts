/**
 * Flappy rules and physics. Pure functions in world units (a 320×480 world),
 * time in seconds, randomness injected. Rendering lives in the component.
 */

export const WORLD = { width: 320, height: 480 } as const;
export const GROUND = 64;
export const BIRD = { x: 84, size: 30 } as const;
export const PIPE = { width: 56, gap: 132, spacing: 184, speed: 130 } as const;

const GRAVITY = 1500; // px/s²
const FLAP = -430; // px/s, upward
const MAX_FALL = 620; // px/s
const MAX_DT = 1 / 30; // a long frame (tab switch) can't tunnel through a pipe
const HITBOX_INSET = 4; // a little forgiveness on every side
const GAP_MARGIN = 48; // keep gaps away from the ceiling and the ground

export type Pipe = { x: number; gapY: number; passed: boolean };
export type FlappyStatus = "ready" | "playing" | "over";

export type FlappyGame = {
  status: FlappyStatus;
  /** Top of the bird's box. */
  y: number;
  /** Vertical speed; negative is up. */
  vy: number;
  pipes: Pipe[];
  score: number;
  /** How far the world has scrolled, for the ground and clouds. */
  distance: number;
};

export const createGame = (): FlappyGame => ({
  status: "ready",
  y: (WORLD.height - GROUND) / 2 - BIRD.size / 2,
  vy: 0,
  pipes: [],
  score: 0,
  distance: 0,
});

/** A flap starts the game, or kicks the bird upward. Ignored after game over. */
export function flap(game: FlappyGame): FlappyGame {
  if (game.status === "over") return game;
  return { ...game, status: "playing", vy: FLAP };
}

/** Top of a new pipe's gap, chosen by `randomInt(max)` (0 ≤ result < max). */
export function newGapY(randomInt: (max: number) => number) {
  const range = WORLD.height - GROUND - PIPE.gap - GAP_MARGIN * 2;
  return GAP_MARGIN + randomInt(range + 1);
}

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/** Has the bird hit this pipe (above or below its gap)? */
export function hitsPipe(y: number, pipe: Pipe) {
  const bird = {
    x: BIRD.x + HITBOX_INSET,
    y: y + HITBOX_INSET,
    w: BIRD.size - HITBOX_INSET * 2,
    h: BIRD.size - HITBOX_INSET * 2,
  };
  const top = { x: pipe.x, y: -1000, w: PIPE.width, h: pipe.gapY + 1000 };
  const bottom = { x: pipe.x, y: pipe.gapY + PIPE.gap, w: PIPE.width, h: WORLD.height };
  return overlaps(bird, top) || overlaps(bird, bottom);
}

/** Advance the world by `seconds`. */
export function step(game: FlappyGame, seconds: number, randomInt: (max: number) => number): FlappyGame {
  if (game.status !== "playing") return game;
  const dt = Math.min(seconds, MAX_DT);

  const vy = Math.min(game.vy + GRAVITY * dt, MAX_FALL);
  // The ceiling stops the bird rather than ending the game.
  const y = Math.max(0, game.y + vy * dt);
  const shift = PIPE.speed * dt;

  let score = game.score;
  const pipes = game.pipes
    .map((p) => ({ ...p, x: p.x - shift }))
    .filter((p) => p.x + PIPE.width > 0)
    .map((p) => {
      if (!p.passed && p.x + PIPE.width < BIRD.x) {
        score++;
        return { ...p, passed: true };
      }
      return p;
    });

  const last = pipes.at(-1);
  if (!last || last.x <= WORLD.width - PIPE.spacing) {
    // The first pipe enters just off-screen; the rest follow at a fixed spacing.
    const x = last ? last.x + PIPE.spacing : WORLD.width + 40;
    pipes.push({ x, gapY: newGapY(randomInt), passed: false });
  }

  const next = { ...game, y, vy, pipes, score, distance: game.distance + shift };
  const grounded = y + BIRD.size >= WORLD.height - GROUND;
  if (grounded || pipes.some((p) => hitsPipe(y, p))) {
    return { ...next, y: grounded ? WORLD.height - GROUND - BIRD.size : y, status: "over" };
  }
  return next;
}
