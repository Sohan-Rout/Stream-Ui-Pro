/** Hammer lab: nails take three hits, the count, the reset, and keyboard hits. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HammerLab } from "@/components/demos/HammerLab";

afterEach(cleanup);

const nail = (n: number) => screen.getByRole("button", { name: new RegExp(`^Nail ${n},`) });

describe("Hammer lab", () => {
  test("a nail takes three hits to go all the way in", () => {
    render(<HammerLab />);
    expect(nail(1).getAttribute("aria-label")).toBe("Nail 1, 3 hits left");
    fireEvent.click(nail(1));
    fireEvent.click(nail(1));
    expect(nail(1).getAttribute("aria-label")).toBe("Nail 1, 1 hit left");
    fireEvent.click(nail(1));
    expect(nail(1).getAttribute("aria-label")).toBe("Nail 1, all the way in");
    expect(screen.getByText(/Nails in/).textContent).toBe("Nails in 1/5");
    // Extra hits on a flush nail do nothing.
    fireEvent.click(nail(1));
    expect(screen.getByText(/Nails in/).textContent).toBe("Nails in 1/5");
  });

  test("all five in shows the reset, which pulls them back out", () => {
    render(<HammerLab />);
    for (let n = 1; n <= 5; n++) for (let i = 0; i < 3; i++) fireEvent.click(nail(n));
    expect(screen.getByText("All in!")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Pull them out/ }));
    expect(screen.getByText(/Nails in/).textContent).toBe("Nails in 0/5");
    expect(screen.queryByText("All in!")).toBeNull();
  });

  test("a keyboard hit (a click with no pointer) still swings the mallet", () => {
    const { container } = render(<HammerLab />);
    expect(container.querySelector(".hammer-lab-swing")).toBeNull();
    fireEvent.click(nail(3), { detail: 0 });
    expect(container.querySelector(".hammer-lab-swing")).not.toBeNull();
  });
});
