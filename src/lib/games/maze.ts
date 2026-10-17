/**
 * Maze-chase rules (in the spirit of the arcade classic). Pure functions, no
 * React; randomness is injected. Everything moves one cell per tick.
 */

export type Dir = "up" | "down" | "left" | "right";
export type Point = { x: number; y: number };
export type Status = "ready" | "playing" | "paused" | "over";
/** In the pen, out chasing, or eaten and heading home as eyes. */
export type BotMode = "pen" | "chase" | "eyes";

export type Bot = Point & { dir: Dir; mode: BotMode; home: Point; releaseAt: number };

export type MazeGame = {
  /** Pellets left: 0 none, 1 dot, 2 power pellet. Rows top first. */
  pellets: number[][];
  player: Point & { dir: Dir; next: Dir | null };
  bots: Bot[];
  /** Ticks of fright left after a power pellet. */
  fright: number;
  /** Bots eaten during the current fright, for the 200/400/800 combo. */
  combo: number;
  tick: number;
  score: number;
  lives: number;
  level: number;
  status: Status;
};

/**
 * # wall · dot · o power pellet · space empty path · - pen door (bots only)
 * B a bot's start, inside the pen · P the player's start. Row 7 wraps around.
 */
export const MAP = [
  "###############",
  "#o.....#.....o#",
  "#.###.#.#.###.#",
  "#.............#",
  "#.##.##.##.##.#",
  "#....#...#....#",
  "####.##-##.####",
  "    .#BBB#.    ",
  "####.#####.####",
  "#......#......#",
  "#.##.#.#.#.##.#",
  "#o.#.......#.o#",
  "##.#.#####.#.##",
  "#......P......#",
  "###############",
];

export const COLS = MAP[0].length;
export const ROWS = MAP.length;

export const POINTS = { dot: 10, power: 50, bot: 200 } as const;
/** How long a power pellet lasts, in ticks. */
export const FRIGHT_TICKS = 40;
/** Ticks between bots leaving the pen at the start of a life. */
const RELEASE_GAP = 12;

const VEC: Record<Dir, Point> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
export const REVERSE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
const DIRS: Dir[] = ["up", "left", "down", "right"];

const find = (ch: string): Point[] =>
  MAP.flatMap((row, y) => [...row].flatMap((c, x) => (c === ch ? [{ x, y }] : [])));

const PLAYER_START = find("P")[0];
const BOT_STARTS = find("B");
const DOOR = find("-")[0];
/** The cell just outside the door, where bots step out and eyes aim for. */
const DOOR_OUT = { x: DOOR.x, y: DOOR.y - 1 };

export const isWall = (x: number, y: number) => MAP[y]?.[x] === "#";
const isDoor = (x: number, y: number) => MAP[y]?.[x] === "-";
const inPen = (p: Point) => MAP[p.y]?.[p.x] === "B";

/** Step one cell, wrapping through the side tunnel. */
function advance(p: Point, dir: Dir): Point {
  const x = (p.x + VEC[dir].x + COLS) % COLS;
  return { x, y: p.y + VEC[dir].y };
}

const playerCanEnter = (p: Point) => !isWall(p.x, p.y) && !isDoor(p.x, p.y) && !inPen(p);

function freshPellets(): number[][] {
  return MAP.map((row) => [...row].map((c) => (c === "." ? 1 : c === "o" ? 2 : 0)));
}

function placeActors(tick: number) {
  return {
    player: { ...PLAYER_START, dir: "left" as Dir, next: null },
    bots: BOT_STARTS.map((home, i) => ({ ...home, dir: "up" as Dir, mode: "pen" as BotMode, home, releaseAt: tick + i * RELEASE_GAP })),
  };
}

export function createGame(status: Status = "ready"): MazeGame {
  return { pellets: freshPellets(), ...placeActors(0), fright: 0, combo: 0, tick: 0, score: 0, lives: 3, level: 1, status };
}

/** Milliseconds per tick: a little faster each level, never below 90. */
export const tickMs = (level: number) => Math.max(90, 170 - (level - 1) * 15);

/** Queue a turn; it's taken as soon as the way is open. */
export function turn(game: MazeGame, dir: Dir): MazeGame {
  if (game.status !== "playing") return game;
  return { ...game, player: { ...game.player, next: dir } };
}

export const pelletsLeft = (pellets: number[][]) => pellets.reduce((n, row) => n + row.filter((v) => v > 0).length, 0);

const dist2 = (a: Point, b: Point) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

/** Where a bot is heading: each one hunts a little differently. */
function target(bot: Bot, index: number, game: MazeGame): Point {
  if (bot.mode === "eyes") return DOOR_OUT;
  const p = game.player;
  if (index === 1) {
    // Cuts you off: aims a few cells ahead of where you're going.
    return { x: p.x + VEC[p.dir].x * 3, y: p.y + VEC[p.dir].y * 3 };
  }
  if (index === 2 && dist2(bot, p) < 25) {
    // Shy: chases from afar, wanders to its corner up close.
    return { x: 0, y: ROWS - 1 };
  }
  return p;
}

