"use client";

import { ArrowRight } from "lucide-react";
import { Button, ComicButton } from "@streamuilib/react";

/** The Buttons card on /components: a classic button beside comic ones. */
export function ButtonsPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Button>
        Classic <ArrowRight aria-hidden />
      </Button>
      <ComicButton tone="pink">Comic!</ComicButton>
      <ComicButton shape="burst" tone="orange" size="sm" tilt={8}>
        POW
      </ComicButton>
    </div>
  );
}

/** The Comic card inside Buttons: three shapes, small enough for the card. */
export function ComicButtonPreview() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <ComicButton>Get started</ComicButton>
      <ComicButton shape="bubble" tone="paper">
        Say hi!
      </ComicButton>
      <ComicButton shape="burst" tone="pink" size="sm" tilt={8}>
        Buy!
      </ComicButton>
    </div>
  );
}
