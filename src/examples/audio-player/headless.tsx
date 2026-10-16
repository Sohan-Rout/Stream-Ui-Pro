"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import { Button, Slider, formatTime, useAudioPlayer } from "@streamuilib/react";
import { useDemoTracks } from "@/lib/audio/demo-tracks";

/** Your own layout on top of useAudioPlayer: here, a tape-deck strip. */
export default function AudioPlayerHeadless() {
  const tracks = useDemoTracks();
  const p = useAudioPlayer(tracks, { defaultIndex: 1 });

  return (
    <div className="flex w-full max-w-sm items-center gap-3 border-2 border-ink bg-pink-soft p-3 shadow-brutal">
      <audio {...p.audioProps} />
      <Button size="icon" variant="pink" className="size-11" aria-label={p.playing ? "Pause" : "Play"} disabled={!p.ready} onClick={p.toggle}>
        {p.playing ? <Pause aria-hidden /> : <Play aria-hidden />}
      </Button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex justify-between gap-2 font-mono text-xs">
          <span className="truncate font-bold">{p.track?.title}</span>
          <span className="tabular-nums">{formatTime(p.duration - p.time)}</span>
        </div>
        <Slider
          aria-label="Seek"
          aria-valuetext={`${formatTime(p.time)} of ${formatTime(p.duration)}`}
          value={p.time}
          max={p.duration || 1}
          step="any"
          tone="pink"
          disabled={!p.ready}
          onValueChange={p.seek}
        />
      </div>
      <Button size="icon" variant="secondary" className="size-11" aria-label="Next track" onClick={p.next}>
        <SkipForward aria-hidden />
      </Button>
    </div>
  );
}
