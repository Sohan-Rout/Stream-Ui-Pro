/**
 * Darts rules. Pure functions, time in seconds, randomness injected; rendering
 * lives in the component.
 *
 * The board uses a real board's proportions, in units where 1 is the outer
 * edge of the double ring, with x to the right and y down. Each turn is three
 * darts. Holding the throw steadies your hand: the spread shrinks, stays tight
 * for a moment, then opens up again as your arm tires, so a dart lands best
 * when you let go in that window. Wind then pushes the dart in flight: it
 * changes with every dart and blows harder each turn, so you have to aim off.
 *
 * Two modes: "score" adds up five turns; "301" counts down to exactly zero in
 * as few darts as you can. Going below zero is a bust, and the score goes back
 * to where the turn began.
 */

/** The numbers clockwise from the top. */
export const SECTORS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5] as const;

/** Ring edges as a fraction of the double ring's outer edge (170 mm on a real board). */
export const RING = {
  innerBull: 6.35 / 170,
  outerBull: 15.9 / 170,
  tripleIn: 99 / 170,
  tripleOut: 107 / 170,
  doubleIn: 162 / 170,
  doubleOut: 1,
} as const;

export const DARTS_PER_TURN = 3;
export const SCORE_TURNS = 5;
export const COUNTDOWN_START = 301;

export type Point = { x: number; y: number };
export type Ring = "miss" | "single" | "double" | "triple" | "outer-bull" | "inner-bull";
export type Hit = { ring: Ring; sector: number; points: number; label: string };

/** What a dart scores at a point on the board. */
export function scoreAt({ x, y }: Point): Hit {
  const r = Math.hypot(x, y);
  if (r <= RING.innerBull) return { ring: "inner-bull", sector: 25, points: 50, label: "Bullseye" };
  if (r <= RING.outerBull) return { ring: "outer-bull", sector: 25, points: 25, label: "Bull" };
  if (r > RING.doubleOut) return { ring: "miss", sector: 0, points: 0, label: "Miss" };
  // Clockwise from straight up; sector 0 is centered on the top, so shift by half a sector.
  const turn = (Math.atan2(x, -y) / (2 * Math.PI) + 1 + 1 / 40) % 1;
  const sector = SECTORS[Math.floor(turn * SECTORS.length) % SECTORS.length];
  if (r >= RING.doubleIn) return { ring: "double", sector, points: sector * 2, label: `Double ${sector}` };
  if (r >= RING.tripleIn && r <= RING.tripleOut) return { ring: "triple", sector, points: sector * 3, label: `Triple ${sector}` };
  return { ring: "single", sector, points: sector, label: `${sector}` };
}

/** The steady window, in seconds of holding: the spread is at its tightest in here. */
export const STEADY_FROM = 0.7;
export const STEADY_TO = 1;
/** How long the arm takes to tire completely, in seconds of holding. */
const TIRED_AT = 2.2;
export const SPREAD = { start: 0.24, steady: 0.03, tired: 0.34 } as const;

const smooth = (k: number) => k * k * (3 - 2 * k);

/** How far from the aim a dart can land after holding for `held` seconds. */
export function spreadAfter(held: number) {
  if (held <= 0) return SPREAD.start;
  if (held < STEADY_FROM) return SPREAD.start + (SPREAD.steady - SPREAD.start) * smooth(held / STEADY_FROM);
  if (held <= STEADY_TO) return SPREAD.steady;
  const k = Math.min(1, (held - STEADY_TO) / (TIRED_AT - STEADY_TO));
  return SPREAD.steady + (SPREAD.tired - SPREAD.steady) * smooth(k);
}

/** The hand's drift while holding, scaled by the spread so a steady hand barely moves. */
export function swayAt(held: number, spread: number): Point {
  const amount = spread * 0.45;
  return { x: amount * Math.sin(held * 5.1) * Math.cos(held * 1.7), y: amount * Math.sin(held * 3.9 + 1) };
}

/** Which way and how far the wind pushes a dart (board units), and its speed in mph. */
export type Wind = Point & { speed: number };
export const CALM: Wind = { x: 0, y: 0, speed: 0 };
/** How far one mph pushes a dart. A sector at the treble ring is about 0.19 wide. */
export const PUSH_PER_MPH = 0.016;
export const MAX_WIND = 16;
/** A gust changes the push by up to this fraction, so you can't cancel it exactly. */
export const GUST = 0.1;

/** The fastest the wind can blow on a turn: a breeze at first, then a gale. */
export const windLimit = (turn: number) => Math.min(MAX_WIND, 6 + turn * 2);

