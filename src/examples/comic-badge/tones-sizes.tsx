import { ComicBadge } from "@streamuilib/react";

const tones = ["lime", "pink", "blue", "violet", "orange", "paper"] as const;

export default function ComicBadgeTonesSizes() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-5">
        {tones.map((tone, i) => (
          <ComicBadge key={tone} shape="burst" tone={tone} size="sm" tilt={i % 2 ? 6 : -6}>
            {tone}
          </ComicBadge>
        ))}
      </div>
      <div className="flex flex-wrap items-end justify-center gap-6">
        <ComicBadge shape="seal" size="sm">Sm</ComicBadge>
        <ComicBadge shape="seal" size="md">Md</ComicBadge>
        <ComicBadge shape="seal" size="lg">Lg</ComicBadge>
        <ComicBadge shape="ribbon" tone="pink" size="lg" tilt={0}>
          Limited
        </ComicBadge>
      </div>
    </div>
  );
}
