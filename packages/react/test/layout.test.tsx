import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Accordion, Alert, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton } from "../src";

describe("Card", () => {
  test("composes header, title, description, content, and footer", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Billed monthly</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Plan" })).toBeDefined();
    expect(screen.getByText("Billed monthly").tagName).toBe("P");
    expect(screen.getByTestId("card").className).toContain("bg-paper-raised");
  });

  test("CardTitle can render at any heading level", () => {
    render(<CardTitle as="h2">Section</CardTitle>);
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toBeDefined();
  });

  test("tones use soft surfaces", () => {
    render(<Card data-testid="card" tone="orange" />);
    expect(screen.getByTestId("card").className).toContain("bg-orange-soft");
  });
});

describe("Alert", () => {
  test("warnings and errors interrupt (role=alert)", () => {
    render(
      <>
        <Alert tone="danger" title="Payment failed" />
        <Alert tone="warning" title="Quota at 90%" />
      </>,
    );
    expect(screen.getAllByRole("alert")).toHaveLength(2);
  });

  test("info and success are polite (role=status)", () => {
    render(
      <>
        <Alert tone="info" title="Heads up" />
        <Alert tone="success" title="Saved" />
      </>,
    );
    expect(screen.getAllByRole("status")).toHaveLength(2);
  });

  test("an explicit role wins, e.g. for alerts present at page load", () => {
    render(<Alert tone="danger" role="note" title="Static notice" />);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("note")).toBeDefined();
  });

  test("renders title, message, and action; the icon is decorative", () => {
    render(
      <Alert title="Deploy failed" action={<button type="button">Retry</button>}>
        Build step exited with code 1.
      </Alert>,
    );
    expect(screen.getByText("Deploy failed")).toBeDefined();
    expect(screen.getByText("Build step exited with code 1.")).toBeDefined();
    expect(screen.getByRole("button", { name: "Retry" })).toBeDefined();
    expect(screen.getByRole("status").querySelector("svg")?.closest("[aria-hidden]")).not.toBeNull();
  });

  test("icon={null} removes the icon", () => {
    render(<Alert title="Plain" icon={null} />);
    expect(screen.getByRole("status").querySelector("svg")).toBeNull();
  });
});

describe("Accordion", () => {
  const items = [
    { id: "a", title: "Shipping", content: "Ships in 2 days." },
    { id: "b", title: "Returns", content: "30-day returns." },
  ];

  test("each item is a native details/summary pair", () => {
    const { container } = render(<Accordion items={items} />);
    expect(container.querySelectorAll("details")).toHaveLength(2);
    expect(container.querySelectorAll("summary")).toHaveLength(2);
    expect(screen.getByText("Shipping").tagName).toBe("SUMMARY");
  });

  test("defaultOpen opens the listed items", () => {
    const { container } = render(<Accordion items={items} defaultOpen={["b"]} />);
    const [a, b] = container.querySelectorAll("details");
    expect(a.open).toBe(false);
    expect(b.open).toBe(true);
  });

  test("exclusive puts every item in one named group", () => {
    const { container } = render(<Accordion items={items} exclusive />);
    const names = [...container.querySelectorAll("details")].map((d) => d.getAttribute("name"));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  test("non-exclusive items are independent", () => {
    const { container } = render(<Accordion items={items} />);
    for (const d of container.querySelectorAll("details")) expect(d.hasAttribute("name")).toBe(false);
  });
});

describe("Skeleton", () => {
  test("is hidden from assistive tech and accepts sizing classes", () => {
    render(<Skeleton data-testid="s" className="h-4 w-40" />);
    const el = screen.getByTestId("s");
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.className).toContain("w-40");
    expect(el.className).toContain("motion-safe:animate-pulse");
  });
});
