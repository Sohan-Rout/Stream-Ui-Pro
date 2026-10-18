/**
 * Pinball rules and physics. Pure functions in world units (a 320×480
 * table) and seconds; rendering lives in the component.
 *
 * Each frame runs several substeps so a fast ball can't pass through a
 * wall. Walls and slingshots are line segments, bumpers are circles, and
 * flippers are moving capsules that hand their own speed to the ball.
 */

export const TABLE = { width: 320, height: 480 } as const;
export const BALL_R = 7;

const GRAVITY = 900; // px/s², down the tilted table
const SUBSTEPS = 8;
const MAX_DT = 1 / 30;
const MAX_SPEED = 1300;

export type Vec = { x: number; y: number };
export type Segment = { a: Vec; b: Vec; bounce: number; kick?: number; points?: number; id?: string };
export type Bumper = { x: number; y: number; r: number; points: number };

/** Flipper geometry: pivot, length, capsule radius, and resting/raised angles (radians, y down). */
export type FlipperSide = "left" | "right";
export const FLIPPER = { length: 50, radius: 6, rest: 0.5, up: -0.42, speedUp: 22, speedDown: 12 } as const;
export const PIVOTS: Record<FlipperSide, Vec> = { left: { x: 95, y: 420 }, right: { x: 225, y: 420 } };

/** The launch lane, between the inner wall and the right wall. */
export const LANE = { left: 284, right: 310, top: 150, plungerY: 446 } as const;

const seg = (ax: number, ay: number, bx: number, by: number, bounce = 0.45, extra: Partial<Segment> = {}): Segment => ({
  a: { x: ax, y: ay },
  b: { x: bx, y: by },
  bounce,
  ...extra,
});

export const WALLS: Segment[] = [
  seg(10, 70, 10, 360), // left wall
  seg(310, 70, 310, 470), // right wall (lane side)
  seg(70, 10, 250, 10), // top
  seg(10, 70, 70, 10), // top-left corner
  seg(250, 10, 310, 70), // top-right corner: turns a launched ball onto the table
  seg(LANE.left, LANE.top, LANE.left, 470), // inner lane wall
  seg(10, 360, PIVOTS.left.x, PIVOTS.left.y), // left inlane slope down to the flipper
  seg(LANE.left, 360, PIVOTS.right.x, PIVOTS.right.y), // right inlane slope
  seg(LANE.left, 470, 310, 470), // lane floor, under the plunger
];

/** Slingshots above the flippers: springy, and worth a few points. */
export const SLINGS: Segment[] = [
  seg(48, 300, 78, 360, 1.05, { kick: 140, points: 10, id: "sling-left" }),
  seg(236, 300, 206, 360, 1.05, { kick: 140, points: 10, id: "sling-right" }),
];

export const BUMPERS: Bumper[] = [
  { x: 110, y: 150, r: 20, points: 100 },
  { x: 200, y: 150, r: 20, points: 100 },
  { x: 155, y: 220, r: 22, points: 100 },
];

export type Status = "ready" | "playing" | "paused" | "over";

export type PinballGame = {
  ball: Vec & { vx: number; vy: number };
  /** Whether the ball is resting on the plunger, waiting to launch. */
  onPlunger: boolean;
  /** Plunger pull, 0 to 1. */
  charge: number;
  flippers: Record<FlipperSide, { angle: number; omega: number }>;
  score: number;
  balls: number;
  status: Status;
  /** Seconds left on each bumper's and sling's hit flash, for drawing. */
  lit: Record<string, number>;
};

export type Input = { left: boolean; right: boolean; launch: boolean };
export const NO_INPUT: Input = { left: false, right: false, launch: false };

const restingBall = () => ({ x: (LANE.left + LANE.right) / 2, y: LANE.plungerY - BALL_R, vx: 0, vy: 0 });

export function createGame(status: Status = "ready"): PinballGame {
  return {
    ball: restingBall(),
    onPlunger: true,
    charge: 0,
    flippers: { left: { angle: FLIPPER.rest, omega: 0 }, right: { angle: FLIPPER.rest, omega: 0 } },
    score: 0,
    balls: 3,
    status,
    lit: {},
  };
}

/** A flipper's tip for its angle: the left one points right, the right one left. */
export function flipperTip(side: FlipperSide, angle: number): Vec {
  const p = PIVOTS[side];
  const dir = side === "left" ? 1 : -1;
  return { x: p.x + dir * FLIPPER.length * Math.cos(angle), y: p.y + FLIPPER.length * Math.sin(angle) };
}

function closestOnSegment(p: Vec, a: Vec, b: Vec) {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / (abx * abx + aby * aby)));
  return { x: a.x + abx * t, y: a.y + aby * t, t };
}

type Ball = PinballGame["ball"];

/**
 * Pushes the ball out of a segment (thickened by `pad`) and bounces it.
 * `surface` is the velocity of the touched point (for moving flippers).
 * Returns whether it hit.
 */
