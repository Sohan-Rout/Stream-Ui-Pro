import type { NavGroup } from "@/components/docs/DocsNav";
import { components } from "./components";
import { sections } from "./sections";
import { labs } from "./labs";

export const docsNav: NavGroup[] = [
  {
    title: "Components",
    href: "/components",
    items: components.map((c) => ({ label: c.name, href: `/components/${c.slug}` })),
  },
  {
    title: "Sections",
    href: "/sections",
    items: sections.map((s) => ({ label: s.name, href: `/sections/${s.slug}` })),
  },
  { title: "Icons", href: "/icons", items: [] },
  {
    title: "Labs",
    href: "/labs",
    items: labs.map((l) => ({ label: l.name, href: `/labs/${l.slug}` })),
  },
];

/** Previous and next entries around `index` in a list, as links. */
export function neighbors<T extends { slug: string; name: string }>(list: T[], index: number, base: string) {
  const link = (item: T | undefined) => item && { label: item.name, href: `${base}/${item.slug}` };
  return { prev: link(list[index - 1]), next: link(list[index + 1]) };
}
