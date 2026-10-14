---
name: software-engineer
description: Engineering standards for stream-ui-lib (Next.js 16 App Router, React 19, TypeScript strict, Bun). Use when writing or changing any non-trivial code in this repo, such as adding features, routes, data fetching, server actions, state, hooks, or streaming UI; when structuring files or abstractions; when debugging; or before declaring work done. Covers how to verify Next.js APIs against the bundled docs, server/client boundaries, typing, performance, testing, and the verification loop.
---

# stream-ui-lib: software engineering

## Next.js here is newer than your training data

This repo runs **Next.js 16.x** with React 19. APIs and conventions have changed. Before you
use any Next.js API you are not certain about (routing files, caching, `params`, metadata,
server actions, config options), read the matching page in the local docs:

```
node_modules/next/dist/docs/01-app/   # getting-started, guides, api-reference
```

Search them with `grep -ril "<topic>" node_modules/next/dist/docs/01-app`. Follow
deprecation notices. Never "fix" a type error by going back to an older API pattern.

Known current facts:
- `params` and `searchParams` are **Promises**. Write `const { id } = await params`.
- `LayoutProps<"/route">` and `PageProps<"/route">` are global, generated types. Prefer them
  over hand-written prop types.
- Turbopack is the default bundler.

## Tooling: Bun only

- Use `bun add <pkg>` / `bun add -d <pkg>` and `bunx <bin>`. Never use npm, yarn, or pnpm, and
  never create another lockfile.
- Before you add a dependency, check whether the platform or an existing dependency already
  does the job. Prefer small, typed, maintained packages.

## Configuration and secrets (public repo)

This repo is public. Never commit credentials, personal links, or real `.env` files.
Deployment values come from environment variables read and validated in
`src/lib/env.ts` (add new ones there and to `.env.example`, empty). Only variables
the browser needs get the `NEXT_PUBLIC_` prefix. Secrets for publishing or CI
(e.g. `NPM_CONFIG_TOKEN`) belong in the host's or GitHub's secret store.
`tests/secrets.test.ts` fails if a token or `.env` file is committed.

## Server vs client

- Components are Server Components by default. Add `"use client"` only to the smallest leaf
  that needs state, effects, refs, or browser APIs. Don't put it on a page or layout.
- Pass serializable props across the boundary. Don't pass functions down unless they are
  server actions.
- Fetch data on the server, in the component that needs it. Use `<Suspense>` with
  a skeleton fallback to stream slow parts instead of blocking the whole page.
- Keep secrets and server-only modules out of client bundles (`import "server-only"`).

## TypeScript

- `strict` is on. Don't use `any`, and don't use non-null `!` to silence the compiler. Narrow
  with real checks. Use `unknown` plus parsing (e.g. zod) at untrusted boundaries: request
  bodies, `searchParams`, external APIs, `localStorage`.
- Model state as discriminated unions (`{ status: "loading" } | { status: "error"; error: string } | …`)
  instead of several booleans.
- Export types for component props. Derive types (`typeof`, `ComponentProps`, `satisfies`)
  instead of duplicating them.
- Import through the `@/*` alias (maps to `src/*`).

## Structure

```
src/app/                 routes only; (docs)/ holds /components, /sections, /icons, /labs
packages/react/          the published npm package @streamui/react (primitives, AnimatedIcon,
                         theme.css); the site consumes it through the Bun workspace
src/components/ui/       site-only layout pieces (Section, Rail, SectionHeading)
src/components/sections/ full page sections, sized with container queries (@container)
src/components/blocks/   home page and site chrome (header, footer, showcases)
src/components/demos/    home page demos and Labs experiments
src/components/docs/     docs UI: CodeBlock, Example, PropsTable, DocsNav, ...
src/examples/<slug>/     one file per docs example; the file is both preview and shown source
src/registry/            components.ts, sections.ts, labs.ts, nav.ts: the single source of truth
src/lib/                 pure utilities (cn, highlight, source, site config)
```

**Adding a component:** write `packages/react/src/Name.tsx`, export it from
`packages/react/src/index.ts`, run `bun run ui:build`, add example files under
`src/examples/<slug>/`, then add one entry to `src/registry/components.ts` (examples,
props, accessibility notes). The page, sidebar, index card, and prev/next links come from
the registry automatically. Sections and labs work the same way with their registries.

Docs show real source via `readSource()` (`src/lib/source.ts`), so never paste code
strings that duplicate a file.

**Package rules.** Import primitives in the site from `@streamui/react`, never by path.
Inside the package, use relative imports and keep `"use client"` only on files that
need it; the build keeps each file's boundary (see `packages/react/build.ts`). Run
`bun run ui:dev` next to `bun dev` so package edits rebuild. Publishing steps are in
`packages/react/README.md`.

- Write the simple, direct version first. Extract an abstraction only once a second real
  use case shows up.
- Each module does one thing. If a file grows past ~250 lines or mixes concerns, split it.
- Handle errors where you can do something useful about them. Add `error.tsx` boundaries
  for route segments and surface failures in the UI. Never swallow them silently.

## React 19 practices

- Use `useActionState` / `useFormStatus` for forms with server actions, `useOptimistic`
  for optimistic UI, and `use()` to unwrap promises passed from the server.
- Don't use `useEffect` for derived state or data fetching. Compute derived values during
  render. Effects are only for syncing with external systems.
- Give list items stable keys from the data, never the array index for reorderable lists.
- `ref` is a normal prop in React 19, so `forwardRef` isn't needed.

## Performance

- Use `next/image` for images and `next/font` for fonts (already set up).
- Lazy-load heavy client-only components with `next/dynamic`.
- Keep `"use client"` trees small. Bundle size follows the client boundary.
- Before memoizing (`useMemo`, `useCallback`, `memo`), check whether it actually helps.
  Measure first.

## Testing

`bun test` with Testing Library on happy-dom (preloaded via `bunfig.toml`).
Package tests live in `packages/react/test/`, site tests in `tests/`.
Test behavior a user could observe (roles, states, keyboard), not implementation
details. Each bug fix gets a test that would have caught it. When you add a
component, section, or lab, the registry and render tests cover it automatically;
add behavior tests for anything interactive.

## Verification loop (before saying "done")

Shortcut: `bun run check` runs lint, typecheck, tests, and the build in one go.

1. Run `bun run typecheck` and fix every error.
2. Run `bun run lint` and fix every warning you introduced.
3. Run `bun run test` (builds the package first; build-output tests read dist/).
4. Run `bun run build` for anything touching routing, config, or server/client boundaries.
5. Run the app (`bun dev`) and exercise the change in the browser, including error and
   empty states.

Report what you actually ran and what you saw. If something was skipped or failed, say so.

## Git

Use small, focused commits with imperative messages ("Add Button primitive"). Don't commit
`.env*`, build output, or unrelated changes mixed together.
