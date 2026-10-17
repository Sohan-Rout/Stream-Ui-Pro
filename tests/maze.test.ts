/** Maze-chase rules: the map, movement, pellets, fright, bots, lives, levels. */
import { describe, expect, test } from "bun:test";
import {
  COLS,
  FRIGHT_TICKS,
  MAP,
  POINTS,
  ROWS,
  createGame,
  isWall,
  pelletsLeft,
  step,
  turn,
  type MazeGame,
} from "@/lib/games/maze";

const first = () => 0;
const playing = (over: Partial<MazeGame> = {}): MazeGame => ({ ...createGame("playing"), ...over });
/** Runs n ticks. */
const run = (g: MazeGame, n: number) => {
  for (let i = 0; i < n; i++) g = step(g, first);
  return g;
};
/** Bots parked in the pen for good, so a test can focus on the player. */
const noBots = (g: MazeGame): MazeGame => ({ ...g, bots: g.bots.map((b) => ({ ...b, releaseAt: Infinity })) });

describe("the map", () => {
  test("is a rectangle, symmetric left to right", () => {
    for (const row of MAP) {
      expect(row.length).toBe(COLS);
      expect(row).toBe([...row].reverse().join(""));
    }
  });

  test("every pellet is reachable from the start", () => {
    const start = MAP.findIndex((r) => r.includes("P"));
    const seen = new Set<string>();
    const queue = [{ x: MAP[start].indexOf("P"), y: start }];
    while (queue.length) {
      const { x, y } = queue.pop()!;
      const key = `${x},${y}`;
      if (seen.has(key) || isWall(x, y) || "-B".includes(MAP[y][x])) continue;
      seen.add(key);
      queue.push({ x: (x + 1) % COLS, y }, { x: (x - 1 + COLS) % COLS, y }, { x, y: y + 1 }, { x, y: y - 1 });
    }
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) if (".o".includes(MAP[y][x])) expect(seen.has(`${x},${y}`)).toBe(true);
  });
});

describe("moving and eating", () => {
  test("the player keeps going until a wall, eating dots for 10 each", () => {
    let g = noBots(playing());
    const before = pelletsLeft(g.pellets);
    g = run(g, 3);
    expect(g.player.x).toBe(4);
    expect(g.score).toBe(3 * POINTS.dot);
    expect(pelletsLeft(g.pellets)).toBe(before - 3);
  });

  test("a turn pressed early waits for the opening", () => {
    // Heading left along the bottom row; up is walled until column 4.
    let g = turn(noBots(playing()), "up");
    g = run(g, 3); // reaches x 4, where up is open
    expect(g.player).toMatchObject({ x: 4, y: ROWS - 2 });
    g = run(g, 1);
    expect(g.player).toMatchObject({ x: 4, y: ROWS - 3, dir: "up" });
  });

  test("the side tunnel wraps around", () => {
    const g = run(noBots(playing({ player: { x: 0, y: 7, dir: "left", next: null } })), 1);
    expect(g.player.x).toBe(COLS - 1);
  });

  test("nothing happens unless playing", () => {
    const g = createGame("paused");
    expect(step(g, first)).toBe(g);
    expect(turn(g, "up")).toBe(g);
  });
});

describe("power pellets and bots", () => {
  test("a power pellet scores 50 and frightens the bots", () => {
    let g = noBots(playing({ player: { x: 2, y: 1, dir: "left", next: null } }));
    g = step(g, first);
    expect(g.score).toBe(POINTS.power);
    expect(g.fright).toBe(FRIGHT_TICKS);
  });

  test("touching a chasing bot costs a life and resets positions", () => {
    let g = playing();
    g = { ...g, bots: [{ ...g.bots[0], x: g.player.x - 1, y: g.player.y, mode: "chase", dir: "right" }, ...g.bots.slice(1)] };
    g = step(g, first);
    expect(g.lives).toBe(2);
    expect(g.player.x).toBe(MAP[ROWS - 2].indexOf("P"));
  });

  test("eating frightened bots scores 200, then 400; they go home as eyes", () => {
    let g = playing({ fright: 10 });
    const at = (dx: number) => ({ ...g.bots[0], x: g.player.x + dx, y: g.player.y, mode: "chase" as const, dir: "right" as const });
    g = { ...g, bots: [at(-1), { ...at(-1), dir: "right" as const }, { ...g.bots[2], releaseAt: Infinity }] };
    g = step(g, first);
    // Two bots (200 + 400), plus the dot the player stepped onto.
    expect(g.score).toBe(POINTS.bot + POINTS.bot * 2 + POINTS.dot);
    expect(g.bots.slice(0, 2).every((b) => b.mode === "eyes")).toBe(true);
    expect(g.lives).toBe(3);
  });

  test("bots leave the pen one by one", () => {
    let g = playing();
    g = run(g, 4);
    expect(g.bots[0].mode).toBe("chase");
    expect(g.bots[2].mode).toBe("pen");
  });

  test("losing the last life ends the game", () => {
    let g = playing({ lives: 1 });
    g = { ...g, bots: [{ ...g.bots[0], x: g.player.x - 1, y: g.player.y, mode: "chase", dir: "right" }, ...g.bots.slice(1)] };
    expect(step(g, first).status).toBe("over");
  });
});

describe("levels", () => {
  test("clearing the board starts the next level with fresh pellets", () => {
    const empty = createGame().pellets.map((row) => row.map(() => 0));
    empty[ROWS - 2][6] = 1; // one dot left, right next to the player
    const g = step(noBots(playing({ pellets: empty })), first);
    expect(g.level).toBe(2);
    expect(pelletsLeft(g.pellets)).toBe(pelletsLeft(createGame().pellets));
  });
});
