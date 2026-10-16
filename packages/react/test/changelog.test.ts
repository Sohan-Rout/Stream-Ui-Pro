/**
 * Every published version needs a changelog section: the GitHub release for
 * its tag takes its notes from there, and fails without one.
 */
import { expect, test } from "bun:test";
import path from "node:path";

const ROOT = path.join(import.meta.dir, "..");

test("CHANGELOG.md has a section for the current version", async () => {
  const { version } = await Bun.file(path.join(ROOT, "package.json")).json();
  const changelog = await Bun.file(path.join(ROOT, "CHANGELOG.md")).text();
  expect(changelog.split("\n")).toContain(`## ${version}`);
});
