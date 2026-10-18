import { siteConfig } from "@/lib/site";
import type { SectionDoc, SectionVariant } from "./sections";

/**
 * Names and install commands for the shadcn registry served at /r/. The
 * generator (scripts/build-registry.ts) and the docs pages both use these,
 * so every command on the site points at an item that exists.
 */
export const shadcnName = {
  component: (slug: string) => slug,
  section: (section: Pick<SectionDoc, "slug" | "variants">, variant: Pick<SectionVariant, "id">) =>
    section.variants.length > 1 ? `${variant.id}-${section.slug}` : `${section.slug}-section`,
  lab: (slug: string) => `${slug}-lab`,
};

export const registryItemUrl = (name: string, base = siteConfig.url) => `${base.replace(/\/$/, "")}/r/${name}.json`;

/** The project uses bun, so commands use bunx; npx works the same. */
const SHADCN = "bunx shadcn@latest";

/** The command that copies an item (and everything it needs) into a shadcn/ui project. */
export const shadcnAdd = (name: string) => `${SHADCN} add ${registryItemUrl(name)}`;

/** Lists every item in the registry in the terminal. */
export const shadcnBrowse = () => `${SHADCN} search ${siteConfig.url.replace(/\/$/, "")}/r/registry.json`;

export type InstallOption = { id: string; label: string; command: string };

/** The npm package, or a shadcn CLI command (adding one item, or listing them all). */
export const installOptions = (shadcnCommand: string): InstallOption[] => [
  { id: "bun", label: "bun", command: siteConfig.installCommand },
  { id: "shadcn", label: "shadcn", command: shadcnCommand },
];
