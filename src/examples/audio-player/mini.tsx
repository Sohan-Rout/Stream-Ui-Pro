"use client";

import { MiniPlayer } from "@streamuilib/react";
import { useDemoTracks } from "@/lib/audio/demo-tracks";

export default function AudioPlayerMini() {
  const tracks = useDemoTracks();
  return <MiniPlayer tracks={tracks} />;
}
