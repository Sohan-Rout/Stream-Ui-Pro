import { ComicBadge } from "@streamuilib/react";

export default function ComicBadgeShapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <ComicBadge shape="burst">New!</ComicBadge>
      <ComicBadge shape="seal" tone="pink" tilt={8}>
        50%
        <br />
        off
      </ComicBadge>
      <ComicBadge shape="splat" tone="orange" tilt={-10}>
        Hot
      </ComicBadge>
      <ComicBadge shape="blob" tone="blue" tilt={4}>
        Beta
      </ComicBadge>
      <ComicBadge shape="bubble" tone="paper">
        Hey there!
      </ComicBadge>
      <ComicBadge shape="ribbon" tone="violet" tilt={-3}>
        Best seller
      </ComicBadge>
    </div>
  );
}
