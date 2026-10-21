/**
 * Search copy rules. Google truncates titles past ~60 characters and
 * descriptions past ~160, and every page should lead with its target phrase.
 */
import { describe, expect, test } from "bun:test";
import { componentGroupSeo, componentSeo, homeSeo, indexSeo, labSeo, sectionSeo, titleSuffix, variantSeo, type SeoCopy } from "@/lib/seo-copy";
import { componentGroups, components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";

const pages: [string, SeoCopy, boolean][] = [
  ["home", homeSeo, false],
  ...Object.entries(indexSeo).map(([k, v]) => [`/${k}`, v, true] as [string, SeoCopy, boolean]),
  ...components.map((c) => [`/components/${c.slug}`, componentSeo(c), true] as [string, SeoCopy, boolean]),
  ...componentGroups.map((g) => [`/components/${g.slug} (group)`, componentGroupSeo(g), true] as [string, SeoCopy, boolean]),
  ...sections.map((s) => [`/sections/${s.slug}`, sectionSeo(s), true] as [string, SeoCopy, boolean]),
  ...sections
    .filter((s) => s.variants.length > 1)
    .flatMap((s) => s.variants.map((v) => [`/sections/${s.slug}/${v.id}`, variantSeo(s, v), true] as [string, SeoCopy, boolean])),
  ...labs.map((l) => [`/labs/${l.slug}`, labSeo(l), true] as [string, SeoCopy, boolean]),
];

describe.each(pages)("%s", (_, copy, suffixed) => {
  test("title fits in search results (≤ 60 characters)", () => {
    const full = suffixed ? copy.title + titleSuffix : copy.title;
    expect(full.length).toBeLessThanOrEqual(60);
  });

  test("description fits in search results (70–160 characters)", () => {
    expect(copy.description.length).toBeGreaterThanOrEqual(70);
    expect(copy.description.length).toBeLessThanOrEqual(160);
  });

  test("has keywords", () => {
    expect(copy.keywords.length).toBeGreaterThan(0);
  });
});

describe("target phrases", () => {
  const has = (copy: SeoCopy, phrase: RegExp) => phrase.test(copy.title) && phrase.test(copy.description);

  test("home, components, and sections lead with neobrutalism", () => {
    expect(has(homeSeo, /neobrutalism/i)).toBe(true);
    expect(has(indexSeo.components, /neobrutalism/i)).toBe(true);
    expect(has(indexSeo.sections, /neobrutalism/i)).toBe(true);
  });

  test("the icons page targets animated icons", () => {
    expect(has(indexSeo.icons, /animated icons/i)).toBe(true);
  });

  test("every component page names the component and React", () => {
    for (const c of components) {
      const copy = componentSeo(c);
      expect(copy.title).toContain(c.name);
      expect(copy.title).toContain("React");
    }
  });

  test("every section page says neobrutalism and names the section", () => {
    for (const s of sections) {
      const copy = sectionSeo(s);
      expect(copy.title).toMatch(/neobrutalism/i);
      expect(copy.title).toContain(s.name);
    }
  });

  test("every lab has hand-written copy, not the fallback", () => {
    for (const l of labs) expect(labSeo(l).title).not.toContain("React UI Experiment");
  });

  test("titles are unique across the site", () => {
    const titles = pages.map(([, c]) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
