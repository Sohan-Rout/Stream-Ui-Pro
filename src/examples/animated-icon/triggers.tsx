import { CircleCheck, LoaderCircle, MousePointerClick } from "lucide-react";
import { AnimatedIcon } from "@streamuilib/react";

export default function AnimatedIconTriggers() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <p className="flex items-center gap-2 font-semibold">
        <AnimatedIcon animation="spin" trigger="loop" duration={900}>
          <LoaderCircle aria-hidden className="size-5" />
        </AnimatedIcon>
        Syncing…
      </p>
      <p className="flex items-center gap-2 font-semibold">
        <AnimatedIcon animation="draw" trigger="once" duration={900}>
          <CircleCheck aria-hidden className="size-5" />
        </AnimatedIcon>
        Saved
      </p>
      <p className="flex items-center gap-2 font-semibold">
        <AnimatedIcon animation="wiggle">
          <MousePointerClick aria-hidden className="size-5" />
        </AnimatedIcon>
        Hover me
      </p>
    </div>
  );
}
