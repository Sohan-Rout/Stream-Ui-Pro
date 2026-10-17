/**
 * The shadcn registry, generated fresh from the sources: valid against
 * shadcn's own schema, complete, self-consistent, and safe to install next
 * to an existing shadcn/ui project.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { registryItemSchema, registrySchema } from "shadcn/schema";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";

const ROOT = path.join(import.meta.dir, "..");
const BASE = "https://registry.test";

type Item = {
  name: string;
  type: string;
  files?: { path: string; type: string; target?: string }[];
  dependencies?: string[];
  registryDependencies?: string[];
};
let registry: { items: Item[] };

beforeAll(() => {
  const run = Bun.spawnSync(["bun", "scripts/build-registry.ts"], { cwd: ROOT, env: { ...process.env, REGISTRY_URL: BASE } });
  if (run.exitCode !== 0) throw new Error(run.stderr.toString());
  registry = JSON.parse(readFileSync(path.join(ROOT, "registry.json"), "utf8"));
});

const names = () => new Set(registry.items.map((i) => i.name));

describe("shadcn registry", () => {
  test("passes shadcn's registry schema, and every item passes the item schema", () => {
    expect(registrySchema.safeParse(registry).success).toBe(true);
    for (const item of registry.items) {
      const result = registryItemSchema.safeParse(item);
      if (!result.success) throw new Error(`${item.name}: ${JSON.stringify(result.error.issues)}`);
    }
  });

  test("has every component, section design, and lab, plus the theme and fonts", () => {
    const n = names();
    for (const c of components) expect(n.has(c.slug)).toBe(true);
    for (const s of sections) {
      for (const v of s.variants) expect(n.has(s.variants.length > 1 ? `${v.id}-${s.slug}` : `${s.slug}-section`)).toBe(true);
    }
    for (const l of labs) expect(n.has(`${l.slug}-lab`)).toBe(true);
    for (const x of ["theme", "fonts", "utils", "game-utils"]) expect(n.has(x)).toBe(true);
  });

  test("every registry dependency is an item in this registry", () => {
    const n = names();
    for (const item of registry.items) {
      for (const dep of item.registryDependencies ?? []) {
        expect(dep.startsWith(`${BASE}/r/`)).toBe(true);
        expect(n.has(dep.slice(`${BASE}/r/`.length, -".json".length))).toBe(true);
      }
    }
  });

  test("every visual item pulls in the theme", () => {
    for (const item of registry.items.filter((i) => i.type === "registry:ui" || i.type === "registry:block")) {
      expect(item.registryDependencies).toContain(`${BASE}/r/theme.json`);
    }
  });

  test("files install into streamui/ folders, never over a project's own shadcn/ui files", () => {
    const targets = registry.items.flatMap((i) => (i.files ?? []).map((f) => f.target!));
    expect(targets.length).toBeGreaterThan(40);
    for (const t of targets) expect(t).toMatch(/^@(ui|components|lib|hooks)\/streamui\//);
    expect(new Set(targets).size).toBe(targets.length);
  });

  test("generated files import only npm packages and registry paths that exist in the item's tree", () => {
    const byName = new Map(registry.items.map((i) => [i.name, i]));
    for (const item of registry.items) {
      // The files this item can see: its own, plus everything it depends on, transitively.
      const visible = new Set<string>();
      const walk = (it: Item) => {
        for (const f of it.files ?? []) visible.add(f.path.replace(/\.tsx?$/, ""));
        for (const d of it.registryDependencies ?? []) walk(byName.get(d.slice(`${BASE}/r/`.length, -".json".length))!);
      };
      walk(item);
      for (const f of item.files ?? []) {
        expect(existsSync(path.join(ROOT, f.path))).toBe(true);
        const code = readFileSync(path.join(ROOT, f.path), "utf8");
        for (const [, spec] of code.matchAll(/from\s+"([^"]+)"/g)) {
          if (spec.startsWith("@/registry/")) expect(visible.has(spec.slice(2))).toBe(true);
          else expect(spec.startsWith("@/") || spec.startsWith(".")).toBe(false);
        }
      }
    }
  });

  test("npm dependencies are declared for what the files import", () => {
    const button = registry.items.find((i) => i.name === "utils")!;
    expect(button.dependencies).toEqual(["clsx", "tailwind-merge"]);
    const hero = registry.items.find((i) => i.name === "flappy-hero")!;
    expect(hero.dependencies).toContain("lucide-react");
  });

  test("the standalone best score hook doesn't depend on this site's consent store", () => {
    const code = readFileSync(path.join(ROOT, "registry/streamui/lib/streamui/games/best-score.ts"), "utf8");
    expect(code).not.toMatch(/import[^;]*consent/);
  });
});
