/**
 * Every page ships its own share image. Pages set their own Open Graph
 * metadata (lib/seo.ts), which replaces any image inherited from a parent
 * folder, so a page without an opengraph-image file of its own shares with
 * no picture. That happened to the legal pages; this keeps it from recurring.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Glob } from "bun";

const APP = path.join(import.meta.dir, "..", "src", "app");
const pages = [...new Glob("**/page.tsx").scanSync(APP)].sort();

describe("share images", () => {
  test("found the app's pages", () => {
    expect(pages.length).toBeGreaterThan(10);
  });

  for (const page of pages) {
    const source = readFileSync(path.join(APP, page), "utf8");
    // A page that only redirects is never shared.
    if (/\bredirect\(/.test(source) && !/export (const metadata|async function generateMetadata)/.test(source)) continue;
    const dir = path.dirname(page);
    test(`/${dir.replace(/\([^)]+\)\/?/g, "")} has its own opengraph-image`, () => {
      expect(existsSync(path.join(APP, dir, "opengraph-image.tsx"))).toBe(true);
    });
  }
});
