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

    test(`${e.name}: the animated SVG carries its keyframes and a reduced-motion stop`, () => {
      const svg = renderToStaticMarkup(<e.Component animated />);
      expect(svg).toContain("@keyframes");
      expect(svg).toContain("prefers-reduced-motion");
    });
  }
});
