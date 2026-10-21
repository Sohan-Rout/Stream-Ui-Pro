"use client";

import { ArrowRight, Heart } from "lucide-react";
import { ComicButton } from "@streamuilib/react";

export default function ComicButtonSizes() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ComicButton size="sm">Small</ComicButton>
        <ComicButton size="md">Medium</ComicButton>
        <ComicButton size="lg">
          Large <ArrowRight aria-hidden />
        </ComicButton>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <ComicButton tone="pink" pop="LOVE IT!">
          <Heart aria-hidden /> Like
        </ComicButton>
        <ComicButton tone="paper" halftone={false} pop={false} tilt={0}>
          Quiet, no pop
        </ComicButton>
        <ComicButton tone="blue" disabled>
          Disabled
        </ComicButton>
      </div>
    </div>
  );
}
