/** Comic emojis: standalone SVGs; the animated one carries its own CSS. */
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { emojis } from "@/components/emojis/emojis";

describe("emojis", () => {
  test("every face emoji is here, in order, with unique slugs", () => {
    const slugs = emojis.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(emojis.length).toBeGreaterThanOrEqual(100);
    expect(slugs.indexOf("smile")).toBe(slugs.indexOf("grinning") + 1);
    expect(slugs.indexOf("cry")).toBe(slugs.indexOf("crying") + 1);
  });

  for (const e of emojis) {
    test(`${e.name}: the still SVG is standalone and has no animation`, () => {
      const svg = renderToStaticMarkup(<e.Component />);
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('role="img"');
      expect(svg).not.toContain("<style");
    });

    test(`${e.name}: colored adds color; black and white stays ink and paper`, () => {
      const mono = renderToStaticMarkup(<e.Component />);
      const color = renderToStaticMarkup(<e.Component colored />);
      const fills = (svg: string) => new Set([...svg.matchAll(/fill="(#[0-9a-f]{6})"/gi)].map((m) => m[1].toLowerCase()));
      expect([...fills(mono)].sort()).toEqual(["#0e0f14", "#ffffff"]);
      const tints = [...fills(color)].filter((c) => c !== "#0e0f14" && c !== "#ffffff");
      expect(tints.length).toBeGreaterThan(0);
    });

    test(`${e.name}: 3D is sphere-shaded with a soft shadow, not the flat ink offset`, () => {
      const svg = renderToStaticMarkup(<e.Component variant="3d" />);
      expect(svg).toContain("<radialGradient");
      expect(svg).toContain(`url(#sui3d-`);
      // The flat variants' hard shadow: a solid ink circle offset behind the face.
      expect(svg).not.toContain('<circle cx="64" cy="66" r="44" fill="#0e0f14"');
      // Plain hex colors only, so a copied SVG renders the same anywhere.
      expect(svg).not.toContain("color-mix");
    });

    test(`${e.name}: the animated SVG carries its keyframes and a reduced-motion stop`, () => {
      const svg = renderToStaticMarkup(<e.Component animated />);
      expect(svg).toContain("@keyframes");
      expect(svg).toContain("prefers-reduced-motion");
    });
  }
});
