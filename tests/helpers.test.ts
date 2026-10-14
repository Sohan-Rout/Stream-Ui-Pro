import { describe, expect, test } from "bun:test";
import * as lucide from "lucide-react";
import { iconNames } from "lucide-react/dynamic";
import { pickOther } from "@/components/demos/ShapeRollerLab";
import { toComponentName } from "@/components/docs/IconBrowser";

describe("pickOther (shape roller)", () => {
  test("never repeats the current value and stays in range", () => {
    for (const length of [2, 5, 6]) {
      for (let current = 0; current < length; current++) {
        for (let i = 0; i < 200; i++) {
          const next = pickOther(length, current);
          expect(next).not.toBe(current);
          expect(next).toBeGreaterThanOrEqual(0);
          expect(next).toBeLessThan(length);
        }
      }
    }
  });
});

describe("toComponentName (icon browser)", () => {
  test("converts kebab-case icon names to their React export", () => {
    expect(toComponentName("arrow-up-right")).toBe("ArrowUpRight");
    expect(toComponentName("a-arrow-down")).toBe("AArrowDown");
    expect(toComponentName("dice-5")).toBe("Dice5");
  });

  test("every icon in the browser copies a name lucide-react actually exports", () => {
    const missing = iconNames.filter((name) => !(toComponentName(name) in lucide));
    expect(missing).toEqual([]);
  });
});
