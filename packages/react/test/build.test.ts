/**
 * Guards the published output in dist/. Each check here pins a bug that
 * once shipped from the build, so run `bun run build` first.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { iconAnimations } from "../src";

const ROOT = path.join(import.meta.dir, "..");
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");

const read = (dir: string, file: string) => readFileSync(path.join(dir, file), "utf8");
const sourceFiles = () => readdirSync(SRC).filter((f) => /\.tsx?$/.test(f));
const builtJs = () => readdirSync(DIST).filter((f) => f.endsWith(".js"));
const USE_CLIENT = /^\s*["']use client["']/;

beforeAll(() => {
  if (!existsSync(path.join(DIST, "index.js"))) {
    throw new Error("dist/ is missing. Run `bun run build` before the tests.");
  }
});

describe("dist output", () => {
  test("every source module has a .js and a .d.ts", () => {
    for (const file of sourceFiles()) {
      const base = file.replace(/\.tsx?$/, "");
      expect(existsSync(path.join(DIST, `${base}.js`))).toBe(true);
      expect(existsSync(path.join(DIST, `${base}.d.ts`))).toBe(true);
    }
    expect(existsSync(path.join(DIST, "theme.css"))).toBe(true);
  });

  test('"use client" is on line 1 of exactly the modules that declare it', () => {
    for (const file of sourceFiles()) {
      const isClient = USE_CLIENT.test(read(SRC, file));
      const js = read(DIST, file.replace(/\.tsx?$/, ".js"));
      // Bundlers only honor the directive as the very first statement.
      expect({ file, client: js.startsWith('"use client";') }).toEqual({ file, client: isClient });
    }
  });

  test("components that write their own event handlers are client modules", () => {
    // In a Server Component, a handler like onClick={() => ...} on a native
    // element fails at render time ("Event handlers cannot be passed...").
    const handler = /\bon[A-Z]\w*=\{(?!props\.)/;
    for (const file of sourceFiles().filter((f) => f.endsWith(".tsx"))) {
      const source = read(SRC, file);
      if (!handler.test(source)) continue;
      expect({ file, client: USE_CLIENT.test(source) }).toEqual({ file, client: true });
    }
  });

  test("server-safe helpers stay out of client modules", () => {
    // If these became client references, Server Components couldn't call them.
    for (const file of ["cn.js", "Button.js", "tones.js", "index.js"]) {
      expect(USE_CLIENT.test(read(DIST, file))).toBe(false);
    }
  });

  test("relative imports carry .js extensions (strict ESM)", () => {
    const relative = /(?:from|import)\s*["'](\.\.?\/[^"']+)["']/g;
    for (const file of [...builtJs(), ...readdirSync(DIST).filter((f) => f.endsWith(".d.ts"))]) {
      for (const [, spec] of read(DIST, file).matchAll(relative)) {
        expect({ file, spec, ok: spec.endsWith(".js") }).toEqual({ file, spec, ok: true });
      }
    }
  });

  test("uses the production JSX runtime", () => {
    for (const file of builtJs()) {
      expect({ file, dev: read(DIST, file).includes("jsx-dev-runtime") }).toEqual({ file, dev: false });
    }
  });

  test("dependencies stay external instead of being inlined", () => {
    const cn = read(DIST, "cn.js");
    expect(cn).toContain('from "clsx"');
    expect(cn).toContain('from "tailwind-merge"');
  });

  test("the entry point re-exports everything the source does", async () => {
    const built = await import(path.join(DIST, "index.js"));
    const source = await import(path.join(SRC, "index.ts"));
    expect(Object.keys(built).sort()).toEqual(Object.keys(source).sort());
    for (const value of Object.values(built)) expect(value).toBeDefined();
  });
});

describe("theme.css", () => {
  const css = read(SRC, "theme.css");

  test("defines a keyframe and selector for every icon animation", () => {
    for (const name of iconAnimations) {
      expect(css).toContain(`@keyframes sui-icon-${name}`);
      expect(css).toContain(`[data-sui-icon="${name}"]`);
    }
  });

  test("turns every animation off under reduced motion", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none/);
  });

  test("defines every color the tone helpers reference", () => {
    for (const color of ["lime", "pink", "blue", "violet", "orange", "ink", "paper", "on-bright"]) {
      expect(css).toContain(`--color-${color}:`);
    }
  });
});

describe("package.json", () => {
  const pkg = JSON.parse(read(ROOT, "package.json"));

  test("exports point at files that exist", () => {
    expect(existsSync(path.join(ROOT, pkg.exports["."].import))).toBe(true);
    expect(existsSync(path.join(ROOT, pkg.exports["."].types))).toBe(true);
    expect(existsSync(path.join(ROOT, pkg.exports["./theme.css"].default))).toBe(true);
  });

  test("React is a peer range, not pinned", () => {
    expect(pkg.peerDependencies.react).toBe(">=19");
    expect(pkg.peerDependencies["react-dom"]).toBe(">=19");
  });

  test("ships publicly with a license", () => {
    expect(pkg.publishConfig.access).toBe("public");
    expect(pkg.license).toBe("MIT");
    expect(existsSync(path.join(ROOT, "LICENSE"))).toBe(true);
  });

  test("tests are not published", () => {
    expect(pkg.files).not.toContain("test");
  });
});
