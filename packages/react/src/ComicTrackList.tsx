"use client";

import { cn } from "./cn";
import { halftone } from "./comic";
import { ComicEqualizer } from "./ComicEqualizer";
import { formatTime } from "./music";
import type { TrackListProps } from "./TrackList";

export type ComicTrackListProps = TrackListProps;

/**
 * A comic-book playlist: dashed ink dividers, the current track on halftone
 * dots with a NOW! sticker and a bouncing comic meter. Marked aria-current
 * and announced as now playing, the same as TrackList.
 */
export function ComicTrackList({ tracks, index, playing = false, onSelect, className, ...props }: ComicTrackListProps) {
  return (
    <ol aria-label="Playlist" className={cn("divide-y-[3px] divide-dashed divide-ink bg-paper-raised text-ink", className)} {...props}>
      {tracks.map((t, i) => {
        const current = i === index;
        return (
          <li key={t.id ?? `${i}-${t.title}`}>
            <button
              type="button"
              aria-current={current || undefined}
              onClick={() => onSelect?.(i)}
              className={cn(
                "sui-comic-track relative flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-pink-soft focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-blue",
                current && "bg-lime-soft",
              )}
              style={current ? halftone(10) : undefined}
            >
              <span className="grid w-8 shrink-0 place-items-center font-mono text-sm font-bold tabular-nums">
                {current ? <ComicEqualizer playing={playing} bars={3} notes={false} className="h-5 gap-0.5 [&>span]:w-1.5 [&>span]:border-2" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-bold">
                  {current && <span className="sr-only">{playing ? "Now playing: " : "Selected: "}</span>}
                  {t.title}
                </span>
                {t.artist && <span className="truncate text-xs text-ink-muted">{t.artist}</span>}
              </span>
              {current && playing && (
                <span
                  aria-hidden
                  className="sui-comic-stamp shrink-0 rotate-6 border-[3px] border-ink bg-pink px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-on-bright shadow-[2px_2px_0_var(--ink)]"
                >
                  Now!
                </span>
              )}
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
