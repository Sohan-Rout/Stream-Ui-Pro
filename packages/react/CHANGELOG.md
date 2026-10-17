# Changelog

All notable changes to `@streamuilib/react`. Versions follow
[Semantic Versioning](https://semver.org); until 1.0, minor versions may
include breaking changes, and they are called out here.

Each `## x.y.z` section below becomes the notes of its GitHub release.

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
