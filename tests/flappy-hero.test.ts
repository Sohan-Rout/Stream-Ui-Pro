/**
 * The Flappy hero's flight: the autopilot threads every gap, play mode
 * crashes and scores like the game, and a crash hands back to autopilot.
 */
import { describe, expect, test } from "bun:test";
import { birdX, crashed, fly, pipesAt, type Flight } from "@/components/sections/FlappyHeroSection";

const DT = 1 / 60;
const start = (sky: number): Flight => ({ offset: 0, y: sky * 0.45, vy: 0, mode: "auto", score: 0, crashFor: 0 });

describe("autopilot", () => {
  // Phone, tablet, and desktop heroes: sky heights from short to tall.
  for (const [width, sky] of [
    [375, 560],
    [768, 600],
    [1280, 640],
    [1440, 720],
  ]) {
    test(`flies two minutes through every gap at ${width}×${sky}`, () => {
      let f = start(sky);
      for (let t = 0; t < 120; t += DT) {
        f = fly(f, DT, width, sky);
        expect(crashed(birdX(width), f.y, f.offset, sky)).toBe(false);
      }
      expect(f.mode).toBe("auto");
    });
  }
});

describe("play", () => {
  const width = 1280;
  const sky = 640;

  test("a flap takes over from autopilot and kicks the bird up", () => {
    let f = start(sky);
    f = { ...f, mode: "play" };
    const before = f.y;
    f = fly(f, DT, width, sky, true);
    expect(f.vy).toBeLessThan(0);
    expect(f.y).toBeLessThan(before);
  });

  test("never flapping hits the ground and crashes, then autopilot takes over again", () => {
    let f: Flight = { ...start(sky), mode: "play" };
    let t = 0;
    while (f.mode === "play" && t < 5) {
      f = fly(f, DT, width, sky);
      t += DT;
    }
    expect(f.mode).toBe("crash");
    // The world stops while crashed.
    const offset = f.offset;
    f = fly(f, 0.5, width, sky);
    expect(f.offset).toBe(offset);
    for (let s = 0; s < 1.5; s += DT) f = fly(f, DT, width, sky);
    expect(f.mode).toBe("auto");
  });

  test("flying like the autopilot scores a point per pipe passed", () => {
    // Steer by hand with the autopilot's own rule: flap when below the next gap's middle.
    let f: Flight = { ...start(sky), mode: "play" };
    for (let t = 0; t < 30 && f.mode === "play"; t += DT) {
      const x = birdX(width);
      const next = pipesAt(f.offset, sky).find((p) => p.x + 62 > x - 24)!;
      const flap = f.y > (next.top + next.bottom) / 2 + 10 && f.vy >= 0;
      f = fly(f, DT, width, sky, flap);
    }
    expect(f.mode).toBe("play");
    // 30s at 80px/s with pipes every 220px: a handful of points.
    expect(f.score).toBeGreaterThanOrEqual(8);
  });

  test("a long frame is capped, so the bird can't tunnel through a pipe", () => {
    const f = fly({ ...start(sky), mode: "play" }, 5, width, sky);
    expect(f.offset).toBeLessThanOrEqual(80 / 30 + 0.001);
  });
});
