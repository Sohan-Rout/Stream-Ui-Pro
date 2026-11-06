import { describe, expect, test } from "bun:test";
import {
  COUNTDOWN_START,
  DARTS_PER_TURN,
  GUST,
  MAX_WIND,
  PUSH_PER_MPH,
  RING,
  SCORE_TURNS,
  SECTORS,
  SPREAD,
  STEADY_FROM,
  STEADY_TO,
  createGame,
  landing,
  nextTurn,
  rollWind,
  scoreAt,
  spreadAfter,
  swayAt,
  throwDart,
  turnTotal,
  windDirection,
  windLimit,
  withNewWind,
  type DartsGame,
  type Point,
} from "@/lib/games/darts";

/** A point in a sector's middle, `r` from the center. */
const at = (index: number, r: number): Point => {
  const a = (index / SECTORS.length) * 2 * Math.PI;
  return { x: r * Math.sin(a), y: -r * Math.cos(a) };
};
const tripleMid = (RING.tripleIn + RING.tripleOut) / 2;
const T20 = at(0, tripleMid);
const OFF: Point = { x: 1.1, y: 0 };

function play(game: DartsGame, points: Point[]) {
  let g = game;
  const events = [];
  for (const p of points) {
    const r = throwDart(g, p);
    g = r.game;
    events.push(...r.events);
  }
  return { game: g, events };
}

describe("scoreAt", () => {
  test("every sector scores its number in every ring", () => {
    SECTORS.forEach((n, i) => {
      expect(scoreAt(at(i, 0.3))).toMatchObject({ ring: "single", points: n, sector: n });
      expect(scoreAt(at(i, tripleMid))).toMatchObject({ ring: "triple", points: n * 3 });
      expect(scoreAt(at(i, 0.8))).toMatchObject({ ring: "single", points: n });
      expect(scoreAt(at(i, 0.98))).toMatchObject({ ring: "double", points: n * 2 });
    });
  });

  test("sectors change exactly halfway between two numbers", () => {
    const step = 2 * Math.PI / SECTORS.length;
    const near = (offset: number): Point => ({ x: 0.3 * Math.sin(step / 2 + offset), y: -0.3 * Math.cos(step / 2 + offset) });
    expect(scoreAt(near(-0.001)).sector).toBe(20);
    expect(scoreAt(near(0.001)).sector).toBe(1);
    // And across the top, where the angle wraps round.
    expect(scoreAt(at(0, 0.3)).sector).toBe(20);
    expect(scoreAt({ x: -0.3 * Math.sin(step / 2 - 0.001), y: -0.3 * Math.cos(step / 2 - 0.001) }).sector).toBe(20);
    expect(scoreAt({ x: -0.3 * Math.sin(step / 2 + 0.001), y: -0.3 * Math.cos(step / 2 + 0.001) }).sector).toBe(5);
  });

  test("the bulls, and off the board", () => {
    expect(scoreAt({ x: 0, y: 0 })).toMatchObject({ ring: "inner-bull", points: 50 });
    expect(scoreAt({ x: RING.outerBull - 0.001, y: 0 })).toMatchObject({ ring: "outer-bull", points: 25 });
    expect(scoreAt({ x: RING.outerBull + 0.001, y: 0 }).ring).toBe("single");
    expect(scoreAt(OFF)).toMatchObject({ ring: "miss", points: 0 });
  });
});

describe("the throw", () => {
  test("the spread tightens, holds in the steady window, then opens up", () => {
    expect(spreadAfter(0)).toBe(SPREAD.start);
    expect(spreadAfter(STEADY_FROM / 2)).toBeLessThan(SPREAD.start);
    expect(spreadAfter(STEADY_FROM / 2)).toBeGreaterThan(SPREAD.steady);
    expect(spreadAfter(STEADY_FROM)).toBe(SPREAD.steady);
    expect(spreadAfter(STEADY_TO)).toBe(SPREAD.steady);
    expect(spreadAfter(STEADY_TO + 0.5)).toBeGreaterThan(SPREAD.steady);
    expect(spreadAfter(99)).toBeCloseTo(SPREAD.tired, 9);
  });

  test("a dart always lands inside the spread and the sway", () => {
    for (const held of [0, 0.4, 0.8, 1.5, 3]) {
      const spread = spreadAfter(held);
      const reach = spread + Math.hypot(swayAt(held, spread).x, swayAt(held, spread).y);
      for (let i = 0; i < 200; i++) {
        const p = landing({ x: 0.2, y: -0.1 }, held, Math.random);
        expect(Math.hypot(p.x - 0.2, p.y + 0.1)).toBeLessThanOrEqual(reach + 1e-9);
      }
    }
  });

  test("a steady throw at the treble 20 hits the 20 far more often than a rushed one", () => {
    let seed = 1;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const rate = (held: number) => {
      let n = 0;
      for (let i = 0; i < 2000; i++) if (scoreAt(landing(T20, held, random)).sector === 20) n++;
      return n / 2000;
    };
    expect(rate(0.85)).toBeGreaterThan(0.9);
    expect(rate(0)).toBeLessThan(0.6);
    expect(rate(3)).toBeLessThan(0.6);
  });
});

