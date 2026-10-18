/**
 * Pinball rules and physics. Pure functions in world units (a 320×480
 * table) and seconds; rendering, sound, and effects live in the component.
 *
 * Each frame runs several substeps so a fast ball can't pass through a
 * wall. Walls, posts, slingshots, and drop targets are line segments,
 * bumpers are circles, and flippers are moving capsules that hand their own
 * speed to the ball.
 *
 * Scoring: everything is worth its points times the multiplier. Light all
 * four S/UI rollover lanes, or knock down the whole drop-target bank, to
 * raise it. A drain resets it. Each step reports what happened in `events`
 * so the component can flash, pop up scores, and play sounds.
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
export const FLIPPER = { length: 56, radius: 7, rest: 0.5, up: -0.42, speedUp: 22, speedDown: 12 } as const;
export const PIVOTS: Record<FlipperSide, Vec> = { left: { x: 95, y: 420 }, right: { x: 225, y: 420 } };

/** The launch lane, between the inner wall and the right wall. */
export const LANE = { left: 284, right: 310, top: 150, plungerY: 446 } as const;

/** Points, multiplier rules, and timers. */
export const RULES = {
  bumper: 100,
  sling: 10,
  lane: 250,
  target: 500,
  bank: 2500,
  maxMult: 5,
  ballSave: 5, // seconds after a launch
  extraBallAt: 15000,
  bankResetDelay: 1,
} as const;

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

/** The S/UI rollover lanes across the top: posts between them, a sensor line through them. */
export const LANE_LABELS = ["S", "/", "U", "I"] as const;
export const LANE_POSTS = [110, 145, 180, 215, 250];
export const LANE_TOP = 78;
export const LANE_BOTTOM = 104;
const LANE_SENSOR_Y = (LANE_TOP + LANE_BOTTOM) / 2;
export const POSTS: Segment[] = LANE_POSTS.map((x) => seg(x, LANE_TOP, x, LANE_BOTTOM, 0.4));

/** The drop-target bank along the left wall, top to bottom. */
export const TARGETS: Segment[] = [185, 215, 245].map((y, i) => seg(21, y - 11, 21, y + 11, 0.6, { id: `target-${i}` }));

/** Slingshots above the flippers: springy, and worth a few points. */
export const SLINGS: Segment[] = [
  seg(48, 300, 78, 360, 1.05, { kick: 140, points: RULES.sling, id: "sling-left" }),
  seg(236, 300, 206, 360, 1.05, { kick: 140, points: RULES.sling, id: "sling-right" }),
];

export const BUMPERS: Bumper[] = [
  { x: 110, y: 150, r: 20, points: RULES.bumper },
  { x: 200, y: 150, r: 20, points: RULES.bumper },
  { x: 155, y: 220, r: 22, points: RULES.bumper },
];

export type Status = "ready" | "playing" | "paused" | "over";

/** Something worth showing or hearing, reported by the step it happened in. */
export type PinEvent =
  | { kind: "bumper" | "sling" | "target" | "lane"; x: number; y: number; points: number }
  | { kind: "bank"; points: number }
  | { kind: "mult"; mult: number }
  | { kind: "save" | "extra" | "drain" | "launch" | "over" }
  | { kind: "flip"; side: FlipperSide };

export type PinballGame = {
  ball: Vec & { vx: number; vy: number };
  /** Whether the ball is resting on the plunger, waiting to launch. */
  onPlunger: boolean;
  /** Plunger pull, 0 to 1. */
  charge: number;
  flippers: Record<FlipperSide, { angle: number; omega: number }>;
  /** Which flipper buttons were down last step, to catch fresh presses. */
  held: Record<FlipperSide, boolean>;
  score: number;
  balls: number;
  status: Status;
  /** Score multiplier, 1 to RULES.maxMult. */
  mult: number;
  /** Which S/UI lanes are lit. */
  lanes: boolean[];
  /** Which drop targets are down. */
  targets: boolean[];
  /** Seconds until a cleared bank pops back up (0 when not pending). */
  bankReset: number;
  /** Seconds of ball save left (a drain in this window is forgiven). */
  ballSave: number;
  extraBallAwarded: boolean;
  /** Seconds left on each bumper's and sling's hit flash, for drawing. */
  lit: Record<string, number>;
  /** What happened during the last step. */
  events: PinEvent[];
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
    held: { left: false, right: false },
    score: 0,
    balls: 3,
    status,
    mult: 1,
    lanes: LANE_LABELS.map(() => false),
    targets: TARGETS.map(() => false),
    bankReset: 0,
    ballSave: 0,
    extraBallAwarded: false,
    lit: {},
    events: [],
  };
}

