/** Comic emojis: standalone SVGs; the animated one carries its own CSS. */
import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { emojis } from "@/components/emojis/emojis";

describe("emojis", () => {
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
      expect(fills(color).size).toBeGreaterThan(2);
    });

    test(`${e.name}: the animated SVG carries its keyframes and a reduced-motion stop`, () => {
      const svg = renderToStaticMarkup(<e.Component animated />);
      expect(svg).toContain("@keyframes");
      expect(svg).toContain("prefers-reduced-motion");
    });
  }
});
