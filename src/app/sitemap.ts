import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/components", 0.9, "weekly"),
    entry("/sections", 0.8, "weekly"),
    entry("/icons", 0.8, "monthly"),
    entry("/labs", 0.6, "weekly"),
    entry("/sponsor", 0.4, "monthly"),
    entry("/legal/privacy", 0.2, "monthly"),
    entry("/legal/terms", 0.2, "monthly"),
    entry("/legal/cookies", 0.2, "monthly"),
    ...components.map((c) => entry(`/components/${c.slug}`, 0.8, "monthly")),
    ...sections.map((s) => entry(`/sections/${s.slug}`, 0.7, "monthly")),
    ...labs.map((l) => entry(`/labs/${l.slug}`, 0.5, "monthly")),
  ];
}
