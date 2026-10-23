/** Bonk the bear: the head is a button, bonks count and announce, misses don't count. */
import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BearLab } from "@/components/demos/BearLab";

afterEach(cleanup);

describe("BearLab", () => {
  test("his head is a labelled button, and each bonk counts and announces", () => {
    render(<BearLab />);
    const head = screen.getByRole("button", { name: /Bonk the bear\. 0 bonks/ });
    // detail 0 is a keyboard click (Enter or Space).
    act(() => fireEvent.click(head, { detail: 0 }));
    expect(screen.getByRole("button", { name: /Bonk the bear\. 1 bonk so far/ })).toBeTruthy();
    act(() => fireEvent.click(head, { detail: 0 }));
    expect(screen.getByText(/Bonk! 2 bonks\./)).toBeTruthy();
  });

  test("a swing that misses his head doesn't count", () => {
    render(<BearLab />);
    const board = screen.getByRole("group", { name: /Bear board/ });
    act(() => fireEvent.pointerDown(board, { button: 0, clientX: 5, clientY: 5 }));
    expect(screen.getByRole("button", { name: /Bonk the bear\. 0 bonks/ })).toBeTruthy();
  });

  test("the sound toggle is a pressed button", () => {
    render(<BearLab />);
    const sound = screen.getByRole("button", { name: "Turn sound off" });
    expect(sound.getAttribute("aria-pressed")).toBe("true");
    act(() => fireEvent.click(sound));
    expect(screen.getByRole("button", { name: "Turn sound on" }).getAttribute("aria-pressed")).toBe("false");
  });
});
