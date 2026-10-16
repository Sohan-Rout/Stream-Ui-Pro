"use client";

import { Disc3, LoaderCircle, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { cn } from "./cn";
import { Button } from "./Button";
import { Equalizer } from "./Equalizer";
import { Slider } from "./Slider";
import { TrackList } from "./TrackList";
import { formatTime, type Track } from "./music";
import { toneBg } from "./tones";
import { useAudioPlayer, type UseAudioPlayerOptions } from "./useAudioPlayer";

/** Cover art, or a toned tile with a disc when there isn't any. */
export function TrackCover({ track, className }: { track?: Track; className?: string }) {
  if (track?.cover) {
    return (
      // A cover can come from any host the app chooses, so it's a plain <img>.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={track.cover}
        alt=""
        className={cn("aspect-square shrink-0 border-2 border-ink object-cover shadow-brutal-sm", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "grid aspect-square shrink-0 place-items-center border-2 border-ink text-on-bright shadow-brutal-sm",
        toneBg[track?.tone ?? "lime"],
        className,
      )}
    >
      <Disc3 className="size-1/2" strokeWidth={1.75} />
    </span>
  );
}

export type AudioPlayerProps = UseAudioPlayerOptions & {
  tracks: Track[];
  /** Show the track list under the controls. */
  playlist?: boolean;
  className?: string;
};

/**
 * A full player: cover, title, previous / play / next, seek with times,
 * volume with mute, and an optional playlist. Built on useAudioPlayer.
 */
export function AudioPlayer({ tracks, playlist = false, className, ...options }: AudioPlayerProps) {
  const p = useAudioPlayer(tracks, options);
  const title = p.track?.title ?? "No track";

  return (
    <section
      aria-label={`Audio player: ${title}`}
      className={cn("flex w-full max-w-md flex-col border-2 border-ink bg-paper-raised text-ink shadow-brutal", className)}
    >
      <audio {...p.audioProps} />

      <div className="flex items-center gap-4 border-b-2 border-ink p-4">
        <TrackCover track={p.track} className="size-20 sm:size-24" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="font-mono text-xs text-ink-muted uppercase">
            Track {p.index + 1} of {tracks.length}
          </p>
          <p className="truncate text-lg leading-tight font-bold">{title}</p>
          {p.track?.artist && <p className="truncate text-sm text-ink-muted">{p.track.artist}</p>}
          <Equalizer playing={p.playing} bars={5} className="mt-2" tone={p.track?.tone ?? "lime"} />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <Slider
          aria-label="Seek"
          aria-valuetext={`${formatTime(p.time)} of ${formatTime(p.duration)}`}
          value={p.time}
          max={p.duration || 1}
          step="any"
          disabled={!p.ready}
          onValueChange={p.seek}
          tone={p.track?.tone ?? "lime"}
        />
        <div className="flex justify-between font-mono text-xs text-ink-muted tabular-nums">
          <span>{formatTime(p.time)}</span>
          <span>{formatTime(p.duration)}</span>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="secondary" className="size-10" aria-label="Previous track" onClick={p.previous}>
              <SkipBack aria-hidden />
            </Button>
            <Button
              size="icon"
              className="size-12"
              aria-label={p.playing ? "Pause" : "Play"}
              disabled={!p.ready}
              onClick={p.toggle}
            >
              {p.buffering && p.playing ? (
                <LoaderCircle aria-hidden className="motion-safe:animate-spin" />
              ) : p.playing ? (
                <Pause aria-hidden />
              ) : (
                <Play aria-hidden />
              )}
            </Button>
            <Button size="icon" variant="secondary" className="size-10" aria-label="Next track" onClick={p.next}>
              <SkipForward aria-hidden />
            </Button>
          </div>

          <div className="flex w-36 items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="size-9 shrink-0"
              aria-label={p.muted ? "Unmute" : "Mute"}
              aria-pressed={p.muted}
              onClick={p.toggleMute}
            >
              {p.muted || p.volume === 0 ? <VolumeX aria-hidden /> : <Volume2 aria-hidden />}
            </Button>
            <Slider
              aria-label="Volume"
              aria-valuetext={`${Math.round((p.muted ? 0 : p.volume) * 100)}%`}
              value={p.muted ? 0 : p.volume}
              max={1}
              step={0.05}
              onValueChange={p.setVolume}
              tone="blue"
            />
          </div>
        </div>
      </div>

      {playlist && (
        <TrackList
          tracks={tracks}
          index={p.index}
          playing={p.playing}
          onSelect={p.select}
          className="border-t-2 border-ink"
        />
      )}

      <p aria-live="polite" className="sr-only">
        {p.playing ? `Playing ${title}${p.track?.artist ? ` by ${p.track.artist}` : ""}` : ""}
      </p>
    </section>
  );
}

export type MiniPlayerProps = UseAudioPlayerOptions & {
  tracks: Track[];
  className?: string;
};

/** A compact bar: cover, title, play/pause, next, and a thin seek line. */
export function MiniPlayer({ tracks, className, ...options }: MiniPlayerProps) {
  const p = useAudioPlayer(tracks, options);
  const title = p.track?.title ?? "No track";

  return (
    <section
      aria-label={`Mini player: ${title}`}
      className={cn("flex w-full max-w-md flex-col border-2 border-ink bg-paper-raised text-ink shadow-brutal", className)}
    >
      <audio {...p.audioProps} />
      <div className="flex items-center gap-3 p-3">
        <TrackCover track={p.track} className="size-12" />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate font-bold">{title}</p>
          {p.track?.artist && <p className="truncate text-xs text-ink-muted">{p.track.artist}</p>}
        </div>
        <Equalizer playing={p.playing} bars={3} className="hidden sm:inline-flex" tone={p.track?.tone ?? "lime"} />
        <Button size="icon" className="size-10" aria-label={p.playing ? "Pause" : "Play"} disabled={!p.ready} onClick={p.toggle}>
          {p.playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        </Button>
        <Button size="icon" variant="secondary" className="size-10" aria-label="Next track" onClick={p.next}>
          <SkipForward aria-hidden />
        </Button>
      </div>
      <Slider
        aria-label="Seek"
        aria-valuetext={`${formatTime(p.time)} of ${formatTime(p.duration)}`}
        value={p.time}
        max={p.duration || 1}
        step="any"
        disabled={!p.ready}
        onValueChange={p.seek}
        tone={p.track?.tone ?? "lime"}
        className="h-7 border-t-2 border-ink px-3"
      />
      <p aria-live="polite" className="sr-only">
        {p.playing ? `Playing ${title}` : ""}
      </p>
    </section>
  );
}
