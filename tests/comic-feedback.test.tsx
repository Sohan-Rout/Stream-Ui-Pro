/** ComicProgress, ComicBattery, ComicSkeleton, and ComicAvatar keep the classic semantics. */
import { afterEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import { ComicAvatar, ComicAvatarGroup, ComicBattery, ComicProgress, ComicSkeleton } from "@streamuilib/react";

afterEach(cleanup);

describe("ComicProgress", () => {
  test("is a clamped progressbar with a hidden percentage burst", () => {
    render(<ComicProgress value={140} max={200} aria-label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar.getAttribute("aria-valuenow")).toBe("140");
    expect(bar.getAttribute("aria-valuemax")).toBe("200");
    expect(screen.getByText("70%").closest("[aria-hidden]")).toBeTruthy();
    expect(screen.queryByText("Done!")).toBeNull();
  });

  test("complete shows the done sticker, unless turned off", () => {
    const { rerender } = render(<ComicProgress value={100} aria-label="x" />);
    expect(screen.getByRole("progressbar").dataset.done).toBe("true");
    expect(screen.getByText("Done!").getAttribute("aria-hidden")).toBe("true");
    rerender(<ComicProgress value={100} aria-label="x" doneLabel={false} showValue={false} />);
    expect(screen.queryByText("Done!")).toBeNull();
    expect(screen.queryByText("100%")).toBeNull();
  });
});

describe("ComicBattery", () => {
  test("is a named meter whose value text reads the state", () => {
    render(<ComicBattery value={12} />);
    const meter = screen.getByRole("meter", { name: "Battery" });
    expect(meter.getAttribute("aria-valuetext")).toBe("12%, low");
    expect(meter.dataset.low).toBe("true");
    expect(screen.getByText("Low!")).toBeTruthy();
  });

  test("charging shows ZAP! instead of LOW!, and sfx={false} drops both", () => {
    const { rerender } = render(<ComicBattery value={12} charging />);
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("12%, charging, low");
    expect(screen.getByText("Zap!")).toBeTruthy();
    expect(screen.queryByText("Low!")).toBeNull();
    rerender(<ComicBattery value={12} charging sfx={false} />);
    expect(screen.queryByText("Zap!")).toBeNull();
  });

  test("full and healthy: no sticker", () => {
    render(<ComicBattery value={88} />);
    expect(screen.getByRole("meter").getAttribute("aria-valuetext")).toBe("88%");
    expect(screen.getByText("88%")).toBeTruthy();
    expect(screen.queryByText("Low!")).toBeNull();
  });
});

describe("ComicSkeleton", () => {
  test("is hidden from screen readers and takes size classes", () => {
    const { container } = render(<ComicSkeleton className="h-4 w-40" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.getAttribute("aria-hidden")).toBe("true");
    expect(el.className).toContain("w-40");
  });
});

describe("ComicAvatar", () => {
  test("with a name it is an image named by the full name", () => {
    render(
      <ComicAvatarGroup aria-label="Team">
        <ComicAvatar initials="AL" name="Ada Lovelace" shape="burst" />
        <ComicAvatar initials="+6" />
      </ComicAvatarGroup>,
    );
    expect(screen.getByRole("group", { name: "Team" })).toBeTruthy();
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeTruthy();
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByText("+6")).toBeTruthy();
  });
});
