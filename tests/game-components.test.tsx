import { describe, expect, test } from "bun:test";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TicTacToeLab } from "@/components/demos/TicTacToeLab";
import { MemoryLab } from "@/components/demos/MemoryLab";
import { SnakeLab } from "@/components/demos/SnakeLab";

const cell = (row: number, col: number) =>
  screen.getByRole("button", { name: new RegExp(`^Row ${row}, column ${col}:`) });
/** The polite live region that announces turns and results. */
const status = () => document.querySelector('[aria-live="polite"]') as HTMLElement;

describe("TicTacToeLab", () => {
  test("against the CPU: you play X, the CPU answers with O", async () => {
    render(<TicTacToeLab cpuDelay={0} />);
    expect(status().textContent).toBe("Your move (X)");

    await userEvent.click(cell(1, 1));
    expect(cell(1, 1).getAttribute("aria-label")).toBe("Row 1, column 1: X");

    await waitFor(() => expect(screen.getAllByRole("button", { name: /: O$/ })).toHaveLength(1));
    expect(status().textContent).toBe("Your move (X)");
  });

  test("taken cells and moves during the CPU's turn are ignored", async () => {
    render(<TicTacToeLab cpuDelay={50} />);
    await userEvent.click(cell(2, 2));
    expect(status().textContent).toBe("CPU is thinking…");
    await userEvent.click(cell(2, 2));
    await userEvent.click(cell(1, 1));
    expect(cell(1, 1).getAttribute("aria-label")).toBe("Row 1, column 1: empty");
    await waitFor(() => expect(status().textContent).toBe("Your move (X)"));
  });

  test("two players: marks alternate and a line wins and scores", async () => {
    render(<TicTacToeLab />);
    await userEvent.click(screen.getByRole("button", { name: "2 players" }));
    expect(status().textContent).toBe("X to move");

    // X: top row; O: middle row.
    for (const [r, c] of [[1, 1], [2, 1], [1, 2], [2, 2], [1, 3]]) await userEvent.click(cell(r, c));

    expect(status().textContent).toBe("X wins!");
    expect(cell(3, 3).getAttribute("aria-disabled")).toBe("true");
    const xScore = screen.getByText("X", { selector: "dt" }).nextElementSibling;
    expect(xScore?.textContent).toBe("1");
  });

  test("arrow keys move focus around the board, wrapping at edges", async () => {
    render(<TicTacToeLab />);
    cell(2, 2).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(cell(2, 3));
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(cell(2, 1));
    await userEvent.keyboard("{ArrowUp}{ArrowUp}");
    expect(document.activeElement).toBe(cell(3, 1));
  });

  test("only one cell is in the tab order", () => {
    render(<TicTacToeLab />);
    const tabbable = screen.getAllByRole("button", { name: /^Row/ }).filter((b) => b.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
  });
});

describe("MemoryLab", () => {
  // Identity shuffle: pairs sit side by side, so cards 1+2 match and 1+3 don't.
  const ordered = <T,>(deck: T[]) => deck;
  const card = (n: number) => screen.getByRole("button", { name: new RegExp(`^Card ${n}:`) });

  test("starts with every card face down", () => {
    render(<MemoryLab />);
    expect(screen.getAllByRole("button", { name: /face down/ })).toHaveLength(16);
  });

  test("a matching pair stays face up and counts as a move", async () => {
    render(<MemoryLab shuffleDeck={ordered} />);
    await userEvent.click(card(1));
    await userEvent.click(card(2));
    expect(card(1).getAttribute("aria-label")).toBe("Card 1: rocket, matched");
    expect(card(2).getAttribute("aria-label")).toBe("Card 2: rocket, matched");
    expect(screen.getByText("Match: rockets.")).toBeDefined();
  });

  test("a wrong pair is announced, then flips back", async () => {
    render(<MemoryLab shuffleDeck={ordered} mismatchDelay={20} />);
    await userEvent.click(card(1));
    await userEvent.click(card(3));
    expect(screen.getByText("No match: rocket and heart.")).toBeDefined();
    await waitFor(() => expect(card(1).getAttribute("aria-label")).toBe("Card 1: face down"));
    expect(card(3).getAttribute("aria-label")).toBe("Card 3: face down");
  });

  test("finding every pair solves the board", async () => {
    render(<MemoryLab shuffleDeck={ordered} />);
    for (let n = 1; n <= 16; n += 2) {
      await userEvent.click(card(n));
      await userEvent.click(card(n + 1));
    }
    expect(screen.getByText("Solved in 8 moves!")).toBeDefined();
  });

  test("the deck is shuffled on the first flip, not on render", async () => {
    let calls = 0;
    const counting = <T,>(deck: T[]) => {
      calls++;
      return deck;
    };
    render(<MemoryLab shuffleDeck={counting} />);
    expect(calls).toBe(0);
    await userEvent.click(card(5));
    await userEvent.click(card(6));
    expect(calls).toBe(1);
  });
});

describe("SnakeLab", () => {
  const board = () => screen.getByRole("group", { name: /Snake board/ });
  const segments = () => board().querySelectorAll(":scope > span").length;

  test("starts paused on a ready screen with three styles", () => {
    render(<SnakeLab tick={20} />);
    // One on the board overlay, one in the middle of the direction pad.
    expect(screen.getAllByRole("button", { name: "Start" })).toHaveLength(2);
    const styles = within(screen.getByRole("group", { name: "Style" })).getAllByRole("button");
    expect(styles.map((b) => b.textContent)).toEqual(["Classic", "Funky", "Pixelated"]);
    expect(styles.map((b) => b.getAttribute("aria-pressed"))).toEqual(["true", "false", "false"]);
  });

  test("switching styles reskins the board without resetting it", async () => {
    render(<SnakeLab tick={20} />);
    await userEvent.click(screen.getByRole("button", { name: "Pixelated" }));
    expect(board().dataset.style).toBe("pixel");
    expect(screen.getByRole("button", { name: "Pixelated" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("0000")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "Funky" }));
    expect(board().dataset.style).toBe("funky");
  });

  test("an arrow key on the focused board starts the game", async () => {
    render(<SnakeLab tick={20} />);
    board().focus();
    await userEvent.keyboard("{ArrowUp}");
    await waitFor(() => expect(screen.queryByRole("button", { name: "Start" })).toBeNull());
    expect(screen.getByRole("button", { name: "Pause" })).toBeDefined();
  });

  test("Space pauses and resumes", async () => {
    render(<SnakeLab tick={20} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    board().focus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("button", { name: "Resume" })).toBeDefined();
    await userEvent.keyboard(" ");
    expect(screen.queryByRole("button", { name: "Resume" })).toBeNull();
  });

  test("left alone, the snake runs into the wall and the game ends", async () => {
    render(<SnakeLab tick={5} />);
    await userEvent.click(screen.getAllByRole("button", { name: "Start" })[0]);
    await waitFor(() => expect(screen.getByRole("button", { name: "Play again" })).toBeDefined(), { timeout: 2000 });
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toMatch(/^Game over\. Score \d+\.$/);
    expect(segments()).toBeGreaterThanOrEqual(4);
  });
});
