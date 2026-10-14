import { describe, expect, mock, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../src";

const checked = () => screen.getByRole("switch").getAttribute("aria-checked");

describe("Switch", () => {
  test("is exposed as a switch with an accessible name", () => {
    render(<Switch aria-label="Email alerts" />);
    expect(screen.getByRole("switch", { name: "Email alerts" })).toBeDefined();
  });

  test("uncontrolled: starts from defaultChecked and toggles itself", async () => {
    render(<Switch aria-label="x" defaultChecked />);
    expect(checked()).toBe("true");
    await userEvent.click(screen.getByRole("switch"));
    expect(checked()).toBe("false");
  });

  test("works from the keyboard", async () => {
    render(<Switch aria-label="x" />);
    screen.getByRole("switch").focus();
    await userEvent.keyboard(" ");
    expect(checked()).toBe("true");
    await userEvent.keyboard("{Enter}");
    expect(checked()).toBe("false");
  });

  test("controlled: reports the next state but waits for the parent", async () => {
    const onCheckedChange = mock();
    render(<Switch aria-label="x" checked={false} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checked()).toBe("false");
  });

  test("disabled: ignores clicks", async () => {
    const onCheckedChange = mock();
    render(<Switch aria-label="x" disabled onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checked()).toBe("false");
  });
});
