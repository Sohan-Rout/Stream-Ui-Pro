/** The platformer hero's bonus blocks: each pays out once, and the HUD keeps count. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlatformerHeroSection } from "@/components/sections/PlatformerHeroSection";

afterEach(cleanup);

const bonus = () => screen.queryAllByRole("button", { name: "Bonus block: collect a coin" });
const hud = () => screen.getByText(/^Coins/).textContent;

describe("PlatformerHeroSection", () => {
  test("starts with two bonus blocks and an empty HUD", () => {
    render(<PlatformerHeroSection />);
    expect(bonus()).toHaveLength(2);
    expect(hud()).toBe("Coins ×00");
    expect(screen.getByText(/^Score/).textContent).toBe("Score 000000");
  });

  test("bumping a block collects a coin, scores, and empties the block", async () => {
    render(<PlatformerHeroSection />);
    await userEvent.click(bonus()[0]);
    expect(hud()).toBe("Coins ×01");
    expect(screen.getByText(/^Score/).textContent).toBe("Score 000200");
    const empty = screen.getByRole("button", { name: "Empty block" }) as HTMLButtonElement;
    expect(empty.disabled).toBe(true);
    expect(document.querySelector('[aria-live="polite"]')!.textContent).toBe("1 coin, score 200.");
  });

  test("each block pays out once, and works from the keyboard", async () => {
    render(<PlatformerHeroSection />);
    const [first, second] = bonus();
    await userEvent.click(first);
    await userEvent.click(first);
    second.focus();
    await userEvent.keyboard("{Enter}");
    expect(hud()).toBe("Coins ×02");
    expect(bonus()).toHaveLength(0);
  });
});
