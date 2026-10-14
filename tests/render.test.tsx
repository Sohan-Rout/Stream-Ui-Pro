/**
 * Smoke test: everything the docs render live must mount without throwing
 * and produce markup. Catches runtime crashes the type checker can't see.
 */
import { describe, expect, test } from "bun:test";
import { render } from "@testing-library/react";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";

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

describe("sections render", () => {
  for (const s of sections) {
    test(s.name, () => {
      const { container } = render(<s.Component />);
      expect(container.querySelector("section, footer")).not.toBeNull();
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
