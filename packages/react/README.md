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
| `Slider` | Native range input with a styled track and thumb. |
| `Tabs` | WAI-ARIA tabs with arrow-key navigation. |
| `Accordion` | Native details/summary sections, optionally one open at a time. |
| `Dialog` | Modal on native `<dialog>`: focus trap, Esc to close, focus return. |
| `Tooltip` | Hint on hover and focus, Esc to dismiss, linked with aria-describedby. |
| `Progress` | Determinate progress bar. |
| `ComicCard` | Comic-book panel cards with a narration caption and a starburst sound effect. |
| `ComicButton` | Comic-book buttons that pop a POW! on click: panel, bubble, ribbon, and burst shapes. |
| `ComicBadge` | Comic-book sticker badges: burst, seal, splat, blob, speech bubble, and ribbon. |
| `Battery` | Battery level with auto colors, charging and low states, and segments. |
| `Skeleton` | Loading placeholders that pulse only when motion is allowed. |
| `Avatar`, `AvatarGroup` | Initials avatars and overlapping stacks. |
| `AudioPlayer`, `MiniPlayer` | Music players on native `<audio>`: seek, volume, mute, playlist, auto-advance. |
| `useAudioPlayer` | The playback hook behind them, for building your own player. |
| `TrackList` | Playlist with a now-playing meter and `aria-current`. |
| `Equalizer` | Decorative now-playing bars that stop under reduced motion. |
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

# 1. Add a "## 0.2.1" section to CHANGELOG.md describing the release, and
#    commit it (a test fails if the current version has no section).

# 2. Bump the version (patch: 0.2.0 → 0.2.1, minor: → 0.3.0, major: → 1.0.0).
#    This commits the bump and creates the git tag v0.2.1.
bun pm version patch

# 3. See exactly what would be uploaded, without uploading anything
bun publish --dry-run

# 4. Publish (builds first via prepublishOnly). Add --otp=123456 if npm asks
#    for your two-factor code.
bun publish

# 5. Push the commit and the tag. The Release workflow turns the tag into a
#    GitHub release, using the CHANGELOG.md section as its notes.
git push --follow-tags
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
