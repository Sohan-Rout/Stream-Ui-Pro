import { describe, expect, test } from "bun:test";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import manifest from "@/app/manifest";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";

describe("site config", () => {
  test("canonical origin is https with no trailing slash", () => {
    expect(siteConfig.url).toMatch(/^https:\/\/[^/]+$/);
  });

  test("nav links are internal routes", () => {
    for (const item of siteConfig.nav) expect(item.href).toMatch(/^\/[a-z]/);
  });
});

describe("absoluteUrl", () => {
  test("resolves paths against the canonical origin", () => {
    expect(absoluteUrl("/components/button")).toBe(`${siteConfig.url}/components/button`);
    expect(absoluteUrl("/")).toBe(`${siteConfig.url}/`);
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({ title: "Button", description: "Click it.", path: "/components/button" });

  test("sets a canonical URL", () => {
    expect(meta.alternates?.canonical).toBe("/components/button");
  });

  test("share cards follow the page, not the site defaults", () => {
    expect(meta.openGraph).toMatchObject({ title: "Button · stream/ui", url: "/components/button", description: "Click it." });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image", title: "Button · stream/ui" });
  });

  test("the home page falls back to the site title", () => {
    const home = pageMetadata({ description: "x", path: "/" });
    expect(home.title).toBeUndefined();
    expect(home.openGraph?.title).toBe(siteConfig.title);
  });
});

describe("sitemap.xml", () => {
  const urls = sitemap().map((e) => e.url);

  test("every URL is absolute on the canonical origin", () => {
    for (const url of urls) expect(url.startsWith(`${siteConfig.url}/`)).toBe(true);
  });

  test("has no duplicates", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  test("includes every docs page", () => {
    const expected = [
      "/",
      "/components",
      "/sections",
      "/icons",
      "/labs",
      "/sponsor",
      ...components.map((c) => `/components/${c.slug}`),
      ...sections.map((s) => `/sections/${s.slug}`),
      ...labs.map((l) => `/labs/${l.slug}`),
    ].map(absoluteUrl);
    expect(urls.sort()).toEqual(expected.sort());
  });
});

describe("robots.txt", () => {
  test("allows crawling and points at the sitemap", () => {
    const r = robots();
    expect(r.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(r.sitemap).toBe(absoluteUrl("/sitemap.xml"));
  });
});

describe("web manifest", () => {
  test("names the site and has an icon", () => {
    const m = manifest();
    expect(m.short_name).toBe(siteConfig.name);
    expect(m.icons?.length).toBeGreaterThan(0);
  });
});
