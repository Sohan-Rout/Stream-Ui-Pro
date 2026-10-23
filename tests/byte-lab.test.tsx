/** Byte: one labelled button that types its lines in turn when tapped. */
import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Byte, ByteLab } from "@/components/demos/ByteLab";

afterEach(cleanup);

describe("Byte", () => {
  test("each tap types the next line, and it's announced", () => {
    render(<Byte lines={["bun dev", "git push"]} />);
    const byte = screen.getByRole("button", { name: /Byte\. Tap and it types something\./ });
    act(() => fireEvent.click(byte));
    expect(screen.getByText("Byte typed: bun dev")).toBeTruthy();
    act(() => fireEvent.click(byte));
    expect(screen.getByText("Byte typed: git push")).toBeTruthy();
    act(() => fireEvent.click(byte));
    expect(screen.getByText("Byte typed: bun dev")).toBeTruthy();
  });

  test("the color picker is on its page, not on the preview card", () => {
    const { rerender } = render(<ByteLab />);
    expect(screen.getByRole("group", { name: "Color" })).toBeTruthy();
    rerender(<ByteLab preview />);
    expect(screen.queryByRole("group", { name: "Color" })).toBeNull();
  });
});
