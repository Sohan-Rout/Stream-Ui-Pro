/**
 * Side-scrolling platformer rules. Pure functions in pixels and seconds; no
 * React, no canvas. The level is built in code from a list of features, so
 * it's easy to edit and to test (every gap is jumpable, every ledge reachable).
 */

export const TILE = 24;
export const LEVEL_W = 100;
export const LEVEL_H = 12;
export const VIEW = { width: 320, height: LEVEL_H * TILE } as const;

/** # ground · = brick · ! bonus block · u used block · P pipe · S stone · c coin · space air */
export type Tile = "#" | "=" | "!" | "u" | "P" | "S" | "c" | " ";
const SOLID = new Set<Tile>(["#", "=", "!", "u", "P", "S"]);

export const PLAYER = { w: 18, h: 22 } as const;
export const WALKER = { w: 20, h: 18, speed: 40 } as const;
/** Column of the flag pole; touching it wins. */
export const FLAG_X = 94;

const GRAVITY = 1700;
const JUMP = -580;
const RUN = 150;
const MAX_FALL = 720;
const ACCEL_GROUND = 1100;
const ACCEL_AIR = 650;
/** A short grace after leaving a ledge, and a short memory of an early jump press. */
const COYOTE = 0.08;
const BUFFER = 0.12;
const STOMP_BOUNCE = -360;
const MAX_DT = 1 / 30;
const RESPAWN_SAFETY = 1.5;
/** Walkers start moving once the player is this close, so they don't wander off unseen. */
const WAKE_DISTANCE = 360;

export const POINTS = { coin: 50, bonus: 100, stomp: 100, flag: 1000 } as const;

export type Walker = { x: number; y: number; vx: number; vy: number; alive: boolean; awake: boolean };
export type Status = "ready" | "playing" | "paused" | "dead" | "over" | "won";

export type JumperGame = {
  grid: Tile[][];
  player: { x: number; y: number; vx: number; vy: number; onGround: boolean; facing: 1 | -1; coyote: number; buffer: number };
  walkers: Walker[];
  score: number;
  coins: number;
  lives: number;
  status: Status;
  /** Seconds until respawn after losing a life. */
  respawnIn: number;
  /** Where the next life starts: the beginning, or halfway once passed. */
  checkpoint: number;
  /** Seconds of safety after a respawn, so you can't land straight on a walker. */
  safeFor: number;
};

export type Input = { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean };
export const NO_INPUT: Input = { left: false, right: false, jump: false, jumpPressed: false };

export const PITS: [number, number][] = [
  [28, 30],
  [52, 54],
  [73, 74],
];
const PIPES = [
  { x: 17, h: 2 },
  { x: 38, h: 3 },
  { x: 60, h: 2 },
];
const WALKER_COLUMNS = [14, 25, 42, 47, 64, 68, 80];
const GROUND_TOP = 10; // first ground row

/** The level grid, rows top first. */
export function buildLevel(): Tile[][] {
  const g: Tile[][] = Array.from({ length: LEVEL_H }, () => Array<Tile>(LEVEL_W).fill(" "));
  const set = (x: number, y: number, t: Tile) => {
    if (x >= 0 && x < LEVEL_W && y >= 0 && y < LEVEL_H) g[y][x] = t;
  };
  for (let x = 0; x < LEVEL_W; x++) {
    if (PITS.some(([a, b]) => x >= a && x <= b)) continue;
    for (let y = GROUND_TOP; y < LEVEL_H; y++) set(x, y, "#");
  }
  // Blocks to bump: a row low enough to hit from the ground, one high one.
  [[9, "!"], [10, "="], [11, "!"], [12, "="]].forEach(([x, t]) => set(x as number, 6, t as Tile));
  set(11, 3, "!");
  for (const p of PIPES) {
    for (let y = GROUND_TOP - p.h; y < GROUND_TOP; y++) {
      set(p.x, y, "P");
      set(p.x + 1, y, "P");
    }
  }
  // A floating platform over open ground, with coins on top.
  for (let x = 32; x <= 35; x++) set(x, 6, x === 33 ? "!" : "=");
  for (const [y, from, to] of [[7, 21, 24], [5, 32, 35], [7, 56, 58], [6, 78, 80]]) for (let x = from; x <= to; x++) set(x, y, "c");
  // A staircase up to the flag.
  [1, 2, 3, 4, 4].forEach((h, i) => {
    for (let y = GROUND_TOP - h; y < GROUND_TOP; y++) set(84 + i, y, "S");
  });
  return g;
}

