/**
 * Smoke test: everything the docs render live must mount without throwing
 * and produce markup. Catches runtime crashes the type checker can't see.
 */
import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { indexPreviews } from "@/registry/previews";

describe("component examples render", () => {
  for (const c of components) {
    for (const ex of c.examples) {
      test(`${c.name} › ${ex.title}`, () => {
        const { container } = render(<ex.Component />);
        expect(container.innerHTML.length).toBeGreaterThan(0);
      });
    }
  }
});

describe("index-card previews", () => {
  test("only exist for real components", () => {
    const slugs = new Set(components.map((c) => c.slug));
    for (const slug of Object.keys(indexPreviews)) expect(slugs.has(slug)).toBe(true);
  });

  for (const [slug, Preview] of Object.entries(indexPreviews)) {
    test(`${slug} preview renders`, () => {
      const { container } = render(<Preview />);
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });
  }
});

describe("sections render", () => {
  for (const s of sections) {
    for (const v of s.variants) {
      test(`${s.name}: ${v.name}`, () => {
        const { container } = render(<v.Component />);
        expect(container.querySelector("section, footer")).not.toBeNull();
      });
    }
  }
});

describe("hero headings", () => {
  // A hero is the page's h1 when used for real; docs previews demote it so
  // the docs page keeps a single h1.
  const heroes = sections.find((s) => s.slug === "hero")!.variants;
  for (const v of heroes) {
    test(`${v.name}: h1 by default, any level on request`, () => {
      const { container, unmount } = render(<v.Component />);
      expect(container.querySelectorAll("h1")).toHaveLength(1);
      unmount();
      const demoted = render(<v.Component headingAs="h3" />).container;
      expect(demoted.querySelector("h1")).toBeNull();
      expect(demoted.querySelector("h3")).not.toBeNull();
    });
  }
});

describe("labs render", () => {
  for (const l of labs) {
    test(l.name, () => {
      const { container } = render(<l.Component />);
      expect(container.innerHTML.length).toBeGreaterThan(0);
    });
  }
});

describe("ids stay unique when several examples share a page", () => {
  for (const c of components) {
    test(c.name, () => {
      const { container } = render(
        <>
          {c.examples.map((ex) => (
            <ex.Component key={ex.title} />
          ))}
        </>,
      );
      const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    });
  }
});
