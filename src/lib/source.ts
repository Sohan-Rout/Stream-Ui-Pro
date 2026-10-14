import { readFileSync } from "node:fs";
import path from "node:path";

const PACKAGE_SRC = "packages/react/src/";

/**
 * Reads a source file so docs can show the real code. Accepts paths under
 * `src/` (the site) or `packages/react/src/` (the published package).
 *
 * Synchronous on purpose: Cache Components treats `readFileSync` as
 * predictable, so pages that call it still prerender to a static shell.
 * Each branch is scoped to a fixed folder so output tracing ships only
 * those source files, which cached pages need when they revalidate.
 */
export function readSource(file: string) {
  const text = file.startsWith(PACKAGE_SRC)
    ? readFileSync(path.join(process.cwd(), "packages", "react", "src", file.slice(PACKAGE_SRC.length)), "utf8")
    : readFileSync(path.join(process.cwd(), "src", file.replace(/^src\//, "")), "utf8");
  return text.trimEnd();
}
