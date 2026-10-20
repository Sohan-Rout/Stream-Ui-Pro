/** Writes public/brand-icons/ (see scripts/brand-icons.ts). */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import * as si from "react-icons/si";
import { collect, toSvg, type BrandIcon } from "./brand-icons";

const OUT = path.join(import.meta.dir, "..", "public", "brand-icons");
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const icons = collect(si as Record<string, unknown>);
await Promise.all(icons.map(({ slug, Icon }) => Bun.write(path.join(OUT, `${slug}.svg`), toSvg(Icon))));
const index: BrandIcon[] = icons.map(({ name, slug }) => ({ name, slug }));
await Bun.write(path.join(OUT, "index.json"), JSON.stringify(index));
console.log(`brand icons: ${icons.length} → public/brand-icons`);
