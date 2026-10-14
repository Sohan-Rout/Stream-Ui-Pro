import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Avatar, AvatarGroup, Badge, Progress } from "../src";

describe("Progress", () => {
  const bar = () => screen.getByRole("progressbar");
  const fill = () => bar().firstElementChild as HTMLElement;

  test("exposes its value range", () => {
    render(<Progress value={40} aria-label="Upload" />);
    expect(bar().getAttribute("aria-valuenow")).toBe("40");
    expect(bar().getAttribute("aria-valuemin")).toBe("0");
    expect(bar().getAttribute("aria-valuemax")).toBe("100");
    expect(fill().style.width).toBe("40%");
  });

  test("clamps values outside 0..max", () => {
    const { rerender } = render(<Progress value={150} aria-label="x" />);
    expect(bar().getAttribute("aria-valuenow")).toBe("100");
    expect(fill().style.width).toBe("100%");
    rerender(<Progress value={-20} aria-label="x" />);
    expect(bar().getAttribute("aria-valuenow")).toBe("0");
    expect(fill().style.width).toBe("0%");
  });

  test("scales to a custom max", () => {
    render(<Progress value={2} max={5} aria-label="x" />);
    expect(fill().style.width).toBe("40%");
  });

  test("max of 0 renders empty instead of NaN", () => {
    render(<Progress value={3} max={0} aria-label="x" />);
    expect(fill().style.width).toBe("0%");
  });
});

describe("Avatar", () => {
  test("with a name, reads the full name instead of the initials", () => {
    render(<Avatar initials="AL" name="Ada Lovelace" />);
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeDefined();
  });

  test("without a name, is plain text", () => {
    render(<Avatar initials="AL" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("AL")).toBeDefined();
  });

  test("AvatarGroup is a labelled group", () => {
    render(
      <AvatarGroup aria-label="Team">
        <Avatar initials="A" />
        <Avatar initials="B" />
      </AvatarGroup>,
    );
    expect(screen.getByRole("group", { name: "Team" }).children).toHaveLength(2);
  });
});

describe("Badge", () => {
  test("applies its tone", () => {
    render(<Badge tone="violet">beta</Badge>);
    expect(screen.getByText("beta").className).toContain("bg-violet");
  });
});
