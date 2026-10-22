"use client";

import { live } from "@/registry/live.generated";

/**
 * Renders an example, section design, or lab by its source file. Its code
 * loads only when it renders (see scripts/live-map.ts), so a page ships just
 * what it shows.
 */
export function Live({ file, ...props }: { file: string } & Record<string, unknown>) {
  const Component = live[file];
  if (!Component) throw new Error(`No live component for ${file}. Run bun scripts/build-live-map.ts.`);
  return <Component {...props} />;
}
