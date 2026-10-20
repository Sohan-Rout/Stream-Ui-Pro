/** ComicBadge: readable text, decorative shape, every shape draws, tilt and animation. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ComicBadge, type ComicBadgeShape } from "@streamuilib/react";

afterEach(cleanup);
const SHAPES: ComicBadgeShape[] = ["burst", "seal", "splat", "blob", "bubble", "ribbon"];

describe("ComicBadge", () => {
  test("the label is plain text and the shape is hidden from screen readers", () => {
    const { container } = render(<ComicBadge>New!</ComicBadge>);
    expect(screen.getByText("New!")).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  for (const shape of SHAPES) {
    test(`${shape} draws a closed outline`, () => {
      const { container } = render(<ComicBadge shape={shape}>Hi</ComicBadge>);
      const d = container.querySelector("path")?.getAttribute("d") ?? "";
      expect(d.startsWith("M")).toBe(true);
      expect(d.trim().endsWith("Z")).toBe(true);
      expect(d).not.toContain("NaN");
    });
  }

  test("tone colors the shape; tilt rotates; animation is opt-in", () => {
    const { container } = render(
      <ComicBadge tone="pink" tilt={12} animate="wiggle">
        Wow
      </ComicBadge>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains("fill-pink")).toBe(true);
    expect(root.style.rotate).toBe("12deg");
    expect(root.dataset.suiComic).toBe("wiggle");
    cleanup();
    const plain = render(<ComicBadge>Hi</ComicBadge>).container.firstElementChild as HTMLElement;
    expect(plain.dataset.suiComic).toBeUndefined();
  });
});
