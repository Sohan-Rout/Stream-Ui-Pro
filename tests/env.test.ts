import { describe, expect, test } from "bun:test";
import { parseEnv } from "@/lib/env";

describe("parseEnv", () => {
  test("works with nothing set: default site URL, no funding links", () => {
    expect(parseEnv({})).toEqual({
      siteUrl: "https://streamui.org",
      funding: { githubSponsors: "", razorpay: "", razorpayQr: "" },
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
      FUNDING_RAZORPAY_QR_URL: "https://rzp.io/i/abc123",
      FUNDING_RAZORPAY_URL: "   ",
    });
    expect(env.funding).toEqual({ githubSponsors: "", razorpay: "", razorpayQr: "https://rzp.io/i/abc123" });
  });

  test("adds https:// to a link pasted without it", () => {
    expect(parseEnv({ FUNDING_GITHUB_SPONSORS_URL: "github.com/sponsors/streamuilib" }).funding.githubSponsors).toBe(
      "https://github.com/sponsors/streamuilib",
    );
    expect(parseEnv({ NEXT_PUBLIC_SITE_URL: "streamui.org" }).siteUrl).toBe("https://streamui.org");
  });

  test("rejects a bare username, naming the variable and showing an example", () => {
    expect(() => parseEnv({ FUNDING_GITHUB_SPONSORS_URL: "streamuilib" })).toThrow(
      /FUNDING_GITHUB_SPONSORS_URL must be a full URL with a domain.*https:\/\/github\.com\/sponsors\/your-org/,
    );
  });

  test("error messages say where to fix it", () => {
    expect(() => parseEnv({ FUNDING_RAZORPAY_URL: "nope" })).toThrow(/Project Settings → Environment Variables/);
  });

  test("fails loudly on a malformed or insecure funding link", () => {
    expect(() => parseEnv({ FUNDING_RAZORPAY_QR_URL: "https://" })).toThrow(/FUNDING_RAZORPAY_QR_URL is not a valid URL/);
    expect(() => parseEnv({ FUNDING_RAZORPAY_QR_URL: "http://rzp.io/i/abc" })).toThrow(/must use https/);
    expect(() => parseEnv({ FUNDING_RAZORPAY_URL: "javascript:alert(1)" })).toThrow(/must use https/);
  });
});
