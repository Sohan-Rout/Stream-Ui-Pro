import type { Tone } from "./tones";

export type Track = {
  id?: string;
  title: string;
  artist?: string;
  /** Audio URL. Empty means "not available yet"; playback stays disabled. */
  src: string;
  /** Cover image URL. Without one, a toned tile with a disc icon is shown. */
  cover?: string;
  /** Tile color when there's no cover. */
  tone?: Tone;
  /** Known length in seconds, shown before the audio has loaded. */
  duration?: number;
};

/** 83 → "1:23", 3725 → "1:02:05". Unknown or negative values read "0:00". */
export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}
