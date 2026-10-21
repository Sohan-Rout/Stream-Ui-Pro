/** ComicButton: a real button, the POW! pop on click, and its options. */
import { afterEach, describe, expect, mock, test } from "bun:test";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ComicButton } from "@streamuilib/react";

afterEach(cleanup);

describe("ComicButton", () => {
  test("is a type=button with its label as the name; the shape is decorative", () => {
    const { container } = render(<ComicButton>Go</ComicButton>);
    const b = screen.getByRole("button", { name: "Go" });
    expect(b.getAttribute("type")).toBe("button");
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  test("clicking calls onClick and pops a sound effect, cycling the list", () => {
    const onClick = mock();
    render(<ComicButton pop={["POW!", "BAM!"]} onClick={onClick}>Go</ComicButton>);
    const b = screen.getByRole("button");
    act(() => fireEvent.click(b));
    act(() => fireEvent.click(b));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByText("POW!")).toBeTruthy();
    expect(screen.getByText("BAM!")).toBeTruthy();
  });

  test("pop={false} pops nothing; preventDefault in onClick also skips it", () => {
    render(<ComicButton pop={false}>A</ComicButton>);
    act(() => fireEvent.click(screen.getByRole("button")));
    expect(screen.queryByText(/!/)).toBeNull();
    cleanup();
    render(<ComicButton onClick={(e) => e.preventDefault()}>B</ComicButton>);
    act(() => fireEvent.click(screen.getByRole("button")));
    expect(screen.queryByText(/!$/)).toBeNull();
  });

  test("tone, tilt, and halftone", () => {
    const { container } = render(<ComicButton tone="pink" tilt={5}>Hi</ComicButton>);
    const b = container.querySelector("button")!;
    expect(b.classList.contains("fill-pink")).toBe(true);
    expect(b.style.rotate).toBe("5deg");
    expect(container.querySelector("pattern")).not.toBeNull();
    cleanup();
    expect(render(<ComicButton halftone={false}>Hi</ComicButton>).container.querySelector("pattern")).toBeNull();
  });
});