const solidAt = (grid: Tile[][], tx: number, ty: number) => (ty < 0 ? false : SOLID.has(grid[ty]?.[tx] ?? " "));

/** Tiles a box overlaps, as [column, row] pairs. */
function tilesUnder(x: number, y: number, w: number, h: number): [number, number][] {
  const out: [number, number][] = [];
  for (let ty = Math.floor(y / TILE); ty <= Math.floor((y + h - 0.01) / TILE); ty++)
    for (let tx = Math.floor(x / TILE); tx <= Math.floor((x + w - 0.01) / TILE); tx++) out.push([tx, ty]);
  return out;
}

const startPlayer = (column: number) => ({
  x: column * TILE + 3,
  y: GROUND_TOP * TILE - PLAYER.h,
  vx: 0,
  vy: 0,
  onGround: true,
  facing: 1 as const,
  coyote: 0,
  buffer: 0,
});

export function createGame(status: Status = "ready"): JumperGame {
  return {
    grid: buildLevel(),
    player: startPlayer(2),
    walkers: WALKER_COLUMNS.map((c) => ({ x: c * TILE + 2, y: GROUND_TOP * TILE - WALKER.h, vx: -WALKER.speed, vy: 0, alive: true, awake: false })),
    score: 0,
    coins: 0,
    lives: 3,
    status,
    respawnIn: 0,
    checkpoint: 2,
    safeFor: 0,
  };
}

/** Move a box through the grid, one axis at a time, stopping at solid tiles. */
function moveBox(grid: Tile[][], b: { x: number; y: number; vx: number; vy: number }, w: number, h: number, dt: number) {
  let { x, y, vx, vy } = b;
  let hitWall = false;
  let landed = false;
  const bumped: [number, number][] = [];

  x += vx * dt;
  for (const [tx, ty] of tilesUnder(x, y, w, h)) {
    if (!solidAt(grid, tx, ty)) continue;
    x = vx > 0 ? tx * TILE - w : (tx + 1) * TILE;
    vx = 0;
    hitWall = true;
  }
  x = Math.max(0, Math.min(LEVEL_W * TILE - w, x));

  y += vy * dt;
  for (const [tx, ty] of tilesUnder(x, y, w, h)) {
    if (!solidAt(grid, tx, ty)) continue;
    if (vy > 0) {
      y = ty * TILE - h;
      landed = true;
    } else if (vy < 0) {
      y = (ty + 1) * TILE;
      bumped.push([tx, ty]);
    }
    vy = 0;
  }
  return { x, y, vx, vy, hitWall, landed, bumped };
}

const overlaps = (a: { x: number; y: number }, aw: number, ah: number, b: { x: number; y: number }, bw: number, bh: number) =>
  a.x < b.x + bw && a.x + aw > b.x && a.y < b.y + bh && a.y + ah > b.y;

function loseLife(game: JumperGame): JumperGame {
  return { ...game, lives: game.lives - 1, status: "dead", respawnIn: 1 };
}

