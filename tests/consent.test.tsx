/**
 * Storage consent: the banner shows until answered, its answer persists, and
 * best scores are only saved after "Accept".
 */
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let pathname = "/";
mock.module("next/navigation", () => ({ usePathname: () => pathname }));

const { CONSENT_KEY, readConsent, setConsent } = await import("@/lib/consent");
const { CookieBanner, CookieSettingsButton } = await import("@/components/blocks/CookieBanner");
const { useBestScore } = await import("@/lib/games/best-score");

// happy-dom's <dialog> lacks showModal in some versions; record which opened.
const opened: string[] = [];
beforeEach(() => {
  localStorage.clear();
  setConsent(null);
  opened.length = 0;
  pathname = "/";
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
    opened.push("modal");
  };
  HTMLDialogElement.prototype.show = function () {
    this.setAttribute("open", "");
    opened.push("inline");
  };
});
afterEach(cleanup);

describe("CookieBanner", () => {
  test("asks until answered, then remembers the answer", async () => {
    render(<CookieBanner />);
    expect(screen.getByRole("dialog", { name: "Cookies? Just crumbs." })).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(localStorage.getItem(CONSENT_KEY)).toBe("all");
  });

  test("opens modally on the landing page, so the hero is blurred behind it", () => {
    render(<CookieBanner />);
    expect(opened).toEqual(["modal"]);
  });

  test("opens inline on other pages, leaving the docs usable", () => {
    pathname = "/components";
    render(<CookieBanner />);
    expect(opened).toEqual(["inline"]);
  });

  test("Escape means essential only", () => {
    render(<CookieBanner />);
    const dialog = screen.getByRole("dialog");
    act(() => {
      dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
    });
    expect(readConsent()).toBe("essential");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("cookie settings asks again", async () => {
    setConsent("all");
    render(
      <>
        <CookieBanner />
        <CookieSettingsButton />
      </>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});

describe("best scores follow consent", () => {
  test("not saved before the visitor answers", () => {
    const { result } = renderHook(() => useBestScore("snake"));
    act(() => result.current[1](12));
    expect(localStorage.getItem("streamui:snake-best")).toBeNull();
  });

  test("saved after Accept", () => {
    setConsent("all");
    const { result } = renderHook(() => useBestScore("snake"));
    act(() => result.current[1](12));
    expect(result.current[0]).toBe(12);
  });

  test("essential only deletes saved scores and keeps the choice", () => {
    setConsent("all");
    localStorage.setItem("streamui:flappy-best", "9");
    setConsent("essential");
    expect(localStorage.getItem("streamui:flappy-best")).toBeNull();
    expect(localStorage.getItem(CONSENT_KEY)).toBe("essential");
  });
});
