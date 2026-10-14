import { describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import { AnimatedIcon, iconAnimations } from "../src";

const Icon = () => (
  <svg data-testid="icon" viewBox="0 0 24 24">
    <path d="M4 4h16" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const wrapper = () => screen.getByTestId("icon").parentElement as HTMLElement;

describe("AnimatedIcon", () => {
  test("exposes animation and trigger as data attributes, defaulting to hover", () => {
    render(
      <AnimatedIcon animation="spin">
        <Icon />
      </AnimatedIcon>,
    );
    expect(wrapper().dataset.suiIcon).toBe("spin");
    expect(wrapper().dataset.suiTrigger).toBe("hover");
  });

  test("passes duration through as a CSS variable", () => {
    render(
      <AnimatedIcon animation="pulse" trigger="loop" duration={1200}>
        <Icon />
      </AnimatedIcon>,
    );
    expect(wrapper().style.getPropertyValue("--sui-icon-duration")).toBe("1200ms");
    expect(wrapper().dataset.suiTrigger).toBe("loop");
  });

  test("draw normalizes every shape to pathLength=1 and marks itself ready", () => {
    render(
      <AnimatedIcon animation="draw">
        <Icon />
      </AnimatedIcon>,
    );
    for (const shape of wrapper().querySelectorAll("path, circle")) {
      expect(shape.getAttribute("pathLength")).toBe("1");
    }
    expect(wrapper().hasAttribute("data-sui-ready")).toBe(true);
  });

  test("draw also primes shapes that render later (lazy icons)", async () => {
    render(
      <AnimatedIcon animation="draw">
        <Icon />
      </AnimatedIcon>,
    );
    const late = document.createElementNS("http://www.w3.org/2000/svg", "line");
    screen.getByTestId("icon").appendChild(late);
    await waitFor(() => expect(late.getAttribute("pathLength")).toBe("1"));
  });

  test("other animations leave the SVG untouched", () => {
    render(
      <AnimatedIcon animation="bounce">
        <Icon />
      </AnimatedIcon>,
    );
    expect(wrapper().querySelector("path")?.hasAttribute("pathLength")).toBe(false);
    expect(wrapper().hasAttribute("data-sui-ready")).toBe(false);
  });

  test("ships the documented set of animations", () => {
    expect([...iconAnimations]).toEqual(["draw", "spin", "bounce", "wiggle", "pulse", "shake", "pop"]);
  });
});