/** Advance the world by `seconds` with the current input. */
export function step(game: JumperGame, input: Input, seconds: number): JumperGame {
  if (game.status === "dead") {
    const respawnIn = game.respawnIn - seconds;
    if (respawnIn > 0) return { ...game, respawnIn };
    if (game.lives <= 0) return { ...game, respawnIn: 0, status: "over" };
    return { ...game, respawnIn: 0, status: "playing", player: startPlayer(game.checkpoint), safeFor: RESPAWN_SAFETY };
  }
  if (game.status !== "playing") return game;
  const dt = Math.min(seconds, MAX_DT);
  let grid = game.grid;
  let { score, coins } = game;
  const p = { ...game.player };

  // Run: ease toward the held direction, a little looser in the air.
  const want = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const accel = p.onGround ? ACCEL_GROUND : ACCEL_AIR;
  const target = want * RUN;
  p.vx = p.vx < target ? Math.min(target, p.vx + accel * dt) : Math.max(target, p.vx - accel * dt);
  if (want) p.facing = want > 0 ? 1 : -1;

  // Jump, with coyote time and an input buffer; let go early for a short hop.
  p.coyote = p.onGround ? COYOTE : Math.max(0, p.coyote - dt);
  p.buffer = input.jumpPressed ? BUFFER : Math.max(0, p.buffer - dt);
  if (p.buffer > 0 && p.coyote > 0) {
    p.vy = JUMP;
    p.buffer = 0;
    p.coyote = 0;
  }
  const gravity = p.vy < 0 && !input.jump ? GRAVITY * 2.2 : GRAVITY;
  p.vy = Math.min(MAX_FALL, p.vy + gravity * dt);

  const moved = moveBox(grid, p, PLAYER.w, PLAYER.h, dt);
  Object.assign(p, { x: moved.x, y: moved.y, vx: moved.vx, vy: moved.vy, onGround: moved.landed });

  // Bumping blocks from below: a bonus block pays a coin once.
  for (const [tx, ty] of moved.bumped) {
    if (grid[ty][tx] === "!") {
      grid = grid.map((row, y) => (y === ty ? row.map((t, x) => (x === tx ? "u" : t)) : row));
      coins += 1;
      score += POINTS.bonus;
    }
  }

  // Coins in the air.
  for (const [tx, ty] of tilesUnder(p.x, p.y, PLAYER.w, PLAYER.h)) {
    if (grid[ty]?.[tx] === "c") {
      grid = grid.map((row, y) => (y === ty ? row.map((t, x) => (x === tx ? " " : t)) : row));
      coins += 1;
      score += POINTS.coin;
    }
  }

  const checkpoint = p.x > (LEVEL_W / 2) * TILE ? Math.round(LEVEL_W / 2) : game.checkpoint;
  let next: JumperGame = { ...game, grid, player: p, score, coins, checkpoint, safeFor: Math.max(0, game.safeFor - dt) };

  // Walkers: wake when you're near, pace back and forth, fall into pits.
  const walkers = game.walkers.map((w) => {
    if (!w.alive) return w;
    const awake = w.awake || Math.abs(w.x - p.x) < WAKE_DISTANCE;
    if (!awake) return w;
    const m = moveBox(grid, { ...w, vy: Math.min(MAX_FALL, w.vy + GRAVITY * dt) }, WALKER.w, WALKER.h, dt);
    const vx = m.hitWall ? -w.vx : w.vx;
    const fell = m.y > LEVEL_H * TILE;
    return { ...w, x: m.x, y: m.y, vx, vy: m.vy, awake, alive: !fell };
  });
  next = { ...next, walkers };

  // Stomp from above, or get hit from the side.
  for (let i = 0; i < walkers.length; i++) {
    const w = walkers[i];
    if (!w.alive || !overlaps(p, PLAYER.w, PLAYER.h, w, WALKER.w, WALKER.h)) continue;
    const fromAbove = game.player.vy > 0 && game.player.y + PLAYER.h <= w.y + 10;
    if (fromAbove || next.safeFor > 0) {
      if (!fromAbove) continue; // safe: walk right through it
      next.walkers = next.walkers.map((x, j) => (j === i ? { ...x, alive: false } : x));
      next.player = { ...next.player, vy: STOMP_BOUNCE };
      next.score += POINTS.stomp;
    } else {
      return loseLife(next);
    }
  }

  if (p.y > LEVEL_H * TILE) return loseLife(next);
  if (p.x + PLAYER.w / 2 >= FLAG_X * TILE) return { ...next, status: "won", score: next.score + POINTS.flag };
  return next;
}

/** Left edge of the camera: keeps the player a little left of center, inside the level. */
export const cameraX = (game: JumperGame) =>
  Math.max(0, Math.min(LEVEL_W * TILE - VIEW.width, game.player.x - VIEW.width * 0.4));
