# Changelog

All notable changes to `@streamuilib/react`. Versions follow
[Semantic Versioning](https://semver.org); until 1.0, minor versions may
include breaking changes, and they are called out here.

Each `## x.y.z` section below becomes the notes of its GitHub release.

## 0.5.0

Every component now has a comic-book design. Each one keeps its classic
counterpart's props, native elements, keyboard support, and ARIA semantics,
and all motion stops under `prefers-reduced-motion`. Nothing existing
changed, so upgrading from 0.4.0 needs no code changes.

### Added

**Shapes**

- `Cube`: a real 3D cube in pure CSS (six faces in a preserve-3d scene, no
  JavaScript), in three `variant`s: `solid` bright faces, `lined` paper with
  one hatched side, or `beveled` faces with popped-out edges. Three sizes, a
  `tone`, and `spin` on a loop or on hover; decorative unless given a `label`.

**Basics**

- `ComicButton`: comic-book buttons (a skewed panel, speech bubble, ribbon,
  burst, seal, splat, or blob) with halftone dots, a lift on hover, a slam into
  the shadow on press, and a "POW!" sound-effect pop on click (`pop` sets the
  words or turns it off).
- `ComicCard`: comic-book panel cards (a skewed panel with halftone dots) with
  an optional narration `caption` and a starburst `sfx`; lifts on hover and the
  burst jumps. Compose the inside with CardTitle and CardDescription.
- `ComicAlert`: a speech bubble pointing at a starburst with the tone's icon, a
  shouty title, and a stamped sound effect (HEY!, YES!, UH-OH!, YIKES!). Pops
  in on mount; warnings and errors shake the burst. Same tones and roles as
  Alert.

**Form fields**

- `ComicInput`, `ComicTextarea`, `ComicSelect`: a thick ink frame with
  hand-inked corners, halftone dots, and a shadow that lifts on focus. Invalid
  fields tint pink and get an "Oops!" sticker (`sfx` sets or drops it).
  ComicTextarea is a speech bubble with a `tail`; ComicSelect's arrow sits on a
  starburst that spins on focus.
- `ComicCheckbox`: a hand-inked box whose check mark draws in with a starburst
  flash.
- `ComicRadio` and `ComicRadioGroup`: hand-inked blobs that fill with a
  spinning star, under a caption-box legend.
- `ComicSwitch`: a halftone pill with a rolling starburst thumb and the state
  in the track (`labels`, default ON! / OFF).
- `ComicSlider`: a starburst thumb that turns as it slides, with the value in a
  speech bubble (`showValue`, `formatValue`).

**Disclosure and overlays**

- `ComicTabs`: tilted caption-box tabs over a comic panel; the active tab
  stands up lime and its panel pops in. Same keyboard support as Tabs.
- `ComicAccordion`: hand-inked native `<details>` panels with a starburst
  toggle that spins open and answers on halftone dots.
- `ComicDialog`: a native modal that slams in over a halftone backdrop, with a
  caption-box title, a round close button, and an optional `sfx` burst.
- `ComicTooltip`: a speech-bubble tooltip with a tail and a bouncy pop-in, in
  five `tone`s, built on Tooltip.

**Feedback**

- `ComicProgress`: a hand-inked bar with speed lines racing along the fill, the
  percentage on a starburst at the front, and a "Done!" sticker at 100%
  (`showValue`, `doneLabel`).
- `ComicBattery`: a hand-inked battery that drains from lime to pink, with a
  ZAP! burst when charging and a shaking LOW! when low (`sfx`). Same
  `role="meter"` semantics as Battery.
- `ComicSkeleton`: a dashed loading block of drifting halftone dots.
- `ComicAvatar` and `ComicAvatarGroup`: initials on a blob, starburst, seal, or
  splat sticker that jumps on hover; groups overlap at alternating tilts.

**Media and icons**

- `ComicAudioPlayer`: a hand-inked player with a tilted cover sticker, a comic
  meter, a starburst play button that pops "La la!", comic seek and volume
  sliders, and an optional `ComicTrackList` playlist. Built on useAudioPlayer.
- `ComicTrackList`: a playlist with dashed ink dividers and the current track
  on halftone dots with a NOW! sticker.
- `ComicEqualizer`: thick-inked bars in mixed brights (`tone="mix"`) with music
  `notes` floating up while it plays.
- `ComicAnimatedIcon`: AnimatedIcon on a starburst, seal, splat, or blob
  sticker that bursts impact lines whenever the icon animates.

## 0.4.0

### Added

- `Battery`: a battery level meter whose fill goes lime, orange, then pink as it
  drains, with a charging state (bolt and moving stripes), a blinking low
  state, segments, three sizes, and `role="meter"` semantics.
- `ComicBadge`: comic-book sticker badges in six shapes (starburst, scalloped
  seal, splat, blob, speech bubble, ribbon) with ink outlines and hard shadows
  that follow the shape, the Badge tones, three sizes, a hand-placed tilt, and
  optional spin, wiggle, or pulse that stop for reduced motion.

### Fixed

- Input, Select, Textarea, Accordion, Tabs, and TrackList set their own ink
  text color instead of inheriting it, so they stay readable inside apps
  with a light-on-dark body color.

## 0.3.0

### Added

- Pattern utilities in `theme.css`: `bg-dots`, `bg-hatch`, `bg-pixel-grid`
  (set `--cells` on the element), and `pixel-bevel`, plus the `wiggle`
  keyframes as `animate-wiggle`.

### Changed

- `cn()` treats the pattern utilities as background images, so
  `bg-dots bg-paper` keeps both classes.

## 0.2.0

Music player components.

### Added

- `AudioPlayer`: a full player with cover art, seek bar and times,
  previous / play / next, mute and volume, and an optional playlist.
- `MiniPlayer`: a compact bar with cover, title, play, next, and a seek strip.
- `TrackList`: a playlist that marks the current track for screen readers
  and shows an animated equalizer in place of its number.
- `Equalizer`: animated bars that move only while music plays, and hold
  still for reduced motion.
- `Slider`: a styled native range input with a fill color per tone.
- `useAudioPlayer`: the playback logic without any UI (play/pause, seek,
  volume, mute, previous/next, auto-advance), for building your own player.
- `formatTime` and the `Track` type.

### Fixed

- Slider and equalizer styles now sit in Tailwind's `components` layer, so
  utility classes like `h-3` override them.

## 0.1.0

First release.

### Added

- Components: `Button` (and `buttonStyles` for links), `Badge`, `Switch`,
  `Input`, `Checkbox`, `Tabs`, `Progress`, `Avatar` and `AvatarGroup`, `Card`,
  `Alert`, `Textarea`, `Select`, `Radio` and `RadioGroup`, `Accordion`,
  `Dialog`, `Tooltip`, and `Skeleton`.
- `AnimatedIcon`: draw, spin, bounce, wiggle, pulse, shake, and pop
  animations for any SVG icon, in pure CSS and reduced-motion safe.
- `theme.css`: the neobrutalist design tokens for Tailwind CSS v4.
- `cn()`: class merging that understands the theme's shadow tokens.
