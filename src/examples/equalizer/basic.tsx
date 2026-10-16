"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button, Equalizer } from "@streamuilib/react";

export default function EqualizerBasic() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="flex items-center gap-6">
      <Equalizer playing={playing} bars={3} tone="lime" />
      <Equalizer playing={playing} bars={5} tone="pink" className="h-8" />
      <Equalizer playing={playing} bars={7} tone="blue" className="h-12 gap-1 [&>span]:w-2" />
      <Button size="sm" variant="secondary" onClick={() => setPlaying(!playing)}>
        {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        {playing ? "Pause" : "Play"}
      </Button>
    </div>
  );
}
