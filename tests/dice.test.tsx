import { describe, expect, test } from "bun:test";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { DiceLab, FACES, PIPS, PLACEMENT, SHOW, SPIN, rollFace, type Face } from "@/components/demos/DiceLab";

/* 3D rotation matrices in CSS's coordinate system (y points down). */
type Vec = [number, number, number];
const rad = (deg: number) => (deg * Math.PI) / 180;
const rotX = (deg: number, [x, y, z]: Vec): Vec => {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [x, y * c - z * s, y * s + z * c];
};
const rotY = (deg: number, [x, y, z]: Vec): Vec => {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [x * c + z * s, y, -x * s + z * c];
};
const round = (v: Vec) => v.map((n) => Math.round(n) + 0) as Vec;

/** Outward normal of a face, from its CSS placement transform. */
function normal(face: Face): Vec {
  const [, axis, deg] = PLACEMENT[face].match(/rotate([XY])\((-?\d+)deg\)/)!;
  return axis === "X" ? rotX(Number(deg), [0, 0, 1]) : rotY(Number(deg), [0, 0, 1]);
}

describe("dice geometry", () => {
  test("each face shows as many pips as its value", () => {
    for (const f of FACES) expect(PIPS[f]).toHaveLength(f);
  });

  test("opposite faces add up to 7, like a real die", () => {
    for (const f of FACES) {
      const opposite = (7 - f) as Face;
      expect(round(normal(f))).toEqual(round(normal(opposite)).map((n) => -n + 0) as Vec);
    }
  });

  test("the six faces cover all six sides of the cube", () => {
    const sides = new Set(FACES.map((f) => round(normal(f)).join(",")));
    expect(sides.size).toBe(6);
  });

  test("the rotation for each result turns that face toward the viewer", () => {
    for (const f of FACES) {
      const [x, y] = SHOW[f];
      // The cube applies rotateX(x) rotateY(y): y first, then x.
      expect({ face: f, facing: round(rotX(x, rotY(y, normal(f)))) }).toEqual({ face: f, facing: [0, 0, 1] });
    }
  });

  test("extra spins are whole turns, so they never change the result", () => {
    expect(SPIN % 360).toBe(0);
  });
});

describe("rollFace", () => {
  test("only returns 1 through 6, and every face comes up", () => {
    const counts = new Map<number, number>();
    for (let i = 0; i < 6000; i++) {
      const f = rollFace();
      expect(FACES).toContain(f);
      counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    // Expected ~1000 each; 700 leaves a huge margin for randomness.
    for (const f of FACES) expect(counts.get(f)!).toBeGreaterThan(700);
  });
});

describe("DiceLab", () => {
  test("starts ready, rolls, then announces the result once it settles", () => {
    render(<DiceLab />);
    const status = () => screen.getByText(/ready|rolling|rolled/).textContent;
    expect(status()).toBe("ready");

    fireEvent.click(screen.getByRole("button", { name: "Roll" }));
    expect(status()).toBe("rolling…");

    const cube = document.querySelector(".transform-3d > .transform-3d") as HTMLElement;
    act(() => {
      cube.dispatchEvent(Object.assign(new Event("transitionend", { bubbles: true }), { propertyName: "transform" }));
    });
    expect(status()).toMatch(/^rolled [1-6]$/);
  });

  test("the die itself is hidden from screen readers; the status is live", () => {
    render(<DiceLab />);
    expect(document.querySelector(".perspective-\\[600px\\]")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("ready").getAttribute("aria-live")).toBe("polite");
  });
});
