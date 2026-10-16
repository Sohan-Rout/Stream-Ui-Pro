"use client";

import type { ComponentProps } from "react";
import { cn } from "./cn";
import { Equalizer } from "./Equalizer";
import { formatTime, type Track } from "./music";

export type TrackListProps = Omit<ComponentProps<"ol">, "onSelect"> & {
  tracks: Track[];
  /** The current track. */
  index?: number;
  /** Whether the current track is playing (animates its meter). */
  playing?: boolean;
  onSelect?: (index: number) => void;
};

/** A playlist. The current track shows a live meter and is marked aria-current. */
export function TrackList({ tracks, index, playing = false, onSelect, className, ...props }: TrackListProps) {
  return (
    <ol aria-label="Playlist" className={cn("divide-y-2 divide-ink bg-paper-raised", className)} {...props}>
      {tracks.map((t, i) => {
        const current = i === index;
        return (
          <li key={t.id ?? `${i}-${t.title}`}>
            <button
              type="button"
              aria-current={current || undefined}
              onClick={() => onSelect?.(i)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-lime-soft",
                current && "bg-lime-soft",
              )}
            >
              <span className="grid w-5 shrink-0 place-items-center font-mono text-xs text-ink-muted tabular-nums">
                {current ? <Equalizer playing={playing} bars={3} className="h-3.5" /> : i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">
                  {current && <span className="sr-only">{playing ? "Now playing: " : "Selected: "}</span>}
                  {t.title}
                </span>
                {t.artist && <span className="truncate text-xs text-ink-muted">{t.artist}</span>}
              </span>
              {t.duration != null && (
                <span className="shrink-0 font-mono text-xs text-ink-muted tabular-nums">{formatTime(t.duration)}</span>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
