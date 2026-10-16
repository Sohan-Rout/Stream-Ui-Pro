"use client";

import { AudioPlayer } from "@streamuilib/react";
import { useDemoTracks } from "@/lib/audio/demo-tracks";

export default function AudioPlayerFull() {
  const tracks = useDemoTracks();
  return <AudioPlayer tracks={tracks} playlist />;
}
