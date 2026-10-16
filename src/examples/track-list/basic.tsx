"use client";

import { useState } from "react";
import { TrackList } from "@streamuilib/react";
import { useDemoTracks } from "@/lib/audio/demo-tracks";

export default function TrackListBasic() {
  const [index, setIndex] = useState(0);
  return (
    <TrackList
      tracks={useDemoTracks()}
      index={index}
      playing
      onSelect={setIndex}
      className="w-full max-w-sm border-2 border-ink shadow-brutal"
    />
  );
}
