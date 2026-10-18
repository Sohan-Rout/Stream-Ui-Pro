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

/** The command that copies an item (and everything it needs) into a shadcn/ui project. */
export const shadcnAdd = (name: string) => `npx shadcn@latest add ${registryItemUrl(name)}`;

export type InstallOption = { id: string; label: string; command: string };

/** The npm package, or the shadcn CLI copying one registry item's source. */
export const installOptions = (shadcnItem: string): InstallOption[] => [
  { id: "npm", label: "npm", command: siteConfig.installCommand },
  { id: "shadcn", label: "shadcn", command: shadcnAdd(shadcnItem) },
];
