import { Bell, Heart, Rocket, Zap } from "lucide-react";
import { ComicAnimatedIcon } from "@streamuilib/react";

export default function ComicAnimatedIconShapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      <ComicAnimatedIcon animation="shake" shape="burst" tone="lime">
        <Bell aria-hidden strokeWidth={2.5} />
      </ComicAnimatedIcon>
      <ComicAnimatedIcon animation="pop" shape="seal" tone="pink">
        <Heart aria-hidden strokeWidth={2.5} />
      </ComicAnimatedIcon>
      <ComicAnimatedIcon animation="bounce" shape="blob" tone="blue" size="lg">
        <Rocket aria-hidden strokeWidth={2.5} />
      </ComicAnimatedIcon>
      <ComicAnimatedIcon animation="wiggle" shape="splat" tone="orange" size="sm">
        <Zap aria-hidden strokeWidth={2.5} />
      </ComicAnimatedIcon>
    </div>
  );
}
