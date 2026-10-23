/** Ghosty: one labelled button; a tap scares it, and the scare is announced. */
import { afterEach, describe, expect, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { GhostLab, Ghosty } from "@/components/demos/GhostLab";

afterEach(cleanup);

describe("Ghosty", () => {
  test("a tap scares it", () => {
    render(<Ghosty />);
    const ghost = screen.getByRole("button", { name: /Ghosty\. Tap to scare it\./ });
    expect(screen.queryByText(/scared/)).toBeNull();
    act(() => fireEvent.click(ghost));
    expect(screen.getByText("Eek! It's scared.")).toBeTruthy();
  });

  test("the lab's color picker is on its page, not on the preview card", () => {
    const { rerender } = render(<GhostLab />);
    expect(screen.getByRole("group", { name: "Color" })).toBeTruthy();
    act(() => fireEvent.click(screen.getByRole("button", { name: "cyan" })));
    expect(screen.getByRole("button", { name: "cyan" }).getAttribute("aria-pressed")).toBe("true");
    rerender(<GhostLab preview />);
    expect(screen.queryByRole("group", { name: "Color" })).toBeNull();
  });
});
