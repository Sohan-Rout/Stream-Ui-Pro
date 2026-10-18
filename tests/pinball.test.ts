/** Pinball physics: launching, walls, bumpers, flippers, draining, game over. */
import { describe, expect, test } from "bun:test";
import {
  BALL_R,
  BUMPERS,
  FLIPPER,
  LANE,
  LANE_POSTS,
  LANE_TOP,
  NO_INPUT,
  PIVOTS,
  RULES,
  TABLE,
  TARGETS,
  createGame,
  flipperTip,
  step,
  type Input,
  type PinballGame,
} from "@/lib/games/pinball";

const DT = 1 / 60;
const playing = (over: Partial<PinballGame> = {}): PinballGame => ({ ...createGame("playing"), ...over });
const run = (g: PinballGame, input: Partial<Input>, seconds: number) => {
  for (let t = 0; t < seconds; t += DT) g = step(g, { ...NO_INPUT, ...input }, DT);
  return g;
};
/** A free ball (off the plunger) at a position and velocity. */
const free = (x: number, y: number, vx = 0, vy = 0): Partial<PinballGame> => ({ onPlunger: false, ball: { x, y, vx, vy } });

describe("launching", () => {
  test("holding launch pulls the plunger back; the ball waits in the lane", () => {
    const g = run(playing(), { launch: true }, 0.5);
    expect(g.charge).toBeGreaterThan(0.3);
    expect(g.onPlunger).toBe(true);
    expect(g.ball.x).toBeGreaterThan(LANE.left);
  });

  test("a full pull fires the ball up the lane and onto the table", () => {
    let g = run(playing(), { launch: true }, 1.2);
    g = run(g, {}, 0.6);
    expect(g.onPlunger).toBe(false);
    let reachedTable = false;
    for (let t = 0; t < 2 && !reachedTable; t += DT) {
      g = step(g, NO_INPUT, DT);
      // Well out onto the playfield, not just bounced off the top of the lane.
      if (g.ball.x < 150) reachedTable = true;
    }
    expect(reachedTable).toBe(true);
  });

  test("a feeble launch rolls back onto the plunger instead of losing a ball", () => {
    let g = run(playing(), { launch: true }, 0.02);
    g = run(g, {}, 3);
    expect(g.onPlunger).toBe(true);
    expect(g.balls).toBe(3);
  });
});

describe("the table", () => {
  test("gravity pulls a free ball down", () => {
    const g = run(playing(free(150, 100)), {}, 0.2);
    expect(g.ball.y).toBeGreaterThan(100);
  });

  test("walls keep the ball inside", () => {
    let g = playing(free(30, 200, -900, 0));
    for (let t = 0; t < 0.5; t += DT) {
      g = step(g, NO_INPUT, DT);
      expect(g.ball.x).toBeGreaterThan(10);
    }
  });

  test("a bumper scores 100 and fires the ball away", () => {
    // The center bumper: open lane above it, so nothing knocks the ball back down.
    const b = BUMPERS[2];
    const g = run(playing(free(b.x, b.y - b.r - BALL_R - 4, 0, 200)), {}, 0.05);
    expect(g.score).toBe(100);
    expect(g.ball.vy).toBeLessThan(0);
  });

  test("a long frame is capped, so the ball can't tunnel through a wall", () => {
    const g = step(playing(free(30, 200, -1200, 0)), NO_INPUT, 2);
    expect(g.ball.x).toBeGreaterThan(10);
  });
});

describe("flippers", () => {
  test("pressing raises a flipper; letting go drops it back", () => {
    let g = run(playing(), { left: true }, 0.2);
    expect(g.flippers.left.angle).toBeCloseTo(FLIPPER.up, 2);
    expect(g.flippers.right.angle).toBeCloseTo(FLIPPER.rest, 2);
    g = run(g, {}, 0.3);
    expect(g.flippers.left.angle).toBeCloseTo(FLIPPER.rest, 2);
  });

  test("a flip sends a ball resting on the flipper back up the table", () => {
    // Rest the ball on the left flipper, two-thirds of the way out.
    const tip = flipperTip("left", FLIPPER.rest);
    const p = PIVOTS.left;
    const x = p.x + (tip.x - p.x) * 0.66;
    const y = p.y + (tip.y - p.y) * 0.66 - FLIPPER.radius - BALL_R - 1;
    let g = run(playing(free(x, y)), {}, 0.05);
    g = run(g, { left: true }, 0.08);
    expect(g.ball.vy).toBeLessThan(-300);
  });
});

