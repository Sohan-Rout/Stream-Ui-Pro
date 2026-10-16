"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "./music";

export type UseAudioPlayerOptions = {
  defaultIndex?: number;
  /** Start volume, 0–1. */
  defaultVolume?: number;
  /** After the last track, wrap to the first. */
  loop?: boolean;
};

/**
 * Playlist playback on a native <audio> element: play/pause, seek, volume,
 * mute, previous/next, and auto-advance. State follows the element's own
 * events, so it stays true even when the browser pauses playback itself.
 *
 * Render `<audio {...player.audioProps} />` somewhere inside your player.
 */
export function useAudioPlayer(tracks: Track[], options: UseAudioPlayerOptions = {}) {
  const { defaultIndex = 0, defaultVolume = 0.8, loop = true } = options;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(defaultIndex);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [loadedDuration, setLoadedDuration] = useState(0);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [muted, setMuted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  /** Whether a track change should keep playing. */
  const resume = useRef(false);

  const count = tracks.length;
  const current = Math.min(index, Math.max(0, count - 1));
  const track: Track | undefined = tracks[current];
  const ready = Boolean(track?.src);
  const duration = loadedDuration || track?.duration || 0;

  const select = useCallback(
    (next: number, keepPlaying?: boolean) => {
      if (count === 0) return;
      resume.current = keepPlaying ?? resume.current;
      setIndex(((next % count) + count) % count);
      setTime(0);
      setLoadedDuration(0);
    },
    [count],
  );

  const next = useCallback(() => {
    if (!loop && current === count - 1) return;
    select(current + 1);
  }, [current, count, loop, select]);

  // Follow the element's events, so state matches what's actually happening.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = defaultVolume;
    const handlers: [string, () => void][] = [
      ["play", () => setPlaying(true)],
      ["pause", () => setPlaying(false)],
      ["timeupdate", () => setTime(audio.currentTime)],
      ["durationchange", () => setLoadedDuration(Number.isFinite(audio.duration) ? audio.duration : 0)],
      [
        "volumechange",
        () => {
          setVolumeState(audio.volume);
          setMuted(audio.muted);
        },
      ],
      ["waiting", () => setBuffering(true)],
      ["playing", () => setBuffering(false)],
      ["canplay", () => setBuffering(false)],
    ];
    for (const [type, fn] of handlers) audio.addEventListener(type, fn);
    return () => {
      for (const [type, fn] of handlers) audio.removeEventListener(type, fn);
    };
  }, [defaultVolume]);

  // Auto-advance when a track ends (or stop at the end without `loop`).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => {
      if (!loop && current === count - 1) {
        resume.current = false;
        return;
      }
      select(current + 1, true);
    };
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [current, count, loop, select]);

  // A new track loads; keep playing if we were.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !ready || !resume.current) return;
    audio.play().catch(() => {
      // Autoplay can be blocked until the user interacts; they can press play.
      resume.current = false;
    });
  }, [track?.src, ready]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    resume.current = true;
    audio.play().catch(() => {
      resume.current = false;
    });
  }, [ready]);

  const pause = useCallback(() => {
    resume.current = false;
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setTime(seconds);
  }, []);

  /** Restarts the track if you're more than 3s in, like most players; otherwise goes back one. */
  const previous = useCallback(() => {
    if (time > 3) seek(0);
    else select(current - 1);
  }, [time, current, seek, select]);

  const setVolume = useCallback((value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.min(1, Math.max(0, value));
    if (value > 0 && audio.muted) audio.muted = false;
    // Read back what the element accepted; volumechange will confirm it too.
    setVolumeState(audio.volume);
    setMuted(audio.muted);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  }, []);

  return {
    tracks,
    track,
    index: current,
    ready,
    playing,
    buffering,
    time,
    duration,
    volume,
    muted,
    play,
    pause,
    toggle,
    seek,
    next,
    previous,
    select: (i: number) => select(i, true),
    setVolume,
    toggleMute,
    /** Spread onto your <audio> element. */
    audioProps: { ref: audioRef, src: track?.src || undefined, preload: "metadata" as const },
  };
}

export type AudioPlayerControls = ReturnType<typeof useAudioPlayer>;
