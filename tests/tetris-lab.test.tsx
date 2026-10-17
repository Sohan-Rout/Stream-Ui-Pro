/** The Tetris lab, driven through its UI: start, keyboard, drops, pause. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TetrisLab } from "@/components/demos/TetrisLab";
import { COLS, ROWS } from "@/lib/games/tetris";

afterEach(cleanup);

const board = () => screen.getByRole("group", { name: /Tetris board/ });
/** Every board cell, top-left first. */
const boardCells = () => Array.from(board().querySelectorAll(":scope > span"));
/** Board cells holding a block (falling or locked), not empty or ghost. */
const filled = () => boardCells().filter((c) => c.querySelector(".pixel-bevel"));
const ghosts = () => boardCells().filter((c) => c.querySelector(".border-dashed"));
const status = () => document.querySelector('[aria-live="polite"]')!.textContent;
const stat = (label: string) => screen.getByText(label).nextElementSibling!.textContent;

/** Slow gravity, so tests control every move. */
const GRAVITY = 60_000;

describe("TetrisLab", () => {
  test("starts on a ready screen with an empty 10×20 board", () => {
    render(<TetrisLab gravity={GRAVITY} />);
    expect(boardCells()).toHaveLength(COLS * ROWS);
    expect(filled()).toHaveLength(0);
    expect(screen.getAllByRole("button", { name: "Start" }).length).toBeGreaterThan(0);
    expect(status()).toMatch(/Press Start/);
  });

  test("Start drops in a piece with its ghost below and focuses the board", async () => {
    render(<TetrisLab gravity={GRAVITY} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    expect(document.activeElement).toBe(board());
    expect(filled()).toHaveLength(4);
    expect(ghosts().length).toBeGreaterThan(0);
    expect(status()).toMatch(/Score 0/);
  });

  test("arrow keys move the piece sideways", async () => {
    render(<TetrisLab gravity={GRAVITY} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    const columns = () => new Set(filled().map((c) => boardCells().indexOf(c) % COLS));
    const before = Math.min(...columns());
    fireEvent.keyDown(board(), { key: "ArrowLeft" });
    expect(Math.min(...columns())).toBe(before - 1);
  });

  test("Space hard-drops: the piece locks on the floor, scores, and a new one appears", async () => {
    render(<TetrisLab gravity={GRAVITY} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    fireEvent.keyDown(board(), { key: " " });
    // The locked piece (4) plus the next falling piece (4).
    expect(filled()).toHaveLength(8);
    const bottomRow = boardCells().slice((ROWS - 1) * COLS);
    expect(bottomRow.some((c) => c.querySelector(".pixel-bevel"))).toBe(true);
    expect(Number(stat("Score"))).toBeGreaterThan(0);
  });

  test("P pauses and resumes; moves are ignored while paused", async () => {
    render(<TetrisLab gravity={GRAVITY} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    fireEvent.keyDown(board(), { key: "p" });
    expect(status()).toBe("Paused.");
    const snapshot = filled().map((c) => boardCells().indexOf(c));
    fireEvent.keyDown(board(), { key: "ArrowLeft" });
    expect(filled().map((c) => boardCells().indexOf(c))).toEqual(snapshot);
    fireEvent.keyDown(board(), { key: "p" });
    expect(status()).toMatch(/Score/);
  });

  test("gravity pulls the piece down over time", async () => {
    render(<TetrisLab gravity={20} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    const top = () => Math.min(...filled().map((c) => Math.floor(boardCells().indexOf(c) / COLS)));
    const start = top();
    await new Promise((r) => setTimeout(r, 120));
    expect(top()).toBeGreaterThan(start);
  });

  test("shows the next pieces and every stat", () => {
    render(<TetrisLab gravity={GRAVITY} />);
    expect(screen.getByText("Next")).toBeTruthy();
    for (const label of ["Score", "Lines", "Level", "Best"]) expect(stat(label)).toMatch(/^\d+$/);
    expect(stat("Level")).toBe("1");
  });
});
