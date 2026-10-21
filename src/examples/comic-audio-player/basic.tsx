"use client";

import { ComicAudioPlayer } from "@streamuilib/react";
import { useDemoTracks } from "@/lib/audio/demo-tracks";

export default function ComicAudioPlayerBasic() {
  const tracks = useDemoTracks();
  return <ComicAudioPlayer tracks={tracks} loop />;
}
