import { describe, expect, test } from "bun:test";
import { configuredPlatforms, fundingPlatforms } from "@/lib/funding";
import { siteConfig } from "@/lib/site";

const none = { githubSponsors: "", razorpay: "", razorpayQr: "" };

describe("configuredPlatforms", () => {
  test("hides every platform when nothing is configured", () => {
    expect(configuredPlatforms(none)).toEqual([]);
  });

  test("shows GitHub Sponsors when its link is set", () => {
    const [github] = configuredPlatforms({ ...none, githubSponsors: "https://github.com/sponsors/me" });
    expect(github.id).toBe("githubSponsors");
    expect(github.url).toBe("https://github.com/sponsors/me");
  });

  test("Razorpay shows with just a QR code, without a payment button", () => {
    const [upi] = configuredPlatforms({ ...none, razorpayQr: "https://rzp.io/i/abc" });
    expect(upi.id).toBe("razorpay");
    expect(upi.qr).toBe("https://rzp.io/i/abc");
    expect(upi.url).toBe("");
  });

  test("Razorpay shows with just a payment link, without a QR code", () => {
    const [upi] = configuredPlatforms({ ...none, razorpay: "https://razorpay.me/@me" });
    expect(upi.url).toBe("https://razorpay.me/@me");
    expect(upi.qr).toBe("");
  });

  test("treats whitespace as empty", () => {
    expect(configuredPlatforms({ githubSponsors: "  ", razorpay: " ", razorpayQr: "\t" })).toEqual([]);
  });

  test("keeps a stable order: GitHub Sponsors, then UPI", () => {
    const all = configuredPlatforms({
      razorpayQr: "https://rzp.io/i/abc",
      githubSponsors: "https://github.com/sponsors/me",
      razorpay: "",
    });
    expect(all.map((p) => p.id)).toEqual(["githubSponsors", "razorpay"]);
  });
});

describe("configured funding links", () => {
  test("every configured link and QR code is https", () => {
    for (const p of fundingPlatforms) {
      for (const value of [p.url, p.qr].filter(Boolean)) expect(new URL(value).protocol).toBe("https:");
    }
  });

  test("siteConfig covers exactly the supported options", () => {
    expect(Object.keys(siteConfig.funding).sort()).toEqual(["githubSponsors", "razorpay", "razorpayQr"]);
  });
});
