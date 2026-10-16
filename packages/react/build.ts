/**
 * Builds @streamuilib/react into dist/:
 *   - one ESM file per source file, so each keeps its own "use client"
 *     boundary (bundling everything into one client file would stop server
 *     components from calling helpers like cn() and buttonStyles())
 *   - index.js via Bun.Transpiler: Bun.build drops `export … from` lines
 *     whose target is external, so the barrel is transpiled, not bundled
 *   - .d.ts types from tsc
 *   - theme.css copied as-is
 *
 * Everything is written to a staging folder, then synced into dist/ in
 * place: changed files are overwritten, stale ones removed, and dist/ itself
 * is never deleted. A dev server watching dist/ (Turbopack caches a failed
 * resolve) never sees theme.css go missing, and a failed build leaves the
 * previous dist/ untouched.
 *
 * Usage: bun run build.ts [--watch]
 */
import { $, Glob, type BunPlugin } from "bun";
import { watch } from "node:fs";
import { cp, mkdir, rm } from "node:fs/promises";

const SRC = "src";
const DIST = "dist";
const OUT = ".dist-staging";

// Bun picks the JSX runtime from NODE_ENV when the process starts, so the
// package script sets it. Published code must use react/jsx-runtime.
if (process.env.NODE_ENV !== "production") {
  throw new Error("Run with NODE_ENV=production (use `bun run build`).");
}

/** Relative specifiers without an extension get .js, as strict ESM requires. */
const addJsExtensions = (code: string) =>
  code.replace(/(from\s+["'])(\.\.?\/[^"']+?)(?<!\.js)(["'])/g, "$1$2.js$3");

/** Keep sibling modules as imports instead of inlining them into each file. */
const keepRelativeImports: BunPlugin = {
  name: "keep-relative-imports",
  setup(build) {
    build.onResolve({ filter: /^\.\.?\// }, (args) =>
      args.importer.includes(`/${SRC}/`) ? { path: args.path, external: true } : undefined,
    );
  },
};

const USE_CLIENT = /^\s*["']use client["'];?/;

/** Make `dest` match `src`, writing only files whose contents changed. */
async function syncInto(dest: string, src: string) {
  await mkdir(dest, { recursive: true });
  const built = new Set(new Glob("**/*").scanSync(src));
  for (const file of built) {
    const next = Bun.file(`${src}/${file}`);
    const current = Bun.file(`${dest}/${file}`);
    if ((await current.exists()) && (await current.text()) === (await next.text())) continue;
    await Bun.write(current, next);
  }
  for (const file of new Glob("**/*").scanSync(dest)) {
    if (!built.has(file)) await rm(`${dest}/${file}`, { force: true });
  }
}

async function build() {
  const started = performance.now();
  await rm(OUT, { recursive: true, force: true });

  const entrypoints = [...new Glob("*.{ts,tsx}").scanSync(SRC)]
    .filter((f) => f !== "index.ts")
    .map((f) => `${SRC}/${f}`);
  const result = await Bun.build({
    entrypoints,
    root: SRC,
    outdir: OUT,
    target: "browser",
    format: "esm",
    packages: "external",
    plugins: [keepRelativeImports],
  });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    throw new Error("Bundling failed");
  }

  // Bun hoists imports above directives, so put "use client" back on line 1.
  for (const entry of entrypoints) {
    const out = entry.replace(SRC, OUT).replace(/\.tsx?$/, ".js");
    let js = addJsExtensions(await Bun.file(out).text());
    if (USE_CLIENT.test(await Bun.file(entry).text())) {
      js = `"use client";\n${js.replace(/^"use client";\n/m, "")}`;
    }
    await Bun.write(out, js);
  }

  const barrel = new Bun.Transpiler({ loader: "ts", target: "browser" });
  await Bun.write(
    `${OUT}/index.js`,
    addJsExtensions(barrel.transformSync(await Bun.file(`${SRC}/index.ts`).text())),
  );

  await $`bunx tsc -p tsconfig.build.json --outDir ${OUT}`;

  // Same .js extension fix for the type declarations.
  for (const dts of new Glob("*.d.ts").scanSync(OUT)) {
    const path = `${OUT}/${dts}`;
    const text = await Bun.file(path).text();
    await Bun.write(path, addJsExtensions(text));
  }
  await cp(`${SRC}/theme.css`, `${OUT}/theme.css`);

  await syncInto(DIST, OUT);
  await rm(OUT, { recursive: true, force: true });

  console.log(`built ${entrypoints.length + 1} modules in ${Math.round(performance.now() - started)}ms`);
}

await build();

if (process.argv.includes("--watch")) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  console.log(`watching ${SRC}/ for changes…`);
  watch(SRC, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((err) => console.error(err)), 100);
  });
}
