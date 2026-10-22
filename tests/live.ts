/** Loads what the docs render live by file, the same way the live map does (see scripts/live-map.ts). */
import path from "node:path";
import type { ComponentType } from "react";
import { ROOT, exportName, liveFiles } from "../scripts/live-map";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadLive(file: string): Promise<ComponentType<any>> {
  const mod = await import(path.join(ROOT, file));
  const Component = mod[exportName(file)];
  if (typeof Component !== "function") throw new Error(`${file}: export ${exportName(file)} is not a component`);
  return Component;
}

/** Every live file's component, loaded once, for tests that render them synchronously. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadAllLive(): Promise<Map<string, ComponentType<any>>> {
  return new Map(await Promise.all(liveFiles().map(async (f) => [f, await loadLive(f)] as const)));
}
