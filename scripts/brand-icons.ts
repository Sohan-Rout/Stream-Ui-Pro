/**
 * Brand icons (Simple Icons, via react-icons/si) as static files, so the
 * icons page can load just the logos on screen instead of a 5 MB module.
 *
 *   public/brand-icons/index.json      [{ name: "SiGithub", slug: "github" }, ...]
 *   public/brand-icons/<slug>.svg      one monochrome logo, fill="currentColor"
 *
 * Generated (gitignored); `bun scripts/build-brand-icons.ts` writes them.
 */
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export type BrandIcon = { name: string; slug: string };
type IconComponent = ComponentType<{ size?: number }>;

/** "SiGithub" → "github", "SiNextdotjs" → "nextdotjs": the file name and search key. */
export const toSlug = (name: string) => name.replace(/^Si/, "").toLowerCase();

/** One icon component → a standalone SVG string that takes the current text color. */
export function toSvg(Icon: IconComponent) {
  return renderToStaticMarkup(createElement(Icon, { size: 24 }))
    .replace(/\s(?:style|height|width|stroke|stroke-width|class)="[^"]*"/g, "")
    .replace("<svg", '<svg width="24" height="24"');
}

/** Every Si* export, sorted by slug. */
export function collect(mod: Record<string, unknown>) {
  return Object.entries(mod)
    .filter(([name, v]) => /^Si[A-Z0-9]/.test(name) && typeof v === "function")
    .map(([name, Icon]) => ({ name, slug: toSlug(name), Icon: Icon as IconComponent }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}
