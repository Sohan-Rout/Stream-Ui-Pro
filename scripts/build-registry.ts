/**
 * Generates the shadcn registry from the real sources, so it can't drift:
 *
 *   registry/streamui/**   copies of each source with imports rewritten to
 *                          `@/registry/streamui/...` (the CLI maps those to
 *                          the installing project's aliases)
 *   registry.json          every item, its files, npm dependencies, and the
 *                          registry items it needs (as full URLs)
 *
 * Then `shadcn build` compiles registry.json into public/r/<item>.json.
 *
 * Items: the theme (tokens, utilities, keyframes from the package's
 * theme.css), fonts, utils, every component, every section design, and every
 * lab with its game rules.
 *
 * Usage: bun scripts/build-registry.ts   (REGISTRY_URL overrides the base URL)
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { components } from "@/registry/components";
import { sections } from "@/registry/sections";
import { labs } from "@/registry/labs";
import { siteConfig } from "@/lib/site";
import { shadcnName } from "@/registry/shadcn";

const ROOT = path.join(import.meta.dir, "..");
const STYLE = "streamui";
const BASE = (process.env.REGISTRY_URL ?? siteConfig.url).replace(/\/$/, "");
const itemUrl = (name: string) => `${BASE}/r/${name}.json`;

/** npm packages the host app already has; never listed as dependencies. */
const PROVIDED = new Set(["react", "react-dom", "next"]);

type ItemType = "registry:ui" | "registry:block" | "registry:lib" | "registry:hook" | "registry:component" | "registry:theme" | "registry:font" | "registry:item";
type FileKind = "registry:ui" | "registry:component" | "registry:lib" | "registry:hook";

/** Where one source file lands: its item, its registry path, and its import specifier. */
type Placement = { item: string; regPath: string; spec: string; kind: FileKind; target: string };

type Item = {
  name: string;
  type: ItemType;
  title: string;
  description: string;
  categories?: string[];
  files: { path: string; type: FileKind; target: string }[];
  dependencies: Set<string>;
  registryDependencies: Set<string>;
  docs?: string;
  cssVars?: Record<string, Record<string, string>>;
  css?: Record<string, unknown>;
  font?: Record<string, unknown>;
};

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/* ------------------------------------------------------------------ */
/* Placing files                                                       */
/* ------------------------------------------------------------------ */

const placements = new Map<string, Placement>();
const items = new Map<string, Item>();

function item(name: string, init: Omit<Item, "name" | "files" | "dependencies" | "registryDependencies">): Item {
  const it: Item = { name, files: [], dependencies: new Set(), registryDependencies: new Set(), ...init };
  items.set(name, it);
  return it;
}

/**
 * Files install into a `streamui/` folder inside each alias (components/ui/streamui/button.tsx,
 * lib/streamui/cn.ts, ...), so they sit beside a project's own shadcn/ui files instead of
 * overwriting them: most projects already have a components/ui/button.tsx.
 */
function place(source: string, itemName: string, kind: FileKind, file: string) {
  const sub = `${STYLE}/${file}`;
  const dir = { "registry:ui": "ui", "registry:component": "components", "registry:lib": "lib", "registry:hook": "hooks" }[kind];
  const ext = path.extname(source);
  const regPath = `registry/${STYLE}/${dir}/${sub}${ext}`;
  const alias = { "registry:ui": "@ui", "registry:component": "@components", "registry:lib": "@lib", "registry:hook": "@hooks" }[kind];
  placements.set(source, {
    item: itemName,
    regPath,
    spec: `@/registry/${STYLE}/${dir}/${sub}`,
    kind,
    target: `${alias}/${sub}${ext}`,
  });
}

const PKG = "packages/react/src";
const pkgFile = (name: string) => {
  for (const ext of [".tsx", ".ts"]) {
    try {
      readFileSync(path.join(ROOT, PKG, name + ext));
      return `${PKG}/${name}${ext}`;
    } catch {}
  }
  throw new Error(`No package source for ./${name}`);
};

// Shared helpers.
item("utils", { type: "registry:lib", title: "Utilities", description: "cn() class merging that knows the theme's utilities, tone colors, form-field framing, and the comic-book helpers." });
place(`${PKG}/cn.ts`, "utils", "registry:lib", "cn");
place(`${PKG}/tones.ts`, "utils", "registry:lib", "tones");
place(`${PKG}/field.ts`, "utils", "registry:lib", "field");
place(`${PKG}/comic.ts`, "utils", "registry:lib", "comic");

item("use-audio-player", { type: "registry:hook", title: "useAudioPlayer", description: "Playlist playback on a native <audio> element: play, pause, seek, volume, previous/next, auto-advance." });
place(`${PKG}/music.ts`, "use-audio-player", "registry:lib", "music");
place(`${PKG}/useAudioPlayer.ts`, "use-audio-player", "registry:hook", "use-audio-player");

// Components: one item per package component, named by its docs slug.
for (const c of components) {
  const name = shadcnName.component(c.slug);
  item(name, { type: "registry:ui", title: c.name, description: c.description, categories: ["component"] });
  place(c.file, name, "registry:ui", kebab(path.basename(c.file, path.extname(c.file))));
}

