/** ComicAlert: roles like Alert, sound effects by tone, icon and sfx options. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ComicAlert } from "@streamuilib/react";

afterEach(cleanup);

describe("ComicAlert", () => {
  test("warnings and errors are role=alert; info and success are role=status", () => {
    for (const [tone, role] of [["info", "status"], ["success", "status"], ["warning", "alert"], ["danger", "alert"]] as const) {
      render(<ComicAlert tone={tone} title="t">m</ComicAlert>);
      expect(screen.getByRole(role)).toBeTruthy();
      cleanup();
    }
  });

  test("each tone stamps its sound effect, hidden from screen readers", () => {
    for (const [tone, word] of [["info", "Hey!"], ["success", "Yes!"], ["warning", "Uh-oh!"], ["danger", "Yikes!"]] as const) {
      render(<ComicAlert tone={tone} title="t" />);
      expect(screen.getByText(word).getAttribute("aria-hidden")).toBe("true");
      cleanup();
    }
  });

  test("custom sfx, sfx={false}, and icon={null}", () => {
    render(<ComicAlert sfx="Whoa!" title="t" />);
    expect(screen.getByText("Whoa!")).toBeTruthy();
    cleanup();
    render(<ComicAlert sfx={false} title="t" />);
    expect(screen.queryByText("Hey!")).toBeNull();
    cleanup();
    const { container } = render(<ComicAlert icon={null} title="t" />);
    expect(container.querySelector(".sui-comic-alert-burst")).toBeNull();
  });

  test("urgent tones shake; title, message, and actions render", () => {
    const { container } = render(
      <ComicAlert tone="danger" title="Payment failed" action={<button type="button">Retry</button>}>
        Card declined.
      </ComicAlert>,
    );
    expect((container.firstElementChild as HTMLElement).dataset.urgent).toBe("true");
    expect(screen.getByText("Payment failed")).toBeTruthy();
    expect(screen.getByText("Card declined.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
  });
});
