/** Battery: its meter semantics, clamping, auto colors, segments, and states. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { Battery } from "@streamuilib/react";

afterEach(cleanup);

const meter = () => screen.getByRole("meter");
const fills = (el: HTMLElement) => [...el.querySelectorAll<HTMLElement>(".sui-battery-fill")];

describe("Battery", () => {
  test("is a named meter from 0 to 100 with a spoken value", () => {
    render(<Battery value={72} label="Phone battery" />);
    const m = meter();
    expect(m.getAttribute("aria-label")).toBe("Phone battery");
    expect(m.getAttribute("aria-valuenow")).toBe("72");
    expect(m.getAttribute("aria-valuemin")).toBe("0");
    expect(m.getAttribute("aria-valuemax")).toBe("100");
    expect(m.getAttribute("aria-valuetext")).toBe("72%");
    expect(m.textContent).toBe("72%");
  });

  test("clamps and rounds the value", () => {
    render(<Battery value={140.4} />);
    expect(meter().getAttribute("aria-valuenow")).toBe("100");
    cleanup();
    render(<Battery value={-5} />);
    expect(meter().getAttribute("aria-valuenow")).toBe("0");
    cleanup();
    render(<Battery value={33.6} />);
    expect(meter().getAttribute("aria-valuenow")).toBe("34");
  });

  test("auto tone: lime when healthy, orange at half or less, pink when low", () => {
    for (const [value, tone] of [[80, "bg-lime"], [50, "bg-orange"], [20, "bg-pink"], [5, "bg-pink"]] as const) {
      const { container } = render(<Battery value={value} />);
      expect(fills(container)[0].classList.contains(tone)).toBe(true);
      cleanup();
    }
  });

  test("a fixed tone overrides auto, and lowAt moves the low mark", () => {
    const { container } = render(<Battery value={10} tone="blue" />);
    expect(fills(container)[0].classList.contains("bg-blue")).toBe(true);
    cleanup();
    render(<Battery value={30} lowAt={30} />);
    expect(meter().getAttribute("aria-valuetext")).toBe("30%, low");
  });

  test("the fill width follows the value", () => {
    const { container } = render(<Battery value={64} />);
    expect(fills(container)[0].style.width).toBe("64%");
  });

  test("segments light in proportion, and any charge lights one", () => {
    const lit = (value: number, segments: number) => {
      const { container } = render(<Battery value={value} segments={segments} />);
      const n = fills(container).filter((f) => !f.classList.contains("bg-transparent")).length;
      cleanup();
      return n;
    };
    expect(lit(100, 5)).toBe(5);
    expect(lit(55, 5)).toBe(3);
    expect(lit(80, 4)).toBe(3); // not full until it's nearly full
    expect(lit(95, 4)).toBe(4);
    expect(lit(1, 4)).toBe(1);
    expect(lit(0, 4)).toBe(0);
  });

  test("charging shows a bolt, says so, and doesn't blink even when low", () => {
    const { container } = render(<Battery value={12} charging />);
    const m = meter();
    expect(m.getAttribute("aria-valuetext")).toBe("12%, charging, low");
    expect(m.hasAttribute("data-charging")).toBe(true);
    expect(m.hasAttribute("data-low")).toBe(false);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  test("a low battery that isn't charging blinks", () => {
    render(<Battery value={8} />);
    expect(meter().hasAttribute("data-low")).toBe(true);
  });

  test("the percentage can be hidden, and the root sets its own ink color", () => {
    const { container } = render(<Battery value={45} showValue={false} />);
    expect(meter().textContent).toBe("");
    expect(container.firstElementChild?.classList.contains("text-ink")).toBe(true);
  });
});