describe("S/UI lanes", () => {
  const laneX = (i: number) => (LANE_POSTS[i] + LANE_POSTS[i + 1]) / 2;

  test("rolling down through a lane lights it and scores", () => {
    const g = run(playing(free(laneX(1), LANE_TOP - 2, 0, 300)), {}, 0.1);
    expect(g.lanes).toEqual([false, true, false, false]);
    expect(g.score).toBe(RULES.lane);
  });

  test("lighting the last lane raises the multiplier and resets the lanes", () => {
    const g = run(playing({ lanes: [true, true, false, true], ...free(laneX(2), LANE_TOP - 2, 0, 300) }), {}, 0.1);
    expect(g.mult).toBe(2);
    expect(g.lanes).toEqual([false, false, false, false]);
  });

  test("a fresh flipper press shifts the lit lanes; holding it doesn't", () => {
    let g = step(playing({ lanes: [true, false, false, false] }), { ...NO_INPUT, right: true }, DT);
    expect(g.lanes).toEqual([false, true, false, false]);
    g = step(g, { ...NO_INPUT, right: true }, DT);
    expect(g.lanes).toEqual([false, true, false, false]);
    g = step(step(g, NO_INPUT, DT), { ...NO_INPUT, left: true }, DT);
    expect(g.lanes).toEqual([true, false, false, false]);
  });

  test("points are multiplied", () => {
    const b = BUMPERS[0];
    const g = run(playing({ mult: 3, ...free(b.x, b.y - b.r - BALL_R - 4, 0, 200) }), {}, 0.05);
    expect(g.score).toBe(RULES.bumper * 3);
  });
});

describe("drop targets", () => {
  const at = (i: number) => {
    const t = TARGETS[i];
    return free(t.a.x + 20, (t.a.y + t.b.y) / 2, -400, 0);
  };

  test("hitting a target drops it and scores", () => {
    const g = run(playing(at(0)), {}, 0.08);
    expect(g.targets).toEqual([true, false, false]);
    expect(g.score).toBe(RULES.target);
  });

  test("clearing the bank pays the bonus, raises the multiplier, then resets the bank", () => {
    let g = run(playing({ targets: [true, false, true], ...at(1) }), {}, 0.08);
    expect(g.score).toBe(RULES.target + RULES.bank);
    expect(g.mult).toBe(2);
    g = run({ ...g, ...free(160, 100) }, {}, RULES.bankResetDelay + 0.1);
    expect(g.targets).toEqual([false, false, false]);
  });
});

describe("ball save and extra ball", () => {
  test("a drain right after launch is saved", () => {
    let g = run(playing(), { launch: true }, 1.2);
    g = step(g, NO_INPUT, DT);
    expect(g.ballSave).toBe(RULES.ballSave);
    g = run({ ...g, ...free(160, TABLE.height - 20, 0, 400) }, {}, 0.3);
    expect(g.balls).toBe(3);
    expect(g.onPlunger).toBe(true);
  });

  test("passing the mark awards one extra ball, once", () => {
    let g = step(playing({ score: RULES.extraBallAt, ...free(160, 100) }), NO_INPUT, DT);
    expect(g.balls).toBe(4);
    expect(g.events).toContainEqual({ kind: "extra" });
    g = step(g, NO_INPUT, DT);
    expect(g.balls).toBe(4);
  });

  test("a drain resets the multiplier", () => {
    const g = run(playing({ mult: 4, ...free(160, TABLE.height - 20, 0, 400) }), {}, 0.3);
    expect(g.mult).toBe(1);
  });
});

describe("draining", () => {
  test("a ball through the drain costs a ball and comes back on the plunger", () => {
    const g = run(playing(free(160, TABLE.height - 20, 0, 400)), {}, 0.3);
    expect(g.balls).toBe(2);
    expect(g.onPlunger).toBe(true);
  });

  test("the last ball drained ends the game", () => {
    const g = run(playing({ balls: 1, ...free(160, TABLE.height - 20, 0, 400) }), {}, 0.3);
    expect(g.status).toBe("over");
  });

  test("nothing moves unless playing", () => {
    const g = createGame("paused");
    expect(step(g, { ...NO_INPUT, left: true }, DT)).toBe(g);
  });
});
