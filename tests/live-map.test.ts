/**
 * The registries stay data-only, and the generated live map stays in sync
 * with them: every page renders examples, sections, and labs through it.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { OUT, ROOT, liveFiles, renderLiveMap } from "../scripts/live-map";

describe("live map", () => {
  test("is up to date (run bun scripts/build-live-map.ts)", () => {
    expect(readFileSync(path.join(ROOT, OUT), "utf8")).toBe(renderLiveMap());
  });

  test("covers every example, section design, and lab", () => {
    expect(liveFiles().length).toBeGreaterThan(100);
  });

  test("the registries import no components, so reading them ships no client code", () => {
    for (const f of ["components", "sections", "labs", "nav"]) {
      const src = readFileSync(path.join(ROOT, `src/registry/${f}.ts`), "utf8");
      expect(src).not.toMatch(/^import (?!type\b).*from "@\/(examples|components\/(demos|sections))\//m);
    }
  });
});
