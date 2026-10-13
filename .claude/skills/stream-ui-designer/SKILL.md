---
name: stream-ui-designer
description: Design and build components and screens for stream-ui-lib so they look considered and stay consistent with the project's design system. Use when creating or restyling any component, page, or layout in this repo, when adding or changing design tokens in globals.css, when choosing icons, colors, spacing, radii, shadows, or motion, or when reviewing UI here for visual quality. Builds on the general ui-designer skill with this repo's Tailwind v4 tokens, icon rules, and component conventions.
---

# stream-ui-lib: UI design

Load the general `ui-designer` skill as well when it is available. It covers hierarchy,
spacing, type, and color theory. This skill covers how those ideas apply in **this** repo.

## Stack facts

- **Tailwind CSS v4.** There is no `tailwind.config.*`. Tokens live in CSS:
  `src/app/globals.css` uses `@import "tailwindcss"` and an `@theme inline { … }` block.
  A token `--color-surface` becomes `bg-surface`, `text-surface`, `border-surface`, and so on.
- **Fonts** (Google, via `next/font` in `src/app/layout.tsx`):
  - `font-display` is **Archivo Black**, for headings, the wordmark, the marquee, and big type.
    It has a single weight, so never pair it with `font-bold`/`font-black`. Weight synthesis is
    off globally, so no faux bold.
  - `font-sans` is **Space Grotesk** (300–700), for body copy and UI labels. This is the default.
  - `font-mono` is **Space Mono** (400/700), for eyebrows, file labels, code, and counters.
- **Light only, by design.** No dark mode. Backgrounds are light paper shades or flat brights;
  ink (`--ink`) is for lines, text, and hard shadows only, never large fills. Don't add a
  `prefers-color-scheme: dark` block or dark sections.
- **Palette:** lime (`bg-lime`) is the primary accent for main actions, highlights, and the logo.
  Pink is second (the CTA band, emphasis). Blue, violet, and orange are sparing accents.
  Use the `*-soft` tints (`bg-lime-soft`, `bg-pink-soft`, …) for large light surfaces. There
  is no yellow or green; don't add them back.
- **Avoid the "vibecoded" look.** Skip buzzword marquees, don't invent stats, and write plain,
  specific copy that says what the thing does, not jokes ("may explode", "built at 2am").
- **Exception: the hero.** The user chose the playful hero (`src/components/blocks/Hero.tsx`):
  the tilted specimen-card collage, the "100% typed" sticker, and the "UI that doesn't whisper"
  headline. Keep it as is. Don't spread tilted cards or stickers to other sections.
- **The look is neo-brutalist:** 2px ink borders, hard offset shadows (`shadow-brutal-*`),
  flat bright fills with `text-on-bright`, and a railed layout (`Section`/`Rail` in
  `src/components/ui/Section.tsx`) with hatched margins.
- **Icons:** `lucide-react` (primary) and `react-icons` (only for brand logos Lucide lacks).

## Tokens first

Before you write a component, make sure the tokens it needs exist in `globals.css`. Never put
raw hex values or arbitrary values (`p-[13px]`, `bg-[#3b82f6]`) in components.

Define the semantic layer once, as CSS vars on `:root`, then map them in `@theme inline`.
The real tokens are already in `globals.css` (`paper*`, `ink*`, the brights, `on-bright`);
extend those rather than following this sketch literally:

```css
:root {
  --background: oklch(1 0 0);
  --surface: oklch(0.98 0 0);
  --surface-raised: oklch(0.96 0 0);
  --border: oklch(0.92 0 0);
  --foreground: oklch(0.2 0 0);
  --muted: oklch(0.5 0 0);
  --accent: oklch(0.62 0.19 260);
  --accent-foreground: oklch(0.99 0 0);
  --danger: oklch(0.6 0.22 25);
  --success: oklch(0.65 0.17 150);
}

@theme inline {
  --color-surface: var(--surface);
  --color-accent: var(--accent);
  /* …one line per semantic token */
  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 1rem;
}
```

Use `oklch` so tints are perceptually even. Derive hover and pressed states with
`color-mix(in oklch, var(--accent) 88%, black)` rather than picking a new hue.

## Component conventions

- One component per file under `src/components/` (`ui/` for primitives, `blocks/` for
  composed sections). Name files in PascalCase to match the export.
- Primitives accept `className` and merge it last, so callers can override styles.
  Once a few components have variants, add `clsx` + `tailwind-merge` as a `cn()` helper
  in `src/lib/cn.ts`.
- Model variants as a typed prop (`variant: "primary" | "ghost"`, `size: "sm" | "md"`)
  that maps to class strings in an object. Don't build class names by string concatenation.
- Spread native props (`...props` typed from `React.ComponentProps<"button">`) so primitives
  behave like the elements they wrap.

## Every interactive element ships with all its states

Default, hover, `focus-visible` (a visible ring: `focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-accent`), active, disabled
(`disabled:opacity-50 disabled:pointer-events-none`), and loading where relevant.
Data-driven components also need empty, loading (skeleton), and error states.
Build all of them together; don't save them for later.

## Icons

- Import named icons individually: `import { Play } from "lucide-react"`. Never import the whole set.
- Size icons with `size-4` (inline with text-sm), `size-5` (buttons/inputs), or `size-6` (standalone).
  Let color inherit through `currentColor`.
- Lucide's default `strokeWidth` is 2. Pick one value per project (1.75 often reads cleaner)
  and use it everywhere.
- Icon-only buttons need `aria-label`. Decorative icons next to text get `aria-hidden`.
- Use `react-icons` (`react-icons/si`, `react-icons/fa6`) only for brand marks.

## Motion

- Use 150–200ms for hover and color changes and 200–300ms for enter/exit. Ease-out on enter.
- Animate `transform` and `opacity` only.
- Wrap anything larger than a hover fade in `motion-safe:` or honor `prefers-reduced-motion`.

## Before calling UI done

1. Check it with the OS in dark mode too; the page must stay light.
2. Check it at 375px wide with no horizontal scroll.
3. Tab through it: the focus ring is visible on every control and the order makes sense.
4. Make sure it has no raw colors or arbitrary values.
5. Run `bun run lint` and `bunx tsc --noEmit` and confirm both are clean.
6. Look at it in the running app (`bun dev`), not only in the code.