/** A flipper's tip for its angle: the left one points right, the right one left. */
export function flipperTip(side: FlipperSide, angle: number): Vec {
  const p = PIVOTS[side];
  const dir = side === "left" ? 1 : -1;
  return { x: p.x + dir * FLIPPER.length * Math.cos(angle), y: p.y + FLIPPER.length * Math.sin(angle) };
}

/** Which lane an x position falls in, or -1 between/outside them. */
export function laneAt(x: number) {
  for (let i = 0; i < LANE_POSTS.length - 1; i++) if (x > LANE_POSTS[i] && x < LANE_POSTS[i + 1]) return i;
  return -1;
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

/**
 * Swing both flippers toward raised or resting over `dt` seconds. Their
 * angular speed is what kicks the ball.
 */
function swing(flippers: PinballGame["flippers"], input: Input, dt: number): PinballGame["flippers"] {
  const next = { ...flippers };
  for (const side of ["left", "right"] as const) {
    const f = flippers[side];
    const pressed = side === "left" ? input.left : input.right;
    const target = pressed ? FLIPPER.up : FLIPPER.rest;
    const speed = pressed ? FLIPPER.speedUp : FLIPPER.speedDown;
    const delta = Math.max(-speed * dt, Math.min(speed * dt, target - f.angle));
    next[side] = { angle: f.angle + delta, omega: delta / dt };
  }
  return next;
}

const rotate = <T,>(xs: T[], by: 1 | -1) => (by === 1 ? [xs[xs.length - 1], ...xs.slice(0, -1)] : [...xs.slice(1), xs[0]]);

/** Advance the table by `seconds` with the current input. */
export function step(game: PinballGame, input: Input, seconds: number): PinballGame {
  if (game.status !== "playing") return game;
  const dt = Math.min(seconds, MAX_DT);
  const h = dt / SUBSTEPS;
  const ball = { ...game.ball };
  const events: PinEvent[] = [];
  const lit: Record<string, number> = {};
  for (const [k, v] of Object.entries(game.lit)) if (v - dt > 0) lit[k] = v - dt;
  let { score, charge, onPlunger, mult, ballSave, bankReset, balls, extraBallAwarded } = game;
  let lanes = [...game.lanes];
  let targets = [...game.targets];

  const award = (points: number) => {
    score += points * mult;
    return points * mult;
  };
  const raiseMult = () => {
    if (mult < RULES.maxMult) {
      mult += 1;
      events.push({ kind: "mult", mult });
    }
  };

  // A fresh flipper press shifts the lit lanes toward that side, as on a real table.
  for (const side of ["left", "right"] as const) {
    if ((side === "left" ? input.left : input.right) && !game.held[side]) {
      lanes = rotate(lanes, side === "left" ? -1 : 1);
      events.push({ kind: "flip", side });
    }
  }
  let flippers = game.flippers;
  const held = { left: input.left, right: input.right };

  // A cleared bank pops back up after a beat.
  if (bankReset > 0) {
    bankReset = Math.max(0, bankReset - dt);
    if (bankReset === 0) targets = targets.map(() => false);
  }

  const base = () => ({ ...game, flippers, held, lit, events, score, mult, lanes, targets, bankReset, balls, extraBallAwarded });

  // The plunger: hold to pull it back, let go to fire.
  if (onPlunger) {
    if (input.launch) {
      charge = Math.min(1, charge + dt / 1.1);
    } else if (charge > 0) {
      ball.vy = -(520 + 560 * charge);
      charge = 0;
      onPlunger = false;
      ballSave = RULES.ballSave;
      events.push({ kind: "launch" });
    }
    if (onPlunger) {
      flippers = swing(flippers, input, dt);
      return { ...base(), charge, ballSave, ball: { ...restingBall(), y: LANE.plungerY - BALL_R + charge * 14 } };
    }
  }

  // Ball save only counts down once the ball is out on the table.
  if (ball.x < LANE.left) ballSave = Math.max(0, ballSave - dt);

  for (let i = 0; i < SUBSTEPS; i++) {
    // Flippers move a substep at a time too, so a fast swing can't jump past the ball.
    flippers = swing(flippers, input, h);
    const prevY = ball.y;
    ball.vy += GRAVITY * h;
    const speed = Math.hypot(ball.vx, ball.vy);
    if (speed > MAX_SPEED) {
      ball.vx *= MAX_SPEED / speed;
      ball.vy *= MAX_SPEED / speed;
    }
    ball.x += ball.vx * h;
    ball.y += ball.vy * h;

    for (const w of WALLS) collideSegment(ball, w.a, w.b, 2, w.bounce);
    for (const p of POSTS) collideSegment(ball, p.a, p.b, 2, p.bounce);

    // Rolling through a lane lights it; lighting all four raises the multiplier.
    if ((prevY - LANE_SENSOR_Y) * (ball.y - LANE_SENSOR_Y) <= 0 && prevY !== ball.y) {
      const lane = laneAt(ball.x);
      if (lane >= 0 && !lit[`lane-${lane}`]) {
        lit[`lane-${lane}`] = 0.3;
        if (!lanes[lane]) {
          lanes[lane] = true;
          events.push({ kind: "lane", x: ball.x, y: LANE_SENSOR_Y, points: award(RULES.lane) });
          if (lanes.every(Boolean)) {
            lanes = lanes.map(() => false);
            raiseMult();
          }
        }
      }
    }

    TARGETS.forEach((t, j) => {
      if (targets[j]) return;
      if (collideSegment(ball, t.a, t.b, 3, t.bounce)) {
        targets[j] = true;
        events.push({ kind: "target", x: t.a.x, y: (t.a.y + t.b.y) / 2, points: award(RULES.target) });
        if (targets.every(Boolean)) {
          events.push({ kind: "bank", points: award(RULES.bank) });
          raiseMult();
          bankReset = RULES.bankResetDelay;
        }
      }
    });

    for (const s of SLINGS) {
      if (collideSegment(ball, s.a, s.b, 3, s.bounce, undefined, s.kick)) {
        if (!lit[s.id!]) {
          const c = closestOnSegment(ball, s.a, s.b);
          events.push({ kind: "sling", x: c.x, y: c.y, points: award(s.points ?? 0) });
        }
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
      if (!lit[key]) events.push({ kind: "bumper", x: bp.x, y: bp.y - bp.r, points: award(bp.points) });
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

  // One extra ball, the first time the score passes the mark.
  if (!extraBallAwarded && score >= RULES.extraBallAt) {
    extraBallAwarded = true;
    balls += 1;
    events.push({ kind: "extra" });
  }

  // Back down the lane onto the plunger after a weak launch.
  if (ball.x > LANE.left && ball.y >= LANE.plungerY - BALL_R) {
    return { ...base(), charge: 0, ballSave: 0, onPlunger: true, ball: restingBall() };
  }

  // Drained between the flippers.
  if (ball.y > TABLE.height + BALL_R * 2) {
    if (ballSave > 0) {
      events.push({ kind: "save" });
      return { ...base(), ballSave: 0, ball: restingBall(), onPlunger: true, charge: 0 };
    }
    balls -= 1;
    if (balls <= 0) {
      events.push({ kind: "over" });
      return { ...base(), balls: 0, mult: 1, ballSave: 0, status: "over" };
    }
    events.push({ kind: "drain" });
    return { ...base(), balls, mult: 1, ballSave: 0, ball: restingBall(), onPlunger: true, charge: 0 };
  }

  return { ...base(), ball, charge, onPlunger, ballSave };
}