// Section designs: heroes by variant, the rest as "<slug>-section".
// The runner's rules and drawing, shared by the Dino hero and the Dino Runner lab.
item("runner-game", { type: "registry:lib", title: "Runner game", description: "Rules, autopilot, and canvas drawing for the neobrutalist endless runner." });
place("src/lib/games/runner.ts", "runner-game", "registry:lib", "games/runner");
place("src/lib/games/runner-draw.ts", "runner-game", "registry:lib", "games/runner-draw");

for (const s of sections) {
  for (const v of s.variants) {
    const name = shadcnName.section(s, v);
    item(name, {
      type: "registry:block",
      title: s.variants.length > 1 ? `${v.name} ${s.name.toLowerCase()}` : `${s.name} section`,
      description: v.description,
      categories: ["section", s.slug],
    });
    place(v.file, name, "registry:component", name);
  }
}

// Labs, plus the helpers several games share.
item("game-utils", { type: "registry:lib", title: "Game utilities", description: "Fair random numbers, a localStorage best score hook, arcade sound blips, and the palette as hex for canvas games." });
place("src/lib/games/memory.ts", "game-utils", "registry:lib", "games/memory");
place("src/lib/brand.ts", "game-utils", "registry:lib", "brand");
place("scripts/registry/best-score.ts", "game-utils", "registry:lib", "games/best-score");
place("src/lib/games/arcade-sound.ts", "game-utils", "registry:lib", "games/arcade-sound");

for (const l of labs) {
  const name = shadcnName.lab(l.slug);
  item(name, { type: "registry:block", title: l.name, description: l.description, categories: ["lab"] });
  place(l.file, name, "registry:component", name);
}

/* ------------------------------------------------------------------ */
/* Rewriting imports                                                   */
/* ------------------------------------------------------------------ */

/** Which package module exports each name, from the package's index.ts. */
const exportsMap = new Map<string, string>();
for (const m of readFileSync(path.join(ROOT, PKG, "index.ts"), "utf8").matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*"\.\/([^"]+)"/g)) {
  for (const spec of m[1].split(",")) {
    const name = spec.trim().replace(/^type\s+/, "");
    if (name) exportsMap.set(name, pkgFile(m[2]));
  }
}

const IMPORT = /import\s+(type\s+)?([\s\S]*?)\s+from\s+"([^"]+)";?/g;