describe("wind", () => {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  test("blows harder each turn, up to a limit, and always blows", () => {
    expect(windLimit(1)).toBeLessThan(windLimit(3));
    expect(windLimit(99)).toBe(MAX_WIND);
    for (const turn of [1, 3, 5, 20]) {
      for (let i = 0; i < 300; i++) {
        const w = rollWind(turn, random);
        expect(w.speed).toBeGreaterThan(0);
        expect(w.speed).toBeLessThanOrEqual(windLimit(turn));
        expect(Math.hypot(w.x, w.y)).toBeCloseTo(w.speed * PUSH_PER_MPH, 9);
      }
    }
  });

  test("a dart is pushed along the wind, give or take a gust", () => {
    const wind = { x: 0.2, y: 0 };
    for (let i = 0; i < 200; i++) {
      const p = landing({ x: 0, y: 0 }, 0.85, random, wind);
      expect(p.x).toBeGreaterThanOrEqual(0.2 * (1 - GUST) - 0.05);
      expect(p.x).toBeLessThanOrEqual(0.2 * (1 + GUST) + 0.05);
    }
  });

  test("a strong wind ruins a straight shot; aiming off beats it", () => {
    const wind = { x: MAX_WIND * PUSH_PER_MPH, y: 0 };
    const rate = (aim: Point) => {
      let n = 0;
      for (let i = 0; i < 2000; i++) if (scoreAt(landing(aim, 0.85, random, wind)).sector === 20) n++;
      return n / 2000;
    };
    expect(rate(T20)).toBeLessThan(0.05);
    expect(rate({ x: T20.x - wind.x, y: T20.y })).toBeGreaterThan(0.75);
  });

  test("names its direction", () => {
    expect(windDirection({ x: 0, y: -1 })).toBe("up");
    expect(windDirection({ x: 1, y: 0 })).toBe("right");
    expect(windDirection({ x: -1, y: 1 })).toBe("down and left");
    expect(windDirection({ x: -0.05, y: -1 })).toBe("up");
  });

  test("a new game starts calm until the wind is rolled; rolling uses the turn", () => {
    const g = createGame("score", "playing");
    expect(g.wind.speed).toBe(0);
    expect(withNewWind(g, () => 0.999).wind.speed).toBe(windLimit(1));
    expect(withNewWind({ ...g, turn: 4 }, () => 0.999).wind.speed).toBe(windLimit(4));
  });
});

describe("score mode", () => {
  test("adds up three darts a turn over five turns, then ends", () => {
    let g = createGame("score", "playing");
    for (let turn = 1; turn <= SCORE_TURNS; turn++) {
      expect(g.turn).toBe(turn);
      g = play(g, [T20, T20, OFF]).game;
      expect(g.turnOver).toBe(true);
      expect(g.score).toBe(turn * 120);
      g = nextTurn(g);
    }
    expect(g.status).toBe("over");
    expect(g.thrown).toBe(SCORE_TURNS * DARTS_PER_TURN);
  });

  test("three treble 20s is a maximum", () => {
    const { game, events } = play(createGame("score", "playing"), [T20, T20, T20]);
    expect(turnTotal(game)).toBe(180);
    expect(events.at(-1)).toEqual({ kind: "max" });
  });

  test("a finished turn takes no more darts until they're pulled out", () => {
    const g = play(createGame("score", "playing"), [T20, T20, T20]).game;
    expect(throwDart(g, T20).game).toBe(g);
    expect(nextTurn(g).darts).toEqual([]);
    expect(throwDart(createGame(), T20).events).toEqual([]);
  });
});

describe("301", () => {
  const leaving = (left: number): DartsGame => ({ ...createGame("301", "playing"), score: left, turnStart: left });

  test("counts down from 301", () => {
    const g = play(createGame("301", "playing"), [T20, T20, T20]).game;
    expect(g.score).toBe(COUNTDOWN_START - 180);
    expect(nextTurn(g).turnStart).toBe(COUNTDOWN_START - 180);
  });

  test("going below zero busts: the turn ends and the score goes back", () => {
    const { game, events } = play(leaving(40), [at(0, 0.3), T20]);
    expect(events.at(-1)).toEqual({ kind: "bust" });
    expect(game.score).toBe(40);
    expect(game.turnOver).toBe(true);
    expect(game.darts.length).toBe(2);
    const next = nextTurn(game);
    expect(next.status).toBe("playing");
    expect(next.turn).toBe(2);
  });

  test("hitting exactly zero wins on that dart, with no double needed", () => {
    const { game, events } = play(leaving(20), [at(0, 0.3)]);
    expect(events.at(-1)).toEqual({ kind: "win" });
    expect(game.score).toBe(0);
    expect(game.thrown).toBe(1);
    const over = nextTurn(game);
    expect(over.status).toBe("over");
    expect(over.won).toBe(true);
  });

  test("a turn of misses changes nothing and the game goes on", () => {
    const g = play(leaving(100), [OFF, OFF, OFF]).game;
    expect(g.score).toBe(100);
    expect(nextTurn(g).status).toBe("playing");
  });
});
