import { describe, expect, mock, test } from "bun:test";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, Dialog, Tooltip } from "../src";

const dialogEl = () => document.querySelector("dialog") as HTMLDialogElement;

describe("Dialog", () => {
  test("is closed until its trigger is clicked", async () => {
    render(<Dialog title="Delete project?" trigger={<Button>Delete</Button>} />);
    expect(dialogEl().open).toBe(false);
    const trigger = screen.getByRole("button", { name: "Delete" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    await userEvent.click(trigger);
    expect(dialogEl().open).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  test("is named by its title and described by its description", () => {
    render(<Dialog title="Delete project?" description="This can't be undone." defaultOpen />);
    const d = dialogEl();
    expect(document.getElementById(d.getAttribute("aria-labelledby")!)?.textContent).toBe("Delete project?");
    expect(document.getElementById(d.getAttribute("aria-describedby")!)?.textContent).toBe("This can't be undone.");
  });

  test("the close button closes it and reports the change", async () => {
    const onOpenChange = mock();
    render(<Dialog title="Hi" defaultOpen onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(dialogEl().open).toBe(false);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  test("a native close (Esc) syncs state back", async () => {
    const onOpenChange = mock();
    render(<Dialog title="Hi" defaultOpen onOpenChange={onOpenChange} />);
    act(() => dialogEl().close());
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  test("a backdrop click closes it unless dismissible is off", () => {
    const { rerender } = render(<Dialog title="Hi" defaultOpen dismissible={false} />);
    fireEvent.click(dialogEl());
    expect(dialogEl().open).toBe(true);

    rerender(<Dialog title="Hi" defaultOpen />);
    fireEvent.click(dialogEl());
    expect(dialogEl().open).toBe(false);
  });

  test("clicks inside the panel don't close it", () => {
    render(<Dialog title="Hi" defaultOpen>Body text</Dialog>);
    fireEvent.click(screen.getByText("Body text"));
    expect(dialogEl().open).toBe(true);
  });

  test("controlled: follows the open prop", () => {
    const { rerender } = render(<Dialog title="Hi" open={false} />);
    expect(dialogEl().open).toBe(false);
    rerender(<Dialog title="Hi" open />);
    expect(dialogEl().open).toBe(true);
  });

  test("keeps the trigger's own onClick", async () => {
    const onClick = mock();
    render(<Dialog title="Hi" trigger={<Button onClick={onClick}>Open</Button>} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Tooltip", () => {
  function Example() {
    return (
      <Tooltip content="Copy link" delay={0}>
        <button type="button" aria-label="Share">
          ↗
        </button>
      </Tooltip>
    );
  }
  const tip = () => screen.getByRole("tooltip", { hidden: true });

  test("is hidden until needed and describes its trigger", () => {
    render(<Example />);
    expect(tip().hidden).toBe(true);
    expect(screen.getByRole("button", { name: "Share" }).getAttribute("aria-describedby")).toBe(tip().id);
  });

  test("shows on keyboard focus and hides on blur", async () => {
    render(<Example />);
    await userEvent.tab();
    await waitFor(() => expect(tip().hidden).toBe(false));
    await userEvent.tab();
    expect(tip().hidden).toBe(true);
  });

  test("Esc dismisses it without moving focus", async () => {
    render(<Example />);
    await userEvent.tab();
    await waitFor(() => expect(tip().hidden).toBe(false));
    await userEvent.keyboard("{Escape}");
    expect(tip().hidden).toBe(true);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Share" }));
  });

  test("shows on hover and hides when the pointer leaves", async () => {
    render(<Example />);
    await userEvent.hover(screen.getByRole("button", { name: "Share" }));
    await waitFor(() => expect(tip().hidden).toBe(false));
    await userEvent.unhover(screen.getByRole("button", { name: "Share" }));
    expect(tip().hidden).toBe(true);
  });
});
