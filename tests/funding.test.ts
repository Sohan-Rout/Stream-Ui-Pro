import { describe, expect, test } from "bun:test";
import { configuredPlatforms, fundingPlatforms } from "@/lib/funding";
import { siteConfig } from "@/lib/site";

const none = { razorpay: "", openCollective: "", kofi: "" };

describe("configuredPlatforms", () => {
  test("hides every platform when nothing is configured", () => {
    expect(configuredPlatforms(none)).toEqual([]);
  });

  test("shows only platforms that have a link", () => {
    const result = configuredPlatforms({ ...none, kofi: "https://ko-fi.com/me" });
    expect(result.map((p) => p.id)).toEqual(["kofi"]);
    expect(result[0].url).toBe("https://ko-fi.com/me");
  });

  test("treats whitespace as empty", () => {
    expect(configuredPlatforms({ ...none, razorpay: "   " })).toEqual([]);
  });

  test("keeps a stable order: Razorpay, Open Collective, Ko-fi", () => {
    const all = configuredPlatforms({
      kofi: "https://ko-fi.com/me",
      razorpay: "https://razorpay.me/@me",
      openCollective: "https://opencollective.com/me",
    });
    expect(all.map((p) => p.id)).toEqual(["razorpay", "openCollective", "kofi"]);
  });
});

describe("configured funding links", () => {
  test("every link in siteConfig is a valid https URL", () => {
    for (const p of fundingPlatforms) {
      expect(new URL(p.url).protocol).toBe("https:");
    }
  });

  test("siteConfig covers every platform the sponsor page knows", () => {
    expect(Object.keys(siteConfig.funding).sort()).toEqual(["kofi", "openCollective", "razorpay"]);
  });
});
