import { describe, expect, test } from "bun:test";
import { cn } from "@/lib/cn";

describe("site cn()", () => {
  test("keeps a pattern and its backing color together", () => {
    for (const pattern of ["bg-dots", "bg-hatch", "bg-pixel-grid"]) {
      const merged = cn("bg-paper", pattern).split(" ");
      expect(merged).toContain("bg-paper");
      expect(merged).toContain(pattern);
    }
  });

  test("a later color still replaces an earlier one", () => {
    expect(cn("bg-dots bg-paper", "bg-lime-soft")).toBe("bg-dots bg-lime-soft");
  });

  test("a later pattern replaces an earlier one", () => {
    expect(cn("bg-dots", "bg-pixel-grid")).toBe("bg-pixel-grid");
  });

  test("still knows the brutal shadow tokens", () => {
    expect(cn("shadow-brutal", "shadow-none")).toBe("shadow-none");
  });
});
