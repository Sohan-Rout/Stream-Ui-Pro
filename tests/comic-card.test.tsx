/** ComicCard: decorative panel, caption and sound effect, tones and tilt. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { CardTitle, ComicCard } from "@streamuilib/react";

afterEach(cleanup);

describe("ComicCard", () => {
  test("renders its contents; the panel shape is hidden", () => {
    const { container } = render(<ComicCard><CardTitle>Hello</CardTitle></ComicCard>);
    expect(screen.getByRole("heading", { name: "Hello" })).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  test("caption and sound effect show only when given", () => {
    render(<ComicCard caption="Meanwhile…" sfx="Kapow!">x</ComicCard>);
    expect(screen.getByText("Meanwhile…")).toBeTruthy();
    expect(screen.getByText("Kapow!")).toBeTruthy();
    cleanup();
    render(<ComicCard>x</ComicCard>);
    expect(screen.queryByText("Kapow!")).toBeNull();
  });

  test("tone tints the panel and the caption; tilt rotates; halftone is optional", () => {
    const { container } = render(<ComicCard tone="pink" caption="c" tilt={3}>x</ComicCard>);
    const root = container.firstElementChild as HTMLElement;
    expect(container.querySelector("path")?.getAttribute("class")).toContain("fill-pink-soft");
    expect(screen.getByText("c").className).toContain("bg-pink");
    expect(root.style.rotate).toBe("3deg");
    expect(root.classList.contains("text-ink")).toBe(true);
    cleanup();
    const dotted = render(<ComicCard>x</ComicCard>).container.querySelectorAll(".sui-comic-card-dots").length;
    cleanup();
    const plain = render(<ComicCard halftone={false}>x</ComicCard>).container.querySelectorAll(".sui-comic-card-dots").length;
    expect(dotted).toBe(1);
    expect(plain).toBe(0);
  });
});
