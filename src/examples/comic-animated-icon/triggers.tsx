import { RefreshCw, Sparkles, Star } from "lucide-react";
import { ComicAnimatedIcon } from "@streamuilib/react";

export default function ComicAnimatedIconTriggers() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-10 py-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <ComicAnimatedIcon animation="spin" tone="lime">
          <RefreshCw aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
        <span className="font-mono text-xs">hover</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ComicAnimatedIcon animation="pulse" trigger="loop" shape="seal" tone="violet">
          <Sparkles aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
        <span className="font-mono text-xs">loop</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <ComicAnimatedIcon animation="draw" trigger="once" shape="blob" tone="pink" duration={1200}>
          <Star aria-hidden strokeWidth={2.5} />
        </ComicAnimatedIcon>
        <span className="font-mono text-xs">once</span>
      </div>
    </div>
  );
}
