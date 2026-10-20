import { ComicBadge } from "@streamuilib/react";

export default function ComicBadgeAnimated() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <ComicBadge shape="burst" animate="spin" size="lg">
        Sale!
      </ComicBadge>
      <ComicBadge shape="splat" tone="pink" animate="wiggle">
        Wow
      </ComicBadge>
      <ComicBadge shape="bubble" tone="lime" animate="pulse" tilt={-2}>
        Try me
      </ComicBadge>
    </div>
  );
}