function resolveAlias(spec: string, from: string, owner: string): string | null {
  if (spec.startsWith("./") || spec.startsWith("../")) {
    if (!from.startsWith(PKG)) throw new Error(`${from}: relative import ${spec} outside the package`);
    return pkgFile(spec.replace(/^\.\//, ""));
  }
  if (spec === "@/lib/cn") return `${PKG}/cn.ts`;
  if (spec === "@/lib/brand") return "src/lib/brand.ts";
  if (spec === "@/lib/games/best-score") return "scripts/registry/best-score.ts";
  const game = spec.match(/^@\/lib\/games\/([\w-]+)$/);
  if (game) {
    // Shared game code is .ts, or .tsx when it draws (the mallet).
    const file = existsSync(path.join(ROOT, `src/lib/games/${game[1]}.tsx`)) ? `src/lib/games/${game[1]}.tsx` : `src/lib/games/${game[1]}.ts`;
    // Game rules travel with the first lab that uses them.
    if (!placements.has(file)) place(file, owner, "registry:lib", `games/${game[1]}`);
    return file;
  }
  if (spec.startsWith("@/")) throw new Error(`${from}: no registry mapping for ${spec}`);
  return null;
}

/** Rewrites one source's imports and records what its item depends on. */
function rewrite(source: string, owner: Item): string {
  const code = readFileSync(path.join(ROOT, source), "utf8");
  const addDep = (target: string) => {
    const p = placements.get(target)!;
    if (p.item !== owner.name) owner.registryDependencies.add(itemUrl(p.item));
    return p.spec;
  };

  return code.replace(IMPORT, (whole, typeOnly: string | undefined, clause: string, spec: string) => {
    if (spec === "@streamuilib/react") {
      // Split named imports by the module that defines each one.
      const names = clause.replace(/^\{|\}$/g, "").split(",").map((s) => s.trim()).filter(Boolean);
      const groups = new Map<string, string[]>();
      for (const n of names) {
        const file = exportsMap.get(n.replace(/^type\s+/, ""));
        if (!file) throw new Error(`${source}: @streamuilib/react has no export ${n}`);
        groups.set(file, [...(groups.get(file) ?? []), n]);
      }
      return [...groups]
        .map(([file, ns]) => `import ${typeOnly ?? ""}{ ${ns.join(", ")} } from "${addDep(file)}";`)
        .join("\n");
    }
    const target = resolveAlias(spec, source, owner.name);
    if (target) return `import ${typeOnly ?? ""}${clause} from "${addDep(target)}";`;
    // An npm package.
    const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
    if (!PROVIDED.has(pkg)) owner.dependencies.add(pkg);
    return whole;
  });
}

/* ------------------------------------------------------------------ */
/* Theme: parse the package's theme.css                                */
/* ------------------------------------------------------------------ */

type CssNode = { [key: string]: string | CssNode };

/** A small parser for our own stylesheet: nested blocks and declarations, no strings with braces. */
function parseCss(text: string): CssNode {
  const src = text.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  function block(): CssNode {
    const node: CssNode = {};
    let buf = "";
    while (i < src.length) {
      const ch = src[i++];
      if (ch === "{") {
        const key = buf.trim().replace(/\s+/g, " ");
        buf = "";
        const child = block();
        const prev = node[key];
        node[key] = typeof prev === "object" ? { ...prev, ...child } : child;
      } else if (ch === "}") {
        if (buf.trim()) decl(node, buf);
        return node;
      } else if (ch === ";") {
        decl(node, buf);
        buf = "";
      } else buf += ch;
    }
    return node;
  }
  function decl(node: CssNode, raw: string) {
    const at = raw.indexOf(":");
    if (at < 0) return;
    node[raw.slice(0, at).trim()] = raw.slice(at + 1).trim().replace(/\s+/g, " ");
  }
  return block();
}

function themeItem() {
  const css = parseCss(readFileSync(path.join(ROOT, PKG, "theme.css"), "utf8"));
  const vars = (node: CssNode) =>
    Object.fromEntries(Object.entries(node).filter(([k]) => k.startsWith("--")).map(([k, v]) => [k.slice(2), String(v)]));
  const light = vars(css[":root"] as CssNode);
  const theme = {
    ...vars(css["@theme inline"] as CssNode),
    // Display and mono faces, falling back cleanly if the font items aren't installed.
    "font-display": "var(--font-archivo-black, ui-sans-serif, system-ui, sans-serif)",
    "font-mono": "var(--font-space-mono, ui-monospace, SFMono-Regular, monospace)",
  };
  const rest = Object.fromEntries(Object.entries(css).filter(([k]) => k !== ":root" && k !== "@theme inline"));
  item("theme", {
    type: "registry:theme",
    title: "stream/ui theme",
    description: "Neobrutalist tokens: paper and ink, five brights and their tints, hard offset shadows, pattern utilities, and animated-icon keyframes.",
    cssVars: { theme, light },
    css: rest,
    docs: "For the full look, also add the fonts: npx shadcn add " + itemUrl("fonts"),
  });
}

function fontItems() {
  const fonts = [
    { name: "font-archivo-black", family: "'Archivo Black', sans-serif", import: "Archivo_Black", variable: "--font-archivo-black", weight: ["400"] },
    { name: "font-space-grotesk", family: "'Space Grotesk', sans-serif", import: "Space_Grotesk", variable: "--font-space-grotesk", weight: ["400", "500", "600", "700"] },
    { name: "font-space-mono", family: "'Space Mono', monospace", import: "Space_Mono", variable: "--font-space-mono", weight: ["400", "700"] },
  ];
  for (const f of fonts) {
    item(f.name, {
      type: "registry:font",
      title: f.family.split(",")[0].replace(/'/g, ""),
      description: `${f.family.split(",")[0].replace(/'/g, "")} from Google Fonts, as ${f.variable}.`,
      font: { family: f.family, provider: "google", import: f.import, variable: f.variable, weight: f.weight, subsets: ["latin"] },
    });
  }
  const bundle = item("fonts", {
    type: "registry:item",
    title: "stream/ui fonts",
    description: "Archivo Black for display, Space Grotesk for body copy, Space Mono for labels.",
    cssVars: { theme: { "font-sans": "var(--font-space-grotesk, ui-sans-serif, system-ui, sans-serif)" } },
  });
  for (const f of fonts) bundle.registryDependencies.add(itemUrl(f.name));
}

/* ------------------------------------------------------------------ */
/* Write                                                               */
/* ------------------------------------------------------------------ */

themeItem();
fontItems();

rmSync(path.join(ROOT, "registry"), { recursive: true, force: true });
// Rewriting can add game files to their lab's placements, so loop until stable.
const written = new Set<string>();
for (let pass = 0; pass < 5; pass++) {
  for (const [source, p] of [...placements]) {
    if (written.has(source)) continue;
    written.add(source);
    const owner = items.get(p.item)!;
    const code = rewrite(source, owner);
    mkdirSync(path.dirname(path.join(ROOT, p.regPath)), { recursive: true });
    writeFileSync(path.join(ROOT, p.regPath), code);
    owner.files.push({ path: p.regPath, type: p.kind, target: p.target });
  }
}

// Everything visual needs the theme.
for (const it of items.values()) {
  if (["registry:ui", "registry:block"].includes(it.type)) it.registryDependencies.add(itemUrl("theme"));
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "streamui",
  homepage: siteConfig.url,
  items: [...items.values()].map(({ dependencies, registryDependencies, ...it }) => ({
    ...it,
    ...(dependencies.size ? { dependencies: [...dependencies].sort() } : {}),
    ...(registryDependencies.size ? { registryDependencies: [...registryDependencies].sort() } : {}),
  })),
};
writeFileSync(path.join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry: ${registry.items.length} items, ${placements.size} files → registry.json (base ${BASE})`);
