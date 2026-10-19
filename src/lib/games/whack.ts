/**
 * Whack-a-mole rules. Pure functions, time in seconds, randomness injected;
 * rendering lives in the component.
 *
 * A round lasts ROUND seconds on a 3×3 field. Things pop up for a while and
 * duck back down: moles (+10), the odd gold mole (+50, quicker), and bombs
 * (−30, don't). Hits in a row build a combo multiplier; a miss, a bomb, or a
 * mole that gets away resets it. Everything speeds up as the clock runs down.
 */

export const HOLES = 9;
export const ROUND = 30;
export const POINTS = { mole: 10, gold: 50, bomb: -30 } as const;
/** Combo multiplier: +1 for every COMBO_STEP hits in a row, up to MAX_MULT. */
export const COMBO_STEP = 5;
export const MAX_MULT = 4;
/** How long a whacked mole shows its bonk before the hole clears. */
const BONK = 0.3;

export type Kind = "mole" | "gold" | "bomb";
export type Hole =
  | { state: "empty" }
  | { state: "up"; kind: Kind; left: number }
  | { state: "bonked"; kind: Kind; left: number };

export type Status = "ready" | "playing" | "over";

export type WhackGame = {
  status: Status;
  holes: Hole[];
  timeLeft: number;
  score: number;
  /** Hits in a row. */
  streak: number;
  /** Seconds until the next pop. */
  nextPop: number;
  hits: number;
  misses: number;
};

export type WhackEvent =
  | { kind: "pop"; hole: number; what: Kind }
  | { kind: "hit"; hole: number; what: Kind; points: number }
  | { kind: "escape"; hole: number }
  | { kind: "miss"; hole: number }
  | { kind: "combo"; mult: number }
  | { kind: "over" };

const EMPTY: Hole = { state: "empty" };

export const createGame = (status: Status = "ready"): WhackGame => ({
  status,
  holes: Array.from({ length: HOLES }, () => EMPTY),
  timeLeft: ROUND,
  score: 0,
  streak: 0,
  nextPop: 0.6,
  hits: 0,
  misses: 0,
});

export const multiplier = (streak: number) => Math.min(MAX_MULT, 1 + Math.floor(streak / COMBO_STEP));

/** 0 at the start of a round, 1 at the end: drives the speed-up. */
const progress = (g: WhackGame) => 1 - g.timeLeft / ROUND;

/** How long something stays up, by kind, shrinking through the round. */
export function upTime(kind: Kind, p: number) {
  const base = 1.15 - 0.55 * p;
  return kind === "gold" ? base * 0.6 : kind === "bomb" ? base * 1.2 : base;
}

/** Seconds between pops, shrinking through the round. */
export const popGap = (p: number, random: () => number) => 0.85 - 0.45 * p + random() * 0.25;

/** How many things can be up at once, growing through the round. */
export const maxUp = (p: number) => (p < 0.3 ? 1 : p < 0.7 ? 2 : 3);

export function pickKind(random: () => number): Kind {
  const r = random();
  return r < 0.08 ? "gold" : r < 0.22 ? "bomb" : "mole";
}

/** Advance the round by `seconds`: count down, retire things, pop new ones. */
export function step(game: WhackGame, seconds: number, random: () => number): { game: WhackGame; events: WhackEvent[] } {
  if (game.status !== "playing") return { game, events: [] };
  const dt = Math.min(seconds, 0.1);
  const events: WhackEvent[] = [];
  let { streak, nextPop, misses } = game;
  const timeLeft = Math.max(0, game.timeLeft - dt);

  const holes = game.holes.map((h, i): Hole => {
    if (h.state === "empty") return h;
    const left = h.left - dt;
    if (left > 0) return { ...h, left };
    // A mole (or gold) that ducks back down unwhacked got away; bombs leaving is fine.
    if (h.state === "up" && h.kind !== "bomb") {
      events.push({ kind: "escape", hole: i });
      streak = 0;
      misses += 1;
    }
    return EMPTY;
  });

  const next = { ...game, timeLeft };
  nextPop -= dt;
  if (nextPop <= 0 && timeLeft > 0) {
    const p = progress(next);
    const up = holes.filter((h) => h.state !== "empty").length;
    const free = holes.map((h, i) => (h.state === "empty" ? i : -1)).filter((i) => i >= 0);
    if (up < maxUp(p) && free.length) {
      const hole = free[Math.floor(random() * free.length)];
      const what = pickKind(random);
      holes[hole] = { state: "up", kind: what, left: upTime(what, p) };
      events.push({ kind: "pop", hole, what });
    }
    nextPop = popGap(p, random);
  }

  if (timeLeft === 0) {
    events.push({ kind: "over" });
    return { game: { ...next, holes: holes.map(() => EMPTY), streak, nextPop, misses, status: "over" }, events };
  }
  return { game: { ...next, holes, streak, nextPop, misses }, events };
}

/** Whack a hole. Hitting a mole scores (times the combo); a bomb or an empty hole breaks the streak. */
export function whack(game: WhackGame, hole: number): { game: WhackGame; events: WhackEvent[] } {
  if (game.status !== "playing" || hole < 0 || hole >= HOLES) return { game, events: [] };
  const h = game.holes[hole];
  if (h.state === "bonked") return { game, events: [] }; // already got it
  if (h.state === "empty") {
    return { game: { ...game, streak: 0, misses: game.misses + 1 }, events: [{ kind: "miss", hole }] };
  }
  const holes = [...game.holes];
  holes[hole] = { state: "bonked", kind: h.kind, left: BONK };
  if (h.kind === "bomb") {
    const score = Math.max(0, game.score + POINTS.bomb);
    return {
      game: { ...game, holes, score, streak: 0, misses: game.misses + 1 },
      events: [{ kind: "hit", hole, what: "bomb", points: score - game.score }],
    };
  }
  const streak = game.streak + 1;
  const points = POINTS[h.kind] * multiplier(game.streak);
  const events: WhackEvent[] = [{ kind: "hit", hole, what: h.kind, points }];
  if (multiplier(streak) > multiplier(game.streak)) events.push({ kind: "combo", mult: multiplier(streak) });
  return { game: { ...game, holes, score: game.score + points, streak, hits: game.hits + 1 }, events };
}
