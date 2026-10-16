# @streamuilib/react

Neo-brutalist React components for Tailwind CSS v4: hard edges, hard shadows,
and every state styled. Includes animated icons that work with any SVG icon set.

## Install

```bash
bun add @streamuilib/react
```

Needs React 19 and Tailwind CSS v4. Docs and live examples: **[streamui.org](https://streamui.org)**.

## Set up Tailwind

In your main stylesheet, import the theme after Tailwind and point Tailwind at
the package so it generates the classes the components use:

```css
@import "tailwindcss";
@import "@streamuilib/react/theme.css";
@source "../node_modules/@streamuilib/react/dist";
```

The `@source` path is relative to the stylesheet, so adjust the `../` to match
where your CSS file lives.

## Use

```tsx
import { Button, Badge, AnimatedIcon } from "@streamuilib/react";
import { Rocket } from "lucide-react";

export function Launch() {
  return (
    <Button>
      <AnimatedIcon animation="bounce">
        <Rocket aria-hidden />
      </AnimatedIcon>
      Launch <Badge tone="pink">new</Badge>
    </Button>
  );
}
```

Works in Server Components: interactive pieces (`Switch`, `Tabs`, `AnimatedIcon`)
are marked `"use client"` individually, so helpers like `cn()` and
`buttonStyles()` can still be called on the server.

## What's inside

| Export | |
| --- | --- |
| `Button`, `buttonStyles()` | Four variants, four sizes. `buttonStyles()` styles links as buttons. |
| `Badge` | Status and category labels in six tones. |
| `Card` + `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Bordered surface with a hard shadow, in six soft tones. |
| `Alert` | Info, success, warning, and danger messages with icon, title, and actions. |
| `Input` | Text field with optional icon and invalid state. |
| `Textarea` | Multi-line field in the same frame as Input. |
| `Select` | Native select, styled: platform pickers and full keyboard support. |
| `Checkbox` | Native checkbox with a styled face. |
| `Radio`, `RadioGroup` | Native radios with a styled face, grouped in a labelled fieldset. |
| `Switch` | Accessible on/off toggle, controlled or uncontrolled. |
| `Tabs` | WAI-ARIA tabs with arrow-key navigation. |
| `Accordion` | Native details/summary sections, optionally one open at a time. |
| `Dialog` | Modal on native `<dialog>`: focus trap, Esc to close, focus return. |
| `Tooltip` | Hint on hover and focus, Esc to dismiss, linked with aria-describedby. |
| `Progress` | Determinate progress bar. |
| `Skeleton` | Loading placeholders that pulse only when motion is allowed. |
| `Avatar`, `AvatarGroup` | Initials avatars and overlapping stacks. |
| `AnimatedIcon` | Animates any SVG icon: `draw`, `spin`, `bounce`, `wiggle`, `pulse`, `shake`, `pop`. Triggers: `hover`, `loop`, `once`. |
| `cn()` | `clsx` + `tailwind-merge`, aware of the brutal shadow tokens. |

All animations stop when the user prefers reduced motion.

## Support

stream/ui is free and MIT licensed. If it helps you, consider
[sponsoring it](https://streamui.org/sponsor).

---

## Developing this package

From the repo root:

```bash
bun run ui:build   # one-off build into packages/react/dist
bun run ui:dev     # rebuild on every change (run next to `bun dev`)
```

The docs site depends on this package through the workspace
(`"@streamuilib/react": "workspace:*"`), so it always uses the local build.

## Publishing to npm

One-time setup:

1. Create an account at [npmjs.com](https://www.npmjs.com/signup) and turn on
   two-factor authentication.
2. Create the **`streamuilib`** organization (free for public packages) at
   [npmjs.com/org/create](https://www.npmjs.com/org/create). The scope
   `@streamuilib/` only works for accounts that belong to that org.
3. Log in from the terminal. Bun reads the same credentials as npm:

   ```bash
   bunx npm login
   ```

Every release:

```bash
cd packages/react

# 1. Bump the version (patch: 0.1.0 → 0.1.1, minor: → 0.2.0, major: → 1.0.0).
#    This also creates a git tag, so commit your changes first.
bun pm version patch

# 2. See exactly what would be uploaded, without uploading anything
bun publish --dry-run

# 3. Publish (builds first via prepublishOnly). Add --otp=123456 if npm asks
#    for your two-factor code.
bun publish
```

`publishConfig.access` is already `public`, which scoped packages need on
their first publish. After publishing, the package is live at
`https://www.npmjs.com/package/@streamuilib/react`.

Notes:

- A version number can only be published once. To fix a bad release, publish
  a new version; use `npm deprecate` to warn people off the broken one.
- `npm unpublish` only works within 72 hours and only if nothing depends on
  the package, so treat every publish as permanent.
- To publish from CI instead, create an **automation** access token on npm and
  expose it as `NPM_CONFIG_TOKEN` in the CI environment.
