import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Cube } from "../src";

describe("Cube", () => {
  test("is decorative by default, and a named image with a label", () => {
    const { container, rerender } = render(<Cube />);
    expect((container.firstElementChild as HTMLElement).getAttribute("aria-hidden")).toBe("true");
    rerender(<Cube label="Spinning cube" />);
    expect(screen.getByRole("img", { name: "Spinning cube" })).toBeTruthy();
  });

  test("draws six faces; beveled faces carry a raised key", () => {
    const { container, rerender } = render(<Cube />);
    const faces = () => container.querySelectorAll(".sui-cube-scene > span");
    expect(faces()).toHaveLength(6);
    expect(container.querySelectorAll(".sui-cube-scene > span > span")).toHaveLength(0);
    rerender(<Cube variant="beveled" />);
    expect(container.querySelectorAll(".sui-cube-scene > span > span")).toHaveLength(6);
  });

  test("spin sets data-spin; none leaves it off", () => {
    const { container, rerender } = render(<Cube spin="loop" />);
    expect((container.firstElementChild as HTMLElement).dataset.spin).toBe("loop");
    rerender(<Cube />);
    expect((container.firstElementChild as HTMLElement).dataset.spin).toBeUndefined();
  });
});
