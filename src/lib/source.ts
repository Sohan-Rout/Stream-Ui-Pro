import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Reads a file under `src/` so docs can show the real code.
 *
 * Synchronous on purpose: Cache Components treats `readFileSync` as
 * predictable, so pages that call it still prerender to a static shell.
 * The path is scoped to `src/` so output tracing ships only source files,
 * which cached pages need when they revalidate at runtime.
 */
export function readSource(file: string) {
  const relative = file.replace(/^src\//, "");
  return readFileSync(path.join(process.cwd(), "src", relative), "utf8").trimEnd();
}
