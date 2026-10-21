"use client";

import { ComicButton } from "@streamuilib/react";

export default function ComicButtonShapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <ComicButton>Get started</ComicButton>
      <ComicButton shape="bubble" tone="paper">
        Say hi!
      </ComicButton>
      <ComicButton shape="ribbon" tone="violet" tilt={-3}>
        Join the club
      </ComicButton>
      <ComicButton shape="burst" tone="pink" tilt={6}>
        Buy!
      </ComicButton>
      <ComicButton shape="splat" tone="orange" tilt={-8}>
        Go
      </ComicButton>
      <ComicButton shape="blob" tone="blue" tilt={3}>
        Play
      </ComicButton>
    </div>
  );
}