/** A fresh wind for a dart: any direction, between half the limit and the limit. */
export function rollWind(turn: number, random: () => number): Wind {
  const limit = windLimit(turn);
  const speed = Math.round(limit * (1 / 2 + (1 / 2) * random()));
  const angle = random() * 2 * Math.PI;
  return { x: speed * PUSH_PER_MPH * Math.sin(angle), y: -speed * PUSH_PER_MPH * Math.cos(angle), speed };
}

const COMPASS = ["up", "up and right", "right", "down and right", "down", "down and left", "left", "up and left"];

/** Which way the wind blows, in words, for screen readers. */
export function windDirection({ x, y }: Point) {
  const turn = (Math.atan2(x, -y) / (2 * Math.PI) + 1 + 1 / 16) % 1;
  return COMPASS[Math.floor(turn * COMPASS.length) % COMPASS.length];
}

/** Where a dart lands: anywhere in a disc around the swayed aim, evenly, then blown by the wind. */
export function landing(aim: Point, held: number, random: () => number, wind: Point = CALM): Point {
  const spread = spreadAfter(held);
  const drift = swayAt(held, spread);
  const angle = random() * 2 * Math.PI;
  const dist = spread * Math.sqrt(random());
  const gust = 1 + GUST * (2 * random() - 1);
  return { x: aim.x + drift.x + dist * Math.cos(angle) + wind.x * gust, y: aim.y + drift.y + dist * Math.sin(angle) + wind.y * gust };
}

export type Mode = "score" | "301";
export type Status = "ready" | "playing" | "over";
export type Dart = Point & { hit: Hit };

export type DartsGame = {
  mode: Mode;
  status: Status;
  /** Counts from 1. */
  turn: number;
  /** The darts in the board this turn. */
  darts: Dart[];
  /** Score mode: the running total. 301: what's left. */
  score: number;
  /** 301: what was left when this turn began, for a bust. */
  turnStart: number;
  /** All darts thrown this game. */
  thrown: number;
  /** The turn is finished and the darts are waiting to be pulled out. */
  turnOver: boolean;
  won: boolean;
  /** The wind on the next dart. */
  wind: Wind;
};

export type DartsEvent =
  | { kind: "hit"; hit: Hit }
  | { kind: "bust" }
  | { kind: "max" }
  | { kind: "win" };

const startScore = (mode: Mode) => (mode === "301" ? COUNTDOWN_START : 0);

export function createGame(mode: Mode = "score", status: Status = "ready"): DartsGame {
  const score = startScore(mode);
  return { mode, status, turn: 1, darts: [], score, turnStart: score, thrown: 0, turnOver: false, won: false, wind: CALM };
}

/** Changes the wind for the next dart. */
export const withNewWind = (game: DartsGame, random: () => number): DartsGame => ({ ...game, wind: rollWind(game.turn, random) });

/** What this turn's darts add up to. */
export const turnTotal = (game: DartsGame) => game.darts.reduce((sum, d) => sum + d.hit.points, 0);

/** Lands a dart. Does nothing unless the game can take one. */
export function throwDart(game: DartsGame, at: Point): { game: DartsGame; events: DartsEvent[] } {
  if (game.status !== "playing" || game.turnOver) return { game, events: [] };
  const hit = scoreAt(at);
  const darts = [...game.darts, { ...at, hit }];
  const events: DartsEvent[] = [{ kind: "hit", hit }];
  const next = { ...game, darts, thrown: game.thrown + 1 };

  if (game.mode === "score") {
    next.score = game.score + hit.points;
  } else {
    const left = game.score - hit.points;
    if (left < 0) {
      events.push({ kind: "bust" });
      return { game: { ...next, score: game.turnStart, turnOver: true }, events };
    }
    next.score = left;
    if (left === 0) {
      events.push({ kind: "win" });
      return { game: { ...next, turnOver: true, won: true }, events };
    }
  }

  if (darts.length === DARTS_PER_TURN) {
    next.turnOver = true;
    if (turnTotal(next) === 180) events.push({ kind: "max" });
  }
  return { game: next, events };
}

/** Pulls the darts out and starts the next turn, or ends the game. */
export function nextTurn(game: DartsGame): DartsGame {
  if (!game.turnOver) return game;
  if (game.won || (game.mode === "score" && game.turn >= SCORE_TURNS)) return { ...game, status: "over", turnOver: false };
  return { ...game, turn: game.turn + 1, darts: [], turnStart: game.score, turnOver: false };
}
