/**
 * Lenis smooth scrolling: on by default, off for visitors who prefer
 * reduced motion, and toggled live when that preference changes.
 */
import { afterEach, describe, expect, mock, test } from "bun:test";
import { act, cleanup, render } from "@testing-library/react";

mock.module("next/navigation", () => ({ usePathname: () => "/" }));
const { SmoothScroll } = await import("@/components/blocks/SmoothScroll");

let reduced = false;
const listeners = new Set<() => void>();
window.matchMedia = ((query: string) => ({
  get matches() {
    return query.includes("reduce") && reduced;
  },
  media: query,
  addEventListener: (_: string, fn: () => void) => listeners.add(fn),
  removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
})) as unknown as typeof window.matchMedia;

const lenisOn = () => document.documentElement.classList.contains("lenis");

afterEach(() => {
  cleanup();
  reduced = false;
});

describe("SmoothScroll", () => {
  test("turns Lenis on by default", () => {
    render(<SmoothScroll />);
    expect(lenisOn()).toBe(true);
  });

  test("leaves native scrolling alone for reduced motion", () => {
    reduced = true;
    render(<SmoothScroll />);
    expect(lenisOn()).toBe(false);
  });

  test("follows a change to the reduced-motion setting", () => {
    render(<SmoothScroll />);
    expect(lenisOn()).toBe(true);
    reduced = true;
    act(() => listeners.forEach((fn) => fn()));
    expect(lenisOn()).toBe(false);
  });

  test("cleans up on unmount", () => {
    const { unmount } = render(<SmoothScroll />);
    unmount();
    expect(lenisOn()).toBe(false);
  });
});
