"use client";

import { Disc3, LoaderCircle, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "./cn";
import { halftone, sketchy } from "./comic";
import { ComicButton } from "./ComicButton";
import { ComicEqualizer } from "./ComicEqualizer";
import { ComicSlider } from "./ComicSlider";
import { ComicTrackList } from "./ComicTrackList";
import type { AudioPlayerProps } from "./AudioPlayer";
import { formatTime, type Track } from "./music";
import { toneBg } from "./tones";
import { useAudioPlayer } from "./useAudioPlayer";

export type ComicAudioPlayerProps = AudioPlayerProps;

/** Cover art as a tilted sticker, or a toned tile with a spinning disc. */
function ComicCover({ track, spinning }: { track?: Track; spinning: boolean }) {
  return (
    <span className="relative shrink-0 -rotate-3">
      {track?.cover ? (
        // A cover can come from any host the app chooses, so it's a plain <img>.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={track.cover} alt="" className="size-22 border-[3px] border-ink object-cover shadow-[4px_4px_0_var(--ink)] sm:size-26" />
      ) : (
        <span
          aria-hidden
          className={cn("grid size-22 place-items-center border-[3px] border-ink text-on-bright shadow-[4px_4px_0_var(--ink)] sm:size-26", toneBg[track?.tone ?? "lime"])}
          style={halftone(16)}
        >
          <Disc3 data-spinning={spinning || undefined} className="sui-comic-disc size-1/2" strokeWidth={2} />
        </span>
      )}
    </span>
  );
}

/**
 * A comic-book audio player: a hand-inked panel with a tilted cover sticker,
 * a shouty title, a bouncing comic meter, a starburst play button, comic
 * seek and volume sliders, and an optional playlist. Built on useAudioPlayer,
 * with the same controls and announcements as AudioPlayer.
 */
export function ComicAudioPlayer({ tracks, playlist = false, className, ...options }: ComicAudioPlayerProps) {
  const p = useAudioPlayer(tracks, options);
  const title = p.track?.title ?? "No track";
  const tone = p.track?.tone ?? "lime";

  return (
    <section
      aria-label={`Audio player: ${title}`}
      className={cn(
        "relative flex w-full max-w-md flex-col border-[3px] border-ink bg-paper-raised text-ink shadow-[6px_6px_0_var(--ink)]",
        sketchy,
        className,
      )}
    >
      <audio {...p.audioProps} />

      <div className="flex items-center gap-4 border-b-[3px] border-ink p-4" style={halftone(9)}>
        <ComicCover track={p.track} spinning={p.playing} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="w-fit -rotate-2 border-[3px] border-ink bg-lime px-1.5 font-mono text-[10px] font-bold tracking-wide uppercase text-on-bright">
            Track {p.index + 1} of {tracks.length}
          </p>
          <p className="mt-1 truncate font-mono text-lg leading-tight font-bold uppercase">{title}</p>
          {p.track?.artist && <p className="truncate text-sm text-ink-muted">{p.track.artist}</p>}
          <ComicEqualizer playing={p.playing} bars={6} className="mt-2 h-7 w-fit" />
        </div>
      </div>

      <div className="flex flex-col gap-1 p-4">
        <ComicSlider
          aria-label="Seek"
          aria-valuetext={`${formatTime(p.time)} of ${formatTime(p.duration)}`}
          value={p.time}
          max={p.duration || 1}
          step="any"
          disabled={!p.ready}
          onValueChange={p.seek}
          tone={tone}
          showValue={false}
        />
        <div className="flex justify-between font-mono text-xs font-bold text-ink-muted tabular-nums">
          <span>{formatTime(p.time)}</span>
          <span>{formatTime(p.duration)}</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ComicButton shape="blob" size="sm" tone="paper" tilt={-6} pop={false} className="size-12" aria-label="Previous track" onClick={p.previous}>
              <SkipBack aria-hidden className="size-4" strokeWidth={3} />
            </ComicButton>
            <ComicButton
              shape="burst"
              size="sm"
              tone="pink"
              tilt={0}
              pop={p.playing ? "Shh!" : "La la!"}
              aria-label={p.playing ? "Pause" : "Play"}
              disabled={!p.ready}
              onClick={p.toggle}
            >
              {p.buffering && p.playing ? (
                <LoaderCircle aria-hidden className="size-6 motion-safe:animate-spin" strokeWidth={3} />
              ) : p.playing ? (
                <Pause aria-hidden className="size-6" strokeWidth={3} />
              ) : (
                <Play aria-hidden className="size-6" strokeWidth={3} />
              )}
            </ComicButton>
            <ComicButton shape="blob" size="sm" tone="paper" tilt={6} pop={false} className="size-12" aria-label="Next track" onClick={p.next}>
              <SkipForward aria-hidden className="size-4" strokeWidth={3} />
            </ComicButton>
          </div>

          <div className="flex w-40 items-center gap-2">
            <button
              type="button"
              aria-label={p.muted ? "Unmute" : "Mute"}
              aria-pressed={p.muted}
              onClick={p.toggleMute}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-[3px] border-ink bg-paper-raised shadow-[2px_2px_0_var(--ink)] hover:bg-blue focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              {p.muted || p.volume === 0 ? <VolumeX aria-hidden className="size-4" strokeWidth={2.5} /> : <Volume2 aria-hidden className="size-4" strokeWidth={2.5} />}
            </button>
            <ComicSlider
              aria-label="Volume"
              aria-valuetext={`${Math.round((p.muted ? 0 : p.volume) * 100)}%`}
              value={p.muted ? 0 : p.volume}
              max={1}
              step={0.05}
              onValueChange={p.setVolume}
              tone="blue"
              showValue={false}
            />
          </div>
        </div>
      </div>

      {playlist && (
        <ComicTrackList tracks={tracks} index={p.index} playing={p.playing} onSelect={p.select} className="rounded-b-[inherit] border-t-[3px] border-ink" />
      )}

      <p aria-live="polite" className="sr-only">
        {p.playing ? `Playing ${title}${p.track?.artist ? ` by ${p.track.artist}` : ""}` : ""}
      </p>
    </section>
  );
}
