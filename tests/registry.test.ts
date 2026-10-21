/**
 * The docs are generated from the registries, so a bad entry means a broken
 * page, a dead sidebar link, or a "Source" panel that crashes the build.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import * as pkg from "@streamuilib/react";
import { readSource } from "@/lib/source";
import { componentEntries, componentGroupOf, componentGroups, componentHref, componentOrder, components } from "@/registry/components";
import { getSectionVariant, sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { docsNav, neighbors } from "@/registry/nav";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const registries = { components, sections, labs };

describe.each(Object.entries(registries))("%s registry", (_, entries) => {
  test("has entries", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  test("slugs are unique and URL-safe", () => {
    const slugs = entries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(SLUG);
  });

  test("names and descriptions are filled in", () => {
    for (const e of entries) {
      expect(e.name.trim()).not.toBe("");
      expect(e.description.trim().length).toBeGreaterThan(20);
    }
  });

  test("every source file exists and can be shown on its page", () => {
    for (const e of entries) {
      for (const file of "variants" in e ? e.variants.map((v) => v.file) : [e.file]) {
        expect(existsSync(file)).toBe(true);
        expect(readSource(file).length).toBeGreaterThan(0);
      }
    }
  });
});

describe("components registry", () => {
  test("every component has a place in the sidebar order", () => {
    expect([...componentOrder].sort()).toEqual(components.map((c) => c.slug).sort());
  });

  test("each component has examples, props, and accessibility notes", () => {
    for (const c of components) {
      expect(c.examples.length).toBeGreaterThan(0);
      expect(c.props.flatMap((t) => t.rows).length).toBeGreaterThan(0);
      expect(c.accessibility.length).toBeGreaterThan(0);
    }
  });

  test("every example file exists and is the component it previews", () => {
    for (const c of components) {
      for (const ex of c.examples) {
        expect(ex.file).toStartWith(`src/examples/${c.slug}/`);
        expect(readSource(ex.file)).toContain("export default function");
        expect(typeof ex.Component).toBe("function");
      }
    }
  });

  test("example titles are unique per page", () => {
    for (const c of components) {
      const titles = c.examples.map((e) => e.title);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  test("documented components live in the package and are exported", () => {
    const index = readFileSync("packages/react/src/index.ts", "utf8");
    for (const c of components) {
      expect(c.file).toStartWith("packages/react/src/");
      const moduleName = c.file.split("/").pop()!.replace(/\.tsx?$/, "");
      expect(index).toContain(`from "./${moduleName}"`);
    }
  });

  test("the package exports what the usage snippets import", () => {
    for (const c of components) {
      const imported = c.usage.match(/import \{([^}]+)\} from "@streamuilib\/react"/)?.[1];
      for (const name of imported?.split(",").map((n) => n.trim()) ?? []) {
        expect({ component: c.slug, name, exported: name in pkg }).toEqual({ component: c.slug, name, exported: true });
      }
    }
  });
});

describe("sections registry", () => {
  test('"Built with" lists real components or lucide-react', () => {
    const names = new Set(components.map((c) => c.name));
    for (const v of sections.flatMap((s) => s.variants)) {
      for (const u of v.uses) expect(names.has(u) || u === "lucide-react").toBe(true);
    }
  });

  test("variant ids are unique within a section and safe as URL fragments", () => {
    for (const s of sections) {
      const ids = s.variants.map((v) => v.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(SLUG);
    }
  });

  test("variant pages exist only for sections with more than one design", () => {
    for (const s of sections) {
      for (const v of s.variants) {
        expect(Boolean(getSectionVariant(s.slug, v.id))).toBe(s.variants.length > 1);
      }
    }
    expect(getSectionVariant("hero", "nope")).toBeUndefined();
    expect(getSectionVariant("nope", "split")).toBeUndefined();
  });

  test("every variant has a description and notes", () => {
    for (const v of sections.flatMap((s) => s.variants)) {
      expect(v.description.trim().length).toBeGreaterThan(20);
      expect(v.notes.length).toBeGreaterThan(0);
    }
  });
});

describe("docs navigation", () => {
  test("links to every registry page exactly once", () => {
    const hrefs = docsNav.flatMap((g) => [g.href, ...g.items.map((i) => i.href)]);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    // Every component is reachable: directly, or through its group's page.
    for (const c of components) {
      const hit = componentGroupOf(c);
      expect(hrefs).toContain(`/components/${hit ? hit.group.slug : c.slug}`);
    }
    for (const s of sections) expect(hrefs).toContain(`/sections/${s.slug}`);
    for (const l of labs) expect(hrefs).toContain(`/labs/${l.slug}`);
  });

  test("prev/next links stop at the ends", () => {
    const first = neighbors(components, 0, "/components");
    const last = neighbors(components, components.length - 1, "/components");
    expect(first.prev).toBeUndefined();
    expect(first.next?.href).toBe(`/components/${components[1].slug}`);
    expect(last.next).toBeUndefined();
    expect(last.prev?.href).toBe(`/components/${components.at(-2)!.slug}`);
  });
});

describe("component groups", () => {
  test("Badges groups the classic and comic designs", () => {
    const badges = componentGroups.find((g) => g.slug === "badge")!;
    expect(badges.variants.map((v) => [v.id, v.doc.slug])).toEqual([["classic", "badge"], ["comic", "comic-badge"]]);
  });

  test("grouped components live inside their group; the rest at their own slug", () => {
    const byslug = (slug: string) => components.find((c) => c.slug === slug)!;
    expect(componentHref(byslug("comic-badge"))).toBe("/components/badge/comic");
    expect(componentHref(byslug("badge"))).toBe("/components/badge/classic");
    expect(componentHref(byslug("comic-button"))).toBe("/components/button/comic");
    expect(componentHref(byslug("comic-card"))).toBe("/components/card/comic");
    expect(componentHref(byslug("alert"))).toBe("/components/alert");
  });

  test("each group appears once in the top-level list, where its first member sits", () => {
    const slugs = componentEntries.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs).not.toContain("comic-badge");
    expect(slugs).not.toContain("comic-button");
    expect(componentEntries.find((e) => e.slug === "badge")?.kind).toBe("group");
    expect(componentEntries.find((e) => e.slug === "button")?.kind).toBe("group");
    expect(slugs.slice(0, 3)).toEqual(["button", "badge", "card"]);
    expect(slugs).not.toContain("comic-card");
  });
});
