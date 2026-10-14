import { describe, expect, test } from "bun:test";
import { cn, toneBg } from "../src";

describe("cn", () => {
  test("joins and drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  test("later Tailwind classes win conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("bg-lime", "bg-pink")).toBe("bg-pink");
  });

  test("knows the custom brutal shadow tokens", () => {
    expect(cn("shadow-brutal", "shadow-none")).toBe("shadow-none");
    expect(cn("shadow-brutal-sm", "shadow-brutal-lg")).toBe("shadow-brutal-lg");
  });
});

describe("toneBg", () => {
  test("maps every tone to a static background class", () => {
    for (const [tone, cls] of Object.entries(toneBg)) {
      expect(cls).toBe(`bg-${tone}`);
    }
  });
});
