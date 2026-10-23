/** Retro radio: power, keyboard tuning onto a station, volume, and locking on. */
import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RadioLab } from "@/components/demos/RadioLab";

afterEach(cleanup);

const tune = () => screen.getByRole("slider", { name: "Tune" });

describe("RadioLab", () => {
  test("power is a pressed toggle", () => {
    render(<RadioLab />);
    const power = screen.getByRole("button", { name: "Power" });
    expect(power.getAttribute("aria-pressed")).toBe("false");
    act(() => fireEvent.click(power));
    expect(power.getAttribute("aria-pressed")).toBe("true");
  });

  test("the tuning knob is a slider: Page Up jumps a megahertz and lands on stations", () => {
    render(<RadioLab />);
    expect(tune().getAttribute("aria-valuenow")).toBe("92.4");
    for (let i = 0; i < 9; i++) act(() => fireEvent.keyDown(tune(), { key: "PageUp" }));
    expect(tune().getAttribute("aria-valuenow")).toBe("101.4");
    expect(tune().getAttribute("aria-valuetext")).toBe("101.4 FM, OFFSET 101");
    act(() => fireEvent.keyDown(tune(), { key: "End" }));
    expect(tune().getAttribute("aria-valuenow")).toBe("108");
  });

  test("volume stays within 0 to 10", () => {
    render(<RadioLab />);
    const vol = screen.getByRole("slider", { name: "Vol" });
    for (let i = 0; i < 8; i++) act(() => fireEvent.keyDown(vol, { key: "ArrowUp" }));
    expect(vol.getAttribute("aria-valuenow")).toBe("10");
    expect(vol.getAttribute("aria-valuetext")).toBe("Volume 10 of 10");
  });

  test("near a station it's static; close enough, it locks on", () => {
    render(<RadioLab />);
    // 101.7 is 0.4 MHz off OFFSET 101: only a faint signal. 101.4 locks on.
    for (let i = 0; i < 9; i++) act(() => fireEvent.keyDown(tune(), { key: "PageUp" }));
    for (let i = 0; i < 3; i++) act(() => fireEvent.keyDown(tune(), { key: "ArrowUp" }));
    expect(tune().getAttribute("aria-valuetext")).toBe("101.7 FM, static");
    for (let i = 0; i < 3; i++) act(() => fireEvent.keyDown(tune(), { key: "ArrowDown" }));
    expect(tune().getAttribute("aria-valuetext")).toBe("101.4 FM, OFFSET 101");
  });
});
