/** Whack-a-mole rules: popping, whacking, combos, bombs, escapes, the clock. */
import { describe, expect, test } from "bun:test";
import {
  HOLES,
  MAX_MULT,
  POINTS,
  ROUND,
  createGame,
  maxUp,
  multiplier,
  pickKind,
  step,
  upTime,
  whack,
  type Hole,
  type WhackGame,
} from "@/lib/games/whack";

const playing = (over: Partial<WhackGame> = {}): WhackGame => ({ ...createGame("playing"), nextPop: 99, ...over });
const withHole = (i: number, hole: Hole, over: Partial<WhackGame> = {}) => {
  const g = playing(over);
  const holes = [...g.holes];
  holes[i] = hole;
  return { ...g, holes };
};
const run = (g: WhackGame, seconds: number, random = () => 0.5) => {
  for (let t = 0; t < seconds; t += 1 / 60) g = step(g, 1 / 60, random).game;
  return g;
};

describe("popping", () => {
  test("something pops up into an empty hole when the timer comes round", () => {
    const { game, events } = step(playing({ nextPop: 0 }), 1 / 60, () => 0.5);
    expect(game.holes.filter((h) => h.state === "up")).toHaveLength(1);
    expect(events[0].kind).toBe("pop");
  });

  test("never more up at once than the round allows", () => {
    let g = playing();
    for (let t = 0; t < ROUND - 1; t += 1 / 30) {
      g = step({ ...g, nextPop: 0 }, 1 / 30, Math.random).game;
      const p = 1 - g.timeLeft / ROUND;
      expect(g.holes.filter((h) => h.state === "up").length).toBeLessThanOrEqual(maxUp(p));
    }
  });

  test("things stay up for less time as the round goes on, gold the least", () => {
    expect(upTime("mole", 1)).toBeLessThan(upTime("mole", 0));
    expect(upTime("gold", 0)).toBeLessThan(upTime("mole", 0));
  });

  test("most pops are moles; some are gold or bombs", () => {
    expect(pickKind(() => 0.5)).toBe("mole");
    expect(pickKind(() => 0.01)).toBe("gold");
    expect(pickKind(() => 0.15)).toBe("bomb");
  });
});

describe("whacking", () => {
  test("a mole scores, gets bonked, and then clears", () => {
    const { game, events } = whack(withHole(4, { state: "up", kind: "mole", left: 1 }), 4);
    expect(game.score).toBe(POINTS.mole);
    expect(game.holes[4].state).toBe("bonked");
    expect(events[0]).toEqual({ kind: "hit", hole: 4, what: "mole", points: POINTS.mole });
    expect(run(game, 0.5).holes[4].state).toBe("empty");
  });

  test("a bonked mole can't be scored twice", () => {
    const once = whack(withHole(0, { state: "up", kind: "mole", left: 1 }), 0).game;
    expect(whack(once, 0).game.score).toBe(once.score);
  });

  test("gold is worth more", () => {
    expect(whack(withHole(2, { state: "up", kind: "gold", left: 1 }), 2).game.score).toBe(POINTS.gold);
  });

  test("a bomb costs points (never below zero) and breaks the streak", () => {
    const g = whack(withHole(1, { state: "up", kind: "bomb", left: 1 }, { score: 100, streak: 7 }), 1).game;
    expect(g.score).toBe(100 + POINTS.bomb);
    expect(g.streak).toBe(0);
    expect(whack(withHole(1, { state: "up", kind: "bomb", left: 1 }, { score: 10 }), 1).game.score).toBe(0);
  });

  test("whacking an empty hole is a miss and breaks the streak", () => {
    const { game, events } = whack(playing({ streak: 4 }), 3);
    expect(game.streak).toBe(0);
    expect(game.misses).toBe(1);
    expect(events[0].kind).toBe("miss");
  });

  test("hits in a row raise the multiplier, up to the cap", () => {
    expect(multiplier(0)).toBe(1);
    expect(multiplier(5)).toBe(2);
    expect(multiplier(100)).toBe(MAX_MULT);
    const { game, events } = whack(withHole(5, { state: "up", kind: "mole", left: 1 }, { streak: 4 }), 5);
    expect(game.streak).toBe(5);
    expect(events).toContainEqual({ kind: "combo", mult: 2 });
    // The hit that reaches the step still scores at the old rate; the next one doubles.
    expect(game.score).toBe(POINTS.mole);
    expect(whack(withHole(6, { state: "up", kind: "mole", left: 1 }, { streak: 5 }), 6).game.score).toBe(POINTS.mole * 2);
  });
});

describe("escapes and the clock", () => {
  test("a mole that ducks back down unwhacked gets away and breaks the streak", () => {
    const { game, events } = step(withHole(7, { state: "up", kind: "mole", left: 0.01 }, { streak: 3 }), 1 / 30, () => 0.5);
    expect(game.holes[7].state).toBe("empty");
    expect(game.streak).toBe(0);
    expect(events).toContainEqual({ kind: "escape", hole: 7 });
  });

  test("a bomb leaving on its own is fine", () => {
    const { game, events } = step(withHole(7, { state: "up", kind: "bomb", left: 0.01 }, { streak: 3 }), 1 / 30, () => 0.5);
    expect(game.streak).toBe(3);
    expect(events.some((e) => e.kind === "escape")).toBe(false);
  });

  test("the round ends when the clock runs out, and the field clears", () => {
    const g = run(withHole(0, { state: "up", kind: "mole", left: 9 }, { timeLeft: 0.2 }), 0.5);
    expect(g.status).toBe("over");
    expect(g.holes.every((h) => h.state === "empty")).toBe(true);
  });

  test("nothing happens unless playing, and out-of-range holes are ignored", () => {
    const ready = createGame();
    expect(step(ready, 1, () => 0).game).toBe(ready);
    expect(whack(ready, 0).game).toBe(ready);
    const g = playing();
    expect(whack(g, HOLES).game).toBe(g);
  });
});
