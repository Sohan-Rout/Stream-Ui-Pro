import { describe, expect, test } from "bun:test";
import { parseEnv } from "@/lib/env";

describe("parseEnv", () => {
  test("works with nothing set: default site URL, no funding links", () => {
    expect(parseEnv({})).toEqual({
      siteUrl: "https://streamui.org",
      funding: { openCollective: "", kofi: "" },
    });
  });

  test("normalizes the site URL to an origin", () => {
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: "https://preview.streamui.org/some/path/" }).siteUrl).toBe(
      "https://preview.streamui.org",
    );
  });

  test("allows plain http only on localhost", () => {
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }).siteUrl).toBe("http://localhost:3000");
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "http://streamui.org" })).toThrow(/must use https/);
  });

  test("reads funding links and treats blank values as unset", () => {
    const env = parseEnv({
      FUNDING_KOFI_URL: "https://ko-fi.com/me",
      FUNDING_OPEN_COLLECTIVE_URL: "   ",
    });
    expect(env.funding).toEqual({ openCollective: "", kofi: "https://ko-fi.com/me" });
  });

  test("fails loudly on a malformed or insecure funding link", () => {
    expect(() => parseEnv({ FUNDING_OPEN_COLLECTIVE_URL: "opencollective.com/x" })).toThrow(
      /FUNDING_OPEN_COLLECTIVE_URL must be a full URL/,
    );
    expect(() => parseEnv({ FUNDING_KOFI_URL: "http://ko-fi.com/me" })).toThrow(/must use https/);
    expect(() => parseEnv({ FUNDING_KOFI_URL: "javascript:alert(1)" })).toThrow(/must use https/);
  });
});
