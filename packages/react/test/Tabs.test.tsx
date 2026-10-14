import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "../src";

const items = [
  { id: "one", label: "One", content: "First panel" },
  { id: "two", label: "Two", content: "Second panel" },
  { id: "three", label: "Three", content: "Third panel" },
];

function selected() {
  return screen.getAllByRole("tab").find((t) => t.getAttribute("aria-selected") === "true")?.textContent;
}

function visiblePanel() {
  return screen.getAllByRole("tabpanel", { hidden: true }).find((p) => !p.hidden)?.textContent;
}

describe("Tabs", () => {
  test("wires tablist, tabs, and panels together", () => {
    render(<Tabs items={items} label="Project" />);
    expect(screen.getByRole("tablist", { name: "Project" })).toBeDefined();
    for (const tab of screen.getAllByRole("tab")) {
      const panel = document.getElementById(tab.getAttribute("aria-controls")!);
      expect(panel?.getAttribute("role")).toBe("tabpanel");
      expect(panel?.getAttribute("aria-labelledby")).toBe(tab.id);
    }
  });

  test("shows only the selected panel, starting at defaultIndex", () => {
    render(<Tabs items={items} label="x" defaultIndex={1} />);
    expect(selected()).toBe("Two");
    expect(visiblePanel()).toBe("Second panel");
  });

  test("only the selected tab is in the tab order", () => {
    render(<Tabs items={items} label="x" />);
    const tabIndexes = screen.getAllByRole("tab").map((t) => t.getAttribute("tabindex"));
    expect(tabIndexes).toEqual(["0", "-1", "-1"]);
  });

  test("clicking a tab selects it", async () => {
    render(<Tabs items={items} label="x" />);
    await userEvent.click(screen.getByRole("tab", { name: "Three" }));
    expect(selected()).toBe("Three");
    expect(visiblePanel()).toBe("Third panel");
  });

  test("arrow keys move selection and focus, wrapping at the ends", async () => {
    render(<Tabs items={items} label="x" />);
    screen.getByRole("tab", { name: "One" }).focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(selected()).toBe("Two");
    expect(document.activeElement?.textContent).toBe("Two");

    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(selected()).toBe("Three");
    expect(document.activeElement?.textContent).toBe("Three");

    await userEvent.keyboard("{ArrowRight}");
    expect(selected()).toBe("One");
  });

  test("Home and End jump to the first and last tab", async () => {
    render(<Tabs items={items} label="x" defaultIndex={1} />);
    screen.getByRole("tab", { name: "Two" }).focus();
    await userEvent.keyboard("{End}");
    expect(selected()).toBe("Three");
    await userEvent.keyboard("{Home}");
    expect(selected()).toBe("One");
  });
});
