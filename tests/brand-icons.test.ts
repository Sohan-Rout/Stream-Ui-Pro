/** Brand icon generation: slugs, standalone SVGs, and the full set. */
import { describe, expect, test } from "bun:test";
import * as si from "react-icons/si";
import { collect, toSlug, toSvg } from "../scripts/brand-icons";

describe("brand icons", () => {
  test("slugs are the lowercase name without the Si prefix", () => {
    expect(toSlug("SiGithub")).toBe("github");
    expect(toSlug("SiNextdotjs")).toBe("nextdotjs");
  });

  test("each SVG is standalone, 24px, one namespace, and takes the text color", () => {
    const svg = toSvg(si.SiGithub);
    expect(svg.startsWith("<svg ")).toBe(true);
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('width="24"');
    expect(svg).toContain('fill="currentColor"');
    expect(svg.match(/xmlns=/g)).toHaveLength(1);
    expect(svg).toContain("<path");
    expect(svg).not.toContain("style=");
  });

  test("collects every Si icon, sorted, with unique slugs", () => {
    const icons = collect(si as Record<string, unknown>);
    expect(icons.length).toBeGreaterThan(3000);
    const slugs = icons.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect([...slugs].sort((a, b) => a.localeCompare(b))).toEqual(slugs);
    expect(icons.find((i) => i.slug === "github")?.name).toBe("SiGithub");
  });
});
