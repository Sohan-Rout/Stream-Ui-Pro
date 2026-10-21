"use client";

import { useState } from "react";
import { ComicTrackList } from "@streamuilib/react";
import { useDemoTracks } from "@/lib/audio/demo-tracks";

export default function ComicTrackListBasic() {
  const [index, setIndex] = useState(0);
  return (
    <ComicTrackList
      tracks={useDemoTracks()}
      index={index}
      playing
      onSelect={setIndex}
      className="w-full max-w-sm -rotate-1 border-[3px] border-ink shadow-[5px_5px_0_var(--ink)]"
    />
  );
}
