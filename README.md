# stream/ui

Neo-brutalist React components with hard edges: 2px ink borders, hard offset
shadows, flat lime and pink brights, and every interactive state styled.

This repo holds two things:

- **[`@streamui/react`](packages/react)**, the component library published to npm
- **The docs site**, a Next.js app that showcases and documents every component,
  page section, icon, and experiment, and uses the package itself

```bash
bun add @streamui/react
```

Docs and live examples: **[streamui.org](https://streamui.org)**. Setup and usage for the package are in
[packages/react/README.md](packages/react/README.md).

## What's in the library

| Part | What you get |
| --- | --- |
| **Components** | Button, Badge, Switch, Input, Checkbox, Tabs, Progress, Avatar, and Animated Icon. Keyboard support and focus states included. |
| **Sections** | Hero, Features, Pricing, Testimonials, FAQ, and Footer, built from the components. They size themselves with container queries, so they fit a full page or a narrow column. |
| **Icons** | The full Lucide set, searchable, with size, stroke, and animation controls. Click an icon to copy its JSX. |
| **Animated icons** | Wrap any SVG icon in `<AnimatedIcon>` to draw, spin, bounce, wiggle, pulse, shake, or pop it on hover, on a loop, or once. Pure CSS, off under reduced motion. |
| **Labs** | Interaction experiments that haven't graduated into the library yet. |

## Getting started

Requires [Bun](https://bun.sh) 1.3 or later.

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000). `bun dev` builds the package
first, then starts Next.js.

To work on the package and the site together, run the package in watch mode in
a second terminal so your edits rebuild automatically:

```bash
bun run ui:dev
```

### Configuration

Deployment settings come from environment variables, so nothing personal or
deployment-specific is committed to this public repo. All of them are optional;
the site builds and runs with none set.

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for links, the sitemap, and share images. Defaults to `https://streamui.org`. |
| `FUNDING_RAZORPAY_URL` | Razorpay payment page shown on `/sponsor` |
| `FUNDING_OPEN_COLLECTIVE_URL` | Open Collective page shown on `/sponsor` |
| `FUNDING_KOFI_URL` | Ko-fi page shown on `/sponsor` |

Values are validated at build time: a malformed or non-https link fails the
build with a message naming the variable. In production, set them in your
host's dashboard (on Vercel: Project Settings → Environment Variables) and
redeploy. `.env*` files are gitignored, and a test fails if one is ever
committed or if a credential appears in any tracked file.

### Scripts

| Script | What it does |
| --- | --- |
| `bun dev` | Builds the package, then starts the dev server |
| `bun run build` | Builds the package, then the production site |
| `bun start` | Serves the production build |
| `bun run lint` | Runs ESLint |
| `bun run typecheck` | Type-checks the site and the package |
| `bun run test` | Builds the package, then runs every test |
| `bun run check` | Lint, typecheck, test, and build: everything CI runs |
| `bun run ui:build` | Builds `@streamui/react` into `packages/react/dist` |
| `bun run ui:dev` | Rebuilds the package on every change |

## Project structure

```
packages/react/          @streamui/react: components, AnimatedIcon, theme.css
  build.ts               Bun build: per-file ESM, types, theme
src/
  app/
    page.tsx             home page
    (docs)/              /components, /sections, /icons, /labs and their detail pages
  components/
    blocks/              home page sections and site chrome (header, footer)
    sections/            the page sections shown under /sections
    docs/                docs UI: code blocks, examples, props tables, navigation
    demos/               home page demos and Labs experiments
    ui/                  site-only layout pieces (Section, Rail, SectionHeading)
  examples/<slug>/       one file per docs example
  registry/              the list of components, sections, and labs the docs are built from
  lib/                   helpers: site config, SEO, share images, highlighting, funding
```

### How the docs work

The `src/registry/` files list every component, section, and lab. Each docs page,
sidebar link, index card, and previous/next link is generated from them.

Docs never paste code by hand. Each example in `src/examples/` is both the live
preview and the source shown under it, and every "Source" panel reads the real
file at build time. Code is highlighted on the server with Shiki, so it adds no
JavaScript to the page.

### Adding a component

1. Write it in `packages/react/src/Name.tsx` and export it from
   `packages/react/src/index.ts`.
2. Run `bun run ui:build`.
3. Add one or more example files under `src/examples/<slug>/`.
4. Add an entry to `src/registry/components.ts` with its examples, props, and
   accessibility notes.

The page at `/components/<slug>` and its navigation links appear automatically.
Sections and labs work the same way with their own registry files.

## Testing

Tests use `bun test` with [Testing Library](https://testing-library.com) on a
[happy-dom](https://github.com/capricorn86/happy-dom) DOM.

```bash
bun run test
```

| Suite | What it protects |
| --- | --- |
| `packages/react/test/*.test.tsx` | Component behavior as users and screen readers see it: roles, states, keyboard navigation, form submission |
| `packages/react/test/build.test.ts` | The published output: `"use client"` on line 1 of client modules only, `.js` import extensions, production JSX, complete exports, peer ranges |
| `tests/registry.test.ts` | Every docs page: unique slugs, real source files, examples, package exports, navigation |
| `tests/render.test.tsx` | Every example, section, and lab mounts without crashing, with no duplicate ids |
| `tests/seo.test.ts` | Canonical URLs, share-card metadata, sitemap, robots, manifest |
| `tests/dice.test.tsx` | The die always lands on the rolled face, opposite faces sum to 7, rolls cover 1 to 6 |
| `tests/env.test.ts` | Environment validation: defaults, https-only links, clear errors |
| `tests/secrets.test.ts` | No `.env` files or credentials (tokens, keys) committed to the public repo |
| `tests/funding.test.ts`, `tests/helpers.test.ts` | Sponsor links, shape roller, icon names copied from the icon browser |

[CI](.github/workflows/ci.yml) runs lint, typecheck, tests, and a full build on
every push and pull request. Publishing the package also runs its tests first.

## Design system

Design tokens live in [packages/react/src/theme.css](packages/react/src/theme.css)
and are shared by the package and the site:

- **Surfaces:** near-white paper in three levels (raised, base, sunken)
- **Ink:** one near-black for text, borders, and shadows
- **Brights:** lime (primary), hot pink (secondary), with blue, violet, and
  orange as sparing accents, plus soft tints for large areas
- **Shadows:** hard offsets (`shadow-brutal-sm`, `shadow-brutal`, `shadow-brutal-lg`).
  Buttons lift toward the light on hover and sink into their shadow on press.
- **Type:** Archivo Black for display, Space Grotesk for body copy, Space Mono
  for labels and code

The theme is light only.

## Tech stack

- [Next.js 16](https://nextjs.org) App Router with Cache Components, on
  [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com), configured in CSS
- TypeScript in strict mode
- [Bun](https://bun.sh) for installs, workspaces, scripts, and the package build
- [Lucide](https://lucide.dev) icons and [Shiki](https://shiki.style) highlighting

## Publishing the package

See [Publishing to npm](packages/react/README.md#publishing-to-npm) in the
package README.

## Support

stream/ui is free and open source. If it saves you time, you can support its
development at **[streamui.org/sponsor](https://streamui.org/sponsor)** (Razorpay,
Open Collective, or Ko-fi), or star the repo.

Sponsor links come from the `FUNDING_*` environment variables (see
[Configuration](#configuration)); unset ones are hidden.

## License

The `@streamui/react` package is [MIT licensed](packages/react/LICENSE) © Sohan Rout.