function collideSegment(ball: Ball, a: Vec, b: Vec, pad: number, bounce: number, surface: Vec = { x: 0, y: 0 }, kick = 0) {
  const c = closestOnSegment(ball, a, b);
  const dx = ball.x - c.x;
  const dy = ball.y - c.y;
  const dist = Math.hypot(dx, dy);
  const reach = BALL_R + pad;
  if (dist >= reach || dist === 0) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  ball.x = c.x + nx * reach;
  ball.y = c.y + ny * reach;
  // Bounce in the frame of the moving surface.
  const rvx = ball.vx - surface.x;
  const rvy = ball.vy - surface.y;
  const vn = rvx * nx + rvy * ny;
  if (vn < 0) {
    ball.vx = rvx - (1 + bounce) * vn * nx + surface.x + nx * kick;
    ball.vy = rvy - (1 + bounce) * vn * ny + surface.y + ny * kick;
  }
  return true;
}

/** Advance the table by `seconds` with the current input. */
export function step(game: PinballGame, input: Input, seconds: number): PinballGame {
  if (game.status !== "playing") return game;
  const dt = Math.min(seconds, MAX_DT);
  const h = dt / SUBSTEPS;
  const ball = { ...game.ball };
  const lit: Record<string, number> = {};
  for (const [k, v] of Object.entries(game.lit)) if (v - dt > 0) lit[k] = v - dt;
  let { score, charge, onPlunger } = game;

  // Flippers swing toward raised or resting; their angular speed is what kicks the ball.
  const flippers = { ...game.flippers };
  for (const side of ["left", "right"] as const) {
    const f = flippers[side];
    const pressed = side === "left" ? input.left : input.right;
    const target = pressed ? FLIPPER.up : FLIPPER.rest;
    const speed = pressed ? FLIPPER.speedUp : FLIPPER.speedDown;
    const delta = Math.max(-speed * dt, Math.min(speed * dt, target - f.angle));
    flippers[side] = { angle: f.angle + delta, omega: delta / dt };
  }

  // The plunger: hold to pull it back, let go to fire.
  if (onPlunger) {
    if (input.launch) {
      charge = Math.min(1, charge + dt / 1.1);
    } else if (charge > 0) {
      ball.vy = -(520 + 560 * charge);
      charge = 0;
      onPlunger = false;
    }
    if (onPlunger) {
      return { ...game, flippers, charge, lit, ball: { ...restingBall(), y: LANE.plungerY - BALL_R + charge * 14 } };
    }
  }

  for (let i = 0; i < SUBSTEPS; i++) {
    ball.vy += GRAVITY * h;
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > MAX_SPEED) {
      ball.vx *= MAX_SPEED / speed;
      ball.vy *= MAX_SPEED / speed;
    }
    ball.x += ball.vx * h;
    ball.y += ball.vy * h;

    for (const w of WALLS) collideSegment(ball, w.a, w.b, 2, w.bounce);
    for (const s of SLINGS) {
      if (collideSegment(ball, s.a, s.b, 3, s.bounce, undefined, s.kick)) {
        if (!lit[s.id!]) score += s.points ?? 0;
        lit[s.id!] = 0.12;
      }
    }
    BUMPERS.forEach((bp, j) => {
      const dx = ball.x - bp.x;
      const dy = ball.y - bp.y;
      const dist = Math.hypot(dx, dy);
      const reach = bp.r + BALL_R;
      if (dist >= reach || dist === 0) return;
      const nx = dx / dist;
      const ny = dy / dist;
      ball.x = bp.x + nx * reach;
      ball.y = bp.y + ny * reach;
      // Pop bumpers fire the ball away at a solid minimum speed.
      const out = Math.max(380, Math.hypot(ball.vx, ball.vy) * 0.9);
      ball.vx = nx * out;
      ball.vy = ny * out;
      const key = `bumper-${j}`;
      if (!lit[key]) score += bp.points;
      lit[key] = 0.15;
    });
    for (const side of ["left", "right"] as const) {
      const f = flippers[side];
      const tip = flipperTip(side, f.angle);
      const pivot = PIVOTS[side];
      const c = closestOnSegment(ball, pivot, tip);
      // The touched point moves with the flipper's swing: r × ω.
      const rx = c.x - pivot.x;
      const ry = c.y - pivot.y;
      const omega = side === "left" ? f.omega : -f.omega;
      collideSegment(ball, pivot, tip, FLIPPER.radius, 0.3, { x: -omega * ry, y: omega * rx });
    }
  }

  // Back down the lane onto the plunger after a weak launch.
  if (ball.x > LANE.left && ball.y >= LANE.plungerY - BALL_R) {
    return { ...game, flippers, score, lit, charge: 0, onPlunger: true, ball: restingBall() };
  }

  // Drained between the flippers.
  if (ball.y > TABLE.height + BALL_R * 2) {
    const balls = game.balls - 1;
    if (balls <= 0) return { ...game, flippers, score, lit, balls: 0, status: "over" };
    return { ...game, flippers, score, lit, balls, ball: restingBall(), onPlunger: true, charge: 0 };
  }

  return { ...game, ball, flippers, score, lit, charge, onPlunger };
}
