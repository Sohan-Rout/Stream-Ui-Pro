/** Screen buddy: one button that cycles its moods, or shows the content it's given. */
import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ScreenBuddy } from "@/components/demos/ScreenBuddyLab";

afterEach(cleanup);

describe("ScreenBuddy", () => {
  test("is one labelled button; a tap moves to the next mood", () => {
    render(<ScreenBuddy interval={0} />);
    const buddy = screen.getByRole("button", { name: /Screen buddy\. Tap to change its face\./ });
    expect(screen.getByText("Looking idle")).toBeTruthy();
    act(() => fireEvent.click(buddy));
    expect(screen.getByText("Looking happy")).toBeTruthy();
  });

  test("expressions sets which moods it cycles", () => {
    render(<ScreenBuddy interval={0} expressions={["love", "sleepy"]} />);
    expect(screen.getByText("Looking love")).toBeTruthy();
    act(() => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByText("Looking sleepy")).toBeTruthy();
    act(() => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByText("Looking love")).toBeTruthy();
  });

  test("content shows any SVG; faces cycles a list", () => {
    const { rerender } = render(<ScreenBuddy interval={0} content={<svg data-testid="mine" />} />);
    expect(screen.getByTestId("mine")).toBeTruthy();
    expect(screen.getByText("Showing 1 of 1")).toBeTruthy();
    rerender(<ScreenBuddy interval={0} faces={[<svg key="a" data-testid="a" />, <svg key="b" data-testid="b" />]} />);
    expect(screen.getByTestId("a")).toBeTruthy();
    act(() => fireEvent.click(screen.getByRole("button")));
    expect(screen.getByTestId("b")).toBeTruthy();
  });
});
