/** The mobile menu's icon count is generated; it must match what the icon browser shows. */
import { expect, test } from "bun:test";
import { renderIconCount } from "../scripts/build-icon-count";
import { readFileSync } from "node:fs";
import path from "node:path";

test("the generated icon count is up to date (run bun scripts/build-icon-count.ts)", () => {
  expect(readFileSync(path.join(import.meta.dir, "..", "src/lib/icon-count.generated.ts"), "utf8")).toBe(renderIconCount());
});
