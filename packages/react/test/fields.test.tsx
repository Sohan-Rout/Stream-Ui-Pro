import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, Input } from "../src";

describe("Input", () => {
  test("is labelled by its <label>", () => {
    render(
      <>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Email" })).toBeDefined();
  });

  test("sets aria-invalid only when invalid", () => {
    const { rerender } = render(<Input aria-label="x" />);
    expect(screen.getByRole("textbox").hasAttribute("aria-invalid")).toBe(false);
    rerender(<Input aria-label="x" invalid />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  test("hides the decorative icon from assistive tech", () => {
    render(<Input aria-label="x" icon={<svg data-testid="icon" />} />);
    expect(screen.getByTestId("icon").parentElement?.getAttribute("aria-hidden")).toBe("true");
  });

  test("className goes to the input, frameClassName to the frame", () => {
    render(<Input aria-label="x" className="text-right" frameClassName="w-64" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("text-right");
    expect(input.parentElement?.className).toContain("w-64");
  });

  test("accepts typing", async () => {
    render(<Input aria-label="x" />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("hello");
  });
});

describe("Checkbox", () => {
  test("is a real checkbox named by its label", () => {
    render(<Checkbox label="Remember me" />);
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeDefined();
  });

  test("clicking the label toggles it", async () => {
    render(<Checkbox label="Remember me" />);
    const box = screen.getByRole("checkbox") as HTMLInputElement;
    await userEvent.click(screen.getByText("Remember me"));
    expect(box.checked).toBe(true);
    await userEvent.click(screen.getByText("Remember me"));
    expect(box.checked).toBe(false);
  });

  test("disabled checkboxes don't toggle", async () => {
    render(<Checkbox label="Locked" disabled />);
    await userEvent.click(screen.getByText("Locked"));
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
  });

  test("submits with forms like a native input", () => {
    render(
      <form data-testid="form">
        <Checkbox name="terms" value="yes" defaultChecked label="Terms" />
      </form>,
    );
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.get("terms")).toBe("yes");
  });
});
