import { ComicEqualizer } from "@streamuilib/react";

export default function ComicEqualizerBasic() {
  return (
    <div className="flex flex-wrap items-end gap-10 pt-6">
      <ComicEqualizer />
      <ComicEqualizer bars={8} className="h-14" />
      <ComicEqualizer bars={4} tone="pink" notes={false} />
      <ComicEqualizer playing={false} />
    </div>
  );
}
