import { Bell, Settings, Share2 } from "lucide-react";
import { Button, Tooltip } from "@streamuilib/react";

export default function TooltipBasic() {
  return (
    <div className="flex gap-4 pt-10">
      <Tooltip content="Notifications">
        <Button size="icon" variant="secondary" aria-label="Notifications">
          <Bell aria-hidden />
        </Button>
      </Tooltip>
      <Tooltip content="Copy a share link">
        <Button size="icon" variant="secondary" aria-label="Share">
          <Share2 aria-hidden />
        </Button>
      </Tooltip>
      <Tooltip content="Settings" side="bottom">
        <Button size="icon" variant="secondary" aria-label="Settings">
          <Settings aria-hidden />
        </Button>
      </Tooltip>
    </div>
  );
}
