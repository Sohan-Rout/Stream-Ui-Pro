/** Muncher and Jumper, driven through their UI. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MazeLab } from "@/components/demos/MazeLab";
import { JumperLab } from "@/components/demos/JumperLab";

afterEach(cleanup);

const announce = () => document.querySelector('[aria-live="polite"]')!.textContent;

describe("MazeLab", () => {
  const board = () => screen.getByRole("group", { name: /Muncher maze/ });

  test("starts on a ready card with three lives", () => {
    render(<MazeLab tick={60_000} />);
    expect(screen.getAllByRole("button", { name: "Start" }).length).toBeGreaterThan(0);
    expect(screen.getByLabelText("3 lives")).toBeTruthy();
    expect(announce()).toMatch(/Press Start/);
  });

  test("an arrow key starts the game; ticks move the chomper and eat dots", async () => {
    render(<MazeLab tick={30} />);
    board().focus();
    fireEvent.keyDown(board(), { key: "ArrowLeft" });
    await waitFor(() => expect(announce()).toMatch(/Score [1-9]/), { timeout: 2000 });
  });

  test("Space pauses and resumes", async () => {
    render(<MazeLab tick={60_000} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    fireEvent.keyDown(board(), { key: " " });
    expect(announce()).toBe("Paused.");
    fireEvent.keyDown(board(), { key: " " });
    expect(announce()).toMatch(/Score 0/);
  });
});

describe("JumperLab", () => {
  const game = () => screen.getByRole("group", { name: /^Jumper/ });

  test("starts on a ready card with the HUD and touch controls", () => {
    render(<JumperLab />);
    expect(screen.getByText("Jumper")).toBeTruthy();
    expect(screen.getByText(/^Score/).textContent).toBe("Score 00000");
    for (const name of ["Run left", "Run right", "Jump", "Pause"]) expect(screen.getByRole("button", { name })).toBeTruthy();
  });

  test("Space on the focused game starts it", async () => {
    render(<JumperLab />);
    game().focus();
    fireEvent.keyDown(game(), { key: " " });
    await waitFor(() => expect(screen.queryByText("Jumper")).toBeNull());
    expect(announce()).toMatch(/Score 0/);
  });

  test("P pauses the running game", async () => {
    render(<JumperLab />);
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    fireEvent.keyDown(game(), { key: "p" });
    await waitFor(() => expect(announce()).toBe("Paused."));
  });
});
