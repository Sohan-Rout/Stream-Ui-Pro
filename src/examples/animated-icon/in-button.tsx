import { Download, Heart, RefreshCw, Send } from "lucide-react";
import { AnimatedIcon, Button } from "@streamui/react";

export default function AnimatedIconInButton() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>
        <AnimatedIcon animation="bounce">
          <Download aria-hidden />
        </AnimatedIcon>
        Download
      </Button>
      <Button variant="secondary">
        <AnimatedIcon animation="spin">
          <RefreshCw aria-hidden />
        </AnimatedIcon>
        Refresh
      </Button>
      <Button variant="pink">
        <AnimatedIcon animation="pop">
          <Heart aria-hidden />
        </AnimatedIcon>
        Like
      </Button>
      <Button variant="blue">
        Send
        <AnimatedIcon animation="shake">
          <Send aria-hidden />
        </AnimatedIcon>
      </Button>
    </div>
  );
}
