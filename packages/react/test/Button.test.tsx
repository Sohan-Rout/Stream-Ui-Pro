import { describe, expect, mock, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonStyles } from "../src";

describe("Button", () => {
  test("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" }).getAttribute("type")).toBe("button");
  });

  test("respects an explicit type", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  test("applies variant and size classes", () => {
    render(
      <Button variant="pink" size="lg">
        Delete
      </Button>,
    );
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("bg-pink");
    expect(cls).toContain("h-13");
  });

  test("className overrides defaults instead of stacking", () => {
    render(<Button className="shadow-none bg-blue">Flat</Button>);
    const cls = screen.getByRole("button").className.split(" ");
    expect(cls).toContain("shadow-none");
    expect(cls).not.toContain("shadow-brutal");
    expect(cls).toContain("bg-blue");
    expect(cls).not.toContain("bg-lime");
  });

  test("fires onClick, but not when disabled", async () => {
    const onClick = mock();
    const { rerender } = render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("buttonStyles", () => {
  test("defaults to the primary, medium look", () => {
    const cls = buttonStyles();
    expect(cls).toContain("bg-lime");
    expect(cls).toContain("h-11");
  });

  test("styles a link exactly like a Button", () => {
    render(
      <>
        <Button variant="blue">A</Button>
        <a href="/x" className={buttonStyles({ variant: "blue" })}>
          A
        </a>
      </>,
    );
    expect(screen.getByRole("link").className).toBe(screen.getByRole("button").className);
  });
});
