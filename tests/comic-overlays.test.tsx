/** ComicTabs, ComicAccordion, ComicDialog, ComicTooltip keep the classic behavior under the comic styling. */
import { afterEach, describe, expect, mock, test } from "bun:test";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComicAccordion, ComicButton, ComicDialog, ComicTabs, ComicTooltip } from "@streamuilib/react";

afterEach(cleanup);

describe("ComicTabs", () => {
  const items = [
    { id: "a", label: "Origin", content: "Panel A" },
    { id: "b", label: "Powers", content: "Panel B" },
    { id: "c", label: "Nemesis", content: "Panel C" },
  ];

  test("arrow keys, Home, and End move and select", async () => {
    render(<ComicTabs label="Episode" items={items} />);
    expect(screen.getByRole("tablist", { name: "Episode" })).toBeTruthy();
    const [a, b, c] = screen.getAllByRole("tab");
    expect(a.getAttribute("aria-selected")).toBe("true");
    act(() => a.focus());
    await userEvent.keyboard("{ArrowRight}");
    expect(b.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Panel B");
    await userEvent.keyboard("{End}");
    expect(c.getAttribute("aria-selected")).toBe("true");
    await userEvent.keyboard("{ArrowRight}");
    expect(a.getAttribute("aria-selected")).toBe("true");
  });

  test("only the active tab is tabbable and it stands up straight", () => {
    render(<ComicTabs label="Episode" items={items} defaultIndex={1} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((t) => t.tabIndex)).toEqual([-1, 0, -1]);
    expect(tabs[1].style.rotate).toBe("0deg");
    expect(tabs[0].style.rotate).not.toBe("0deg");
  });
});

describe("ComicAccordion", () => {
  const items = [
    { id: "x", title: "Is it free?", content: "Yes!" },
    { id: "y", title: "Dark mode?", content: "Not yet." },
  ];

  test("native details: defaultOpen opens items, and exclusive shares a name", () => {
    const { container, rerender } = render(<ComicAccordion items={items} defaultOpen={["y"]} />);
    const details = container.querySelectorAll("details");
    expect([...details].map((d) => d.open)).toEqual([false, true]);
    expect(details[0].getAttribute("name")).toBeNull();
    rerender(<ComicAccordion items={items} exclusive />);
    const named = container.querySelectorAll("details");
    expect(named[0].getAttribute("name")).toBe(named[1].getAttribute("name"));
    expect(named[0].getAttribute("name")).toBeTruthy();
  });

  test("the starburst toggle is hidden from screen readers", () => {
    const { container } = render(<ComicAccordion items={items} />);
    expect(container.querySelector(".sui-comic-acc-burst")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("ComicDialog", () => {
  const dialogEl = () => document.querySelector("dialog") as HTMLDialogElement;

  test("opens from its trigger, is named by its title, and closes with Close", async () => {
    const onOpenChange = mock();
    render(
      <ComicDialog title="Delete it?" description="No undo." sfx="Gulp!" onOpenChange={onOpenChange} trigger={<ComicButton pop={false}>Delete</ComicButton>} />,
    );
    const trigger = screen.getByRole("button", { name: "Delete" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    await userEvent.click(trigger);
    expect(dialogEl().open).toBe(true);
    expect(document.getElementById(dialogEl().getAttribute("aria-labelledby")!)?.textContent).toBe("Delete it?");
    expect(document.getElementById(dialogEl().getAttribute("aria-describedby")!)?.textContent).toBe("No undo.");
    expect(screen.getByText("Gulp!").closest("[aria-hidden]")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(dialogEl().open).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});

describe("ComicTooltip", () => {
  test("shows on focus as a described-by hint and hides on Escape", async () => {
    render(
      <ComicTooltip content="Share the love!" tone="lime">
        <button type="button">Share</button>
      </ComicTooltip>,
    );
    const button = screen.getByRole("button", { name: "Share" });
    const tip = screen.getByRole("tooltip", { hidden: true });
    expect(button.getAttribute("aria-describedby")).toBe(tip.id);
    expect(tip.hidden).toBe(true);
    await userEvent.tab();
    expect(tip.hidden).toBe(false);
    expect(tip.className).toContain("sui-comic-tip-top");
    await userEvent.keyboard("{Escape}");
    expect(tip.hidden).toBe(true);
  });
});
