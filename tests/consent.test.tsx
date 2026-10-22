/**
 * Storage consent: the banner shows until answered, its answer persists, and
 * best scores are only saved after "Accept".
 */
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let pathname = "/";
mock.module("next/navigation", () => ({ usePathname: () => pathname, useRouter: () => ({ prefetch() {} }) }));

const { CONSENT_KEY, readConsent, setConsent } = await import("@/lib/consent");
const { CookieBanner, CookieSettingsButton } = await import("@/components/blocks/CookieBanner");
const { useBestScore } = await import("@/lib/games/best-score");
const { Analytics } = await import("@/components/blocks/Analytics");
const { googleTagSnippet } = await import("@/components/blocks/GoogleTag");

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

describe("Google tag (Consent Mode v2)", () => {
  const ID = "G-TEST123";
  type Win = { dataLayer?: IArguments[]; gtag?: unknown };

  /** Runs the head snippet the way the browser would, returning the dataLayer. */
  function runSnippet() {
    const w = window as unknown as Win;
    delete w.dataLayer;
    // The snippet declares a global gtag(); run it in the window's scope.
    new Function(`${googleTagSnippet(ID)}; window.gtag = gtag;`)();
    return (w.dataLayer ?? []).map((args) => Array.from(args));
  }

  test("denies every consent type before GA is configured", () => {
    const calls = runSnippet();
    const consent = calls.findIndex((c) => c[0] === "consent" && c[1] === "default");
    const config = calls.findIndex((c) => c[0] === "config");
    expect(consent).toBeGreaterThanOrEqual(0);
    expect(consent).toBeLessThan(config);
    expect(calls[consent][2]).toEqual({
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    expect(calls[config]).toEqual(["config", ID]);
  });

  test("a returning visitor who accepted starts granted, but ads stay denied", () => {
    setConsent("all");
    const defaults = runSnippet().find((c) => c[1] === "default")?.[2] as Record<string, string>;
    expect(defaults.analytics_storage).toBe("granted");
    expect(defaults.ad_storage).toBe("denied");
  });

  test("Essential only stays denied", () => {
    setConsent("essential");
    const defaults = runSnippet().find((c) => c[1] === "default")?.[2] as Record<string, string>;
    expect(defaults.analytics_storage).toBe("denied");
  });
});

describe("the banner's answer reaches Consent Mode", () => {
  const updates: unknown[][] = [];
  beforeEach(() => {
    updates.length = 0;
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag = (...a) => updates.push(a);
  });
  const lastUpdate = () => updates.filter((u) => u[0] === "consent" && u[1] === "update").at(-1)?.[2];

  test("unanswered: denied", () => {
    render(<Analytics />);
    expect(lastUpdate()).toEqual({ analytics_storage: "denied" });
  });

  test("Accept grants analytics storage", () => {
    render(<Analytics />);
    act(() => setConsent("all"));
    expect(lastUpdate()).toEqual({ analytics_storage: "granted" });
  });

  test("withdrawing consent denies it again and deletes the GA cookies", () => {
    // Cookies need a real origin; the test page starts at about:blank.
    (window as unknown as { happyDOM: { setURL(url: string): void } }).happyDOM.setURL("https://streamui.org/");
    setConsent("all");
    render(<Analytics />);
    document.cookie = "_ga=GA1.1.123; path=/";
    document.cookie = "_ga_TEST123=GS1.1.456; path=/";
    document.cookie = "other=keep; path=/";
    expect(document.cookie).toContain("_ga_TEST123");
    act(() => setConsent("essential"));
    expect(lastUpdate()).toEqual({ analytics_storage: "denied" });
    expect(document.cookie).not.toContain("_ga");
    expect(document.cookie).toContain("other=keep");
  });

  test("the banner mentions Google Analytics only when it's configured", () => {
    const { unmount } = render(<CookieBanner analytics />);
    expect(screen.getByText(/Google Analytics/)).toBeTruthy();
    unmount();
    render(<CookieBanner />);
    expect(screen.queryByText(/Google Analytics/)).toBeNull();
  });
});