/** Move one bot one cell. */
function moveBot(bot: Bot, index: number, game: MazeGame, randomInt: (max: number) => number): Bot {
  if (bot.mode === "pen") {
    if (game.tick < bot.releaseAt) return bot;
    // Out through the door: line up under it, then go up.
    if (bot.x !== DOOR.x) return { ...bot, x: bot.x + Math.sign(DOOR.x - bot.x) };
    const up = { ...bot, y: bot.y - 1, dir: "up" as Dir };
    return up.y === DOOR_OUT.y ? { ...up, mode: "chase" } : up;
  }
  if (bot.mode === "eyes" && bot.x === DOOR_OUT.x && bot.y === DOOR_OUT.y) {
    // Home: back into the pen, and out again shortly.
    return { ...bot, ...bot.home, mode: "pen", releaseAt: game.tick + RELEASE_GAP };
  }

  const canEnter = (p: Point) => !isWall(p.x, p.y) && !isDoor(p.x, p.y) && !inPen(p);
  const options = DIRS.filter((d) => d !== REVERSE[bot.dir] && canEnter(advance(bot, d)));
  const choices = options.length > 0 ? options : [REVERSE[bot.dir]];

  let dir: Dir;
  if (game.fright > 0 && bot.mode === "chase") {
    dir = choices[randomInt(choices.length)];
  } else {
    const goal = target(bot, index, game);
    dir = choices.reduce((best, d) => (dist2(advance(bot, d), goal) < dist2(advance(bot, best), goal) ? d : best));
  }
  return { ...bot, ...advance(bot, dir), dir };
}

/** Bots on the move this tick: frightened ones crawl at half speed, eyes hurry home. */
function botMoves(bot: Bot, game: MazeGame) {
  if (bot.mode === "eyes") return true;
  if (game.fright > 0 && bot.mode === "chase") return game.tick % 2 === 0;
  // Slightly slower than you on level 1, catching up as levels rise.
  return game.tick % Math.max(5, 9 - game.level) !== 0;
}

/** Lose a life: everyone back to their start, or game over on the last one. */
function loseLife(game: MazeGame): MazeGame {
  const lives = game.lives - 1;
  if (lives <= 0) return { ...game, lives: 0, status: "over" };
  return { ...game, ...placeActors(game.tick), lives, fright: 0, combo: 0 };
}

/** Advance one tick. */
export function step(game: MazeGame, randomInt: (max: number) => number): MazeGame {
  if (game.status !== "playing") return game;
  const tick = game.tick + 1;
  const g: MazeGame = { ...game, tick, fright: Math.max(0, game.fright - 1) };
  if (g.fright === 0) g.combo = 0;

  // The player: take the queued turn if it's open, else keep going if possible.
  const p = g.player;
  const dir = p.next && playerCanEnter(advance(p, p.next)) ? p.next : p.dir;
  const ahead = advance(p, dir);
  const moved = playerCanEnter(ahead) ? ahead : { x: p.x, y: p.y };
  g.player = { ...moved, dir, next: dir === p.next ? null : p.next };

  // Eat whatever is here.
  const here = g.pellets[moved.y][moved.x];
  if (here > 0) {
    g.pellets = g.pellets.map((row, y) => (y === moved.y ? row.map((v, x) => (x === moved.x ? 0 : v)) : row));
    if (here === 1) g.score += POINTS.dot;
    else {
      g.score += POINTS.power;
      g.fright = FRIGHT_TICKS;
      g.combo = 0;
      // Scared bots turn around.
      g.bots = g.bots.map((b) => (b.mode === "chase" ? { ...b, dir: REVERSE[b.dir] } : b));
    }
  }

  // Bots move, then collisions: same cell, or passing through each other.
  const before = g.bots;
  g.bots = g.bots.map((b, i) => (botMoves(b, g) ? moveBot(b, i, g, randomInt) : b));
  const prev = { x: p.x, y: p.y };
  for (let i = 0; i < g.bots.length; i++) {
    const b = g.bots[i];
    if (b.mode !== "chase") continue;
    const caught =
      (b.x === g.player.x && b.y === g.player.y) ||
      (b.x === prev.x && b.y === prev.y && before[i].x === g.player.x && before[i].y === g.player.y);
    if (!caught) continue;
    if (g.fright > 0) {
      g.score += POINTS.bot * 2 ** g.combo;
      g.combo += 1;
      g.bots = g.bots.map((x, j) => (j === i ? { ...x, mode: "eyes" as BotMode } : x));
    } else {
      return loseLife(g);
    }
  }

  // Board cleared: next level, same score and lives.
  if (pelletsLeft(g.pellets) === 0) {
    return { ...g, pellets: freshPellets(), ...placeActors(tick), fright: 0, combo: 0, level: g.level + 1 };
  }
  return g;
}
