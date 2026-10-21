import { Bell, Settings, Share2 } from "lucide-react";
import { Button, ComicTooltip } from "@streamuilib/react";

export default function ComicTooltipBasic() {
  return (
    <div className="flex gap-5 pt-12 pb-12">
      <ComicTooltip content="Ding! New stuff.">
        <Button size="icon" variant="secondary" aria-label="Notifications">
          <Bell aria-hidden />
        </Button>
      </ComicTooltip>
      <ComicTooltip content="Share the love!" tone="lime">
        <Button size="icon" variant="secondary" aria-label="Share">
          <Share2 aria-hidden />
        </Button>
      </ComicTooltip>
      <ComicTooltip content="Tweak things" tone="pink" side="bottom">
        <Button size="icon" variant="secondary" aria-label="Settings">
          <Settings aria-hidden />
        </Button>
      </ComicTooltip>
    </div>
  );
}
