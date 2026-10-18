---
name: brag
description: Capture polished screenshots of stream/ui's best moments (home, hero and features designs, the sections and labs indexes, games mid-play) for social posts, the README, or launch pages. Use when the user says /brag, asks for screenshots, "shots", promo images, or wants to show off what the site looks like, or after shipping a new hero, section, or lab that deserves a shot.
---

# /brag: shoot the site's best moments

`scripts/brag.ts` drives a headless Chrome over the DevTools protocol (no extra
dependencies) and writes 2x PNGs to `brag/<YYYY-MM-DD>/`, which is gitignored.

## Run it

1. Make sure a server is up. Use the running dev server on :3000 if there is one
   (check with `lsof -iTCP:3000 -sTCP:LISTEN`); otherwise start it with
   `preview_start {name: "next-dev"}`. Never start it through Bash.
2. Shoot:

   ```bash
   bun scripts/brag.ts                          # every shot
   bun scripts/brag.ts --only hero,lab-tetris   # names containing any of these
   bun scripts/brag.ts --base https://streamui.org  # the live site
   ```

3. **Look at every image** with Read before handing them over. Reshoot anything
   off: a game caught at a dull moment (ball drained, empty board), a half-loaded
   font, a clipped frame. Fix it by tuning that shot's `wait` or `before` steps.
4. Send the keepers with `SendUserFile` (display `render`) and a one-line caption
   each, saying what the moment shows.

## What it handles for you

- **Cookie banner:** answered "essential" before every page loads, so it never
  blurs the hero.
- **Next.js dev badge:** hidden.
- **Section and lab pages:** clipped to the framed live preview
  (`section[aria-labelledby=preview] > div:last-child`), padded so the brutal
  shadow shows.
- **Games:** each lab shot clicks **Start**, then plays keys on the focused board.
  The games read keys from the board, not the window. `play([[key, ms], ...])`
  holds each key for `ms`.

## Adding a shot

When a new hero, features design, or lab ships, add it to `SHOTS` in
`scripts/brag.ts`:

- **Section variants:** add the id to the hero or features list.
- **Labs:** add a `{ name: "lab-<slug>", path: "/labs/<slug>", selector: PREVIEW, wait, before: play([...]) }` entry.
  Pick keys that land the game on a moment worth showing: pieces stacked, ball
  up the table, the player mid-jump.
- **Full pages:** use `full: true`.
- **Phones:** spread `PHONE` instead of `DESKTOP`.

Keep shot names stable, since posts and the README may link to them.
