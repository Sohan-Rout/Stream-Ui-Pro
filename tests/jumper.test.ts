/** Platformer rules: the level, running, jumping, blocks, coins, walkers, pits, the flag. */
import { describe, expect, test } from "bun:test";
import {
  FLAG_X,
  LEVEL_H,
  LEVEL_W,
  NO_INPUT,
  PITS,
  PLAYER,
  POINTS,
  TILE,
  WALKER,
  buildLevel,
  cameraX,
  createGame,
  step,
  type Input,
  type JumperGame,
} from "@/lib/games/jumper";

const DT = 1 / 60;
const playing = (over: Partial<JumperGame> = {}): JumperGame => ({ ...createGame("playing"), walkers: [], ...over });
/** Hold an input for `seconds`; `jumpPressed` only counts on the first frame, like a real key press. */
function hold(game: JumperGame, input: Partial<Input>, seconds: number) {
  let g = game;
  for (let t = 0; t < seconds; t += DT) {
    g = step(g, { ...NO_INPUT, ...input, jumpPressed: t === 0 && !!input.jumpPressed }, DT);
  }
  return g;
}

describe("the level", () => {
  const grid = buildLevel();

  test("is the right size, with ground under the start and the flag", () => {
    expect(grid).toHaveLength(LEVEL_H);
    for (const row of grid) expect(row).toHaveLength(LEVEL_W);
    expect(grid[10][2]).toBe("#");
    expect(grid[10][FLAG_X]).toBe("#");
  });

  test("every pit is at most three tiles wide, so a running jump clears it", () => {
    for (const [a, b] of PITS) {
      expect(b - a + 1).toBeLessThanOrEqual(3);
      for (let x = a; x <= b; x++) expect(grid[10][x]).toBe(" ");
    }
  });
});

describe("moving", () => {
  test("standing still on the ground stays put", () => {
    const g = hold(playing(), {}, 0.5);
    expect(g.player.onGround).toBe(true);
    expect(g.player.y).toBe(10 * TILE - PLAYER.h);
  });

  test("holding right runs right and faces right; left turns around", () => {
    let g = hold(playing(), { right: true }, 0.5);
    expect(g.player.x).toBeGreaterThan(2 * TILE + 30);
    g = hold(g, { left: true }, 0.2);
    expect(g.player.facing).toBe(-1);
  });

  test("a jump rises at least three and a half tiles, then lands", () => {
    let g = playing();
    const ground = g.player.y;
    let peak = ground;
    for (let t = 0; t < 1.2; t += DT) {
      g = step(g, { ...NO_INPUT, jump: true, jumpPressed: t === 0 }, DT);
      peak = Math.min(peak, g.player.y);
    }
    expect(ground - peak).toBeGreaterThan(3.5 * TILE);
    expect(g.player.onGround).toBe(true);
  });

  test("letting go early makes a shorter hop", () => {
    const peakOf = (heldFor: number) => {
      let g = playing();
      let peak = g.player.y;
      for (let t = 0; t < 1; t += DT) {
        g = step(g, { ...NO_INPUT, jump: t < heldFor, jumpPressed: t === 0 }, DT);
        peak = Math.min(peak, g.player.y);
      }
      return peak;
    };
    expect(peakOf(0.05)).toBeGreaterThan(peakOf(1));
  });

  test("a running jump clears the widest pit", () => {
    const [a, b] = PITS[0];
    let g = playing({ player: { ...createGame().player, x: (a - 3) * TILE } });
    g = hold(g, { right: true }, 0.3);
    g = hold(g, { right: true, jump: true, jumpPressed: true }, 0.8);
    expect(g.status).toBe("playing");
    expect(g.player.x).toBeGreaterThan((b + 1) * TILE);
  });
});

describe("blocks and coins", () => {
  test("bumping a bonus block from below pays a coin once and empties it", () => {
    let g = playing({ player: { ...createGame().player, x: 9 * TILE + 3 } });
    g = hold(g, { jump: true, jumpPressed: true }, 0.6);
    expect(g.grid[6][9]).toBe("u");
    expect(g.coins).toBe(1);
    expect(g.score).toBe(POINTS.bonus);
    g = hold(g, { jump: true, jumpPressed: true }, 0.6);
    expect(g.coins).toBe(1);
  });

  test("running through coins collects them", () => {
    // The coin row at y 7 sits right above a jump from column 21.
    let g = playing({ player: { ...createGame().player, x: 21 * TILE + 3 } });
    g = hold(g, { jump: true, jumpPressed: true }, 0.5);
    expect(g.coins).toBeGreaterThan(0);
    expect(g.grid[7][21]).toBe(" ");
  });
});

describe("walkers, pits, and the flag", () => {
  const walkerAt = (x: number) => ({ x, y: 10 * TILE - WALKER.h, vx: -WALKER.speed, vy: 0, alive: true, awake: true });

  test("landing on a walker stomps it and bounces you up", () => {
    const start = createGame().player;
    let g = playing({ player: { ...start, x: 6 * TILE, y: 10 * TILE - WALKER.h - PLAYER.h - 30, vy: 200, onGround: false }, walkers: [walkerAt(6 * TILE)] });
    g = hold(g, {}, 0.15);
    expect(g.walkers[0].alive).toBe(false);
    expect(g.score).toBe(POINTS.stomp);
    expect(g.lives).toBe(3);
  });

  test("walking into a walker costs a life, then you respawn", () => {
    let g = playing({ walkers: [walkerAt(2 * TILE + 24)] });
    g = hold(g, { right: true }, 0.4);
    expect(g.status).toBe("dead");
    expect(g.lives).toBe(2);
    g = hold(g, {}, 1.1);
    expect(g.status).toBe("playing");
    // The walker is still near the start, but a fresh life is briefly safe.
    expect(g.safeFor).toBeGreaterThan(0);
    g = hold(g, {}, 0.5);
    expect(g.status).toBe("playing");
    expect(g.lives).toBe(2);
  });

  test("falling into a pit costs a life; the last one ends the game", () => {
    const [a] = PITS[0];
    let g = playing({ lives: 1, player: { ...createGame().player, x: a * TILE + 10, y: 10 * TILE, onGround: false } });
    g = hold(g, {}, 0.5);
    expect(g.status).toBe("dead");
    g = hold(g, {}, 1.1);
    expect(g.status).toBe("over");
  });

  test("reaching the flag wins and scores 1000", () => {
    let g = playing({ player: { ...createGame().player, x: (FLAG_X - 1) * TILE } });
    g = hold(g, { right: true }, 0.5);
    expect(g.status).toBe("won");
    expect(g.score).toBe(POINTS.flag);
  });

  test("the camera follows the player but stays inside the level", () => {
    expect(cameraX(playing())).toBe(0);
    const end = playing({ player: { ...createGame().player, x: (LEVEL_W - 1) * TILE } });
    expect(cameraX(end)).toBe(LEVEL_W * TILE - 320);
  });
});
