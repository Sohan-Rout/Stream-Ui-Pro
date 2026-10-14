import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge tone="pink">
        <Sparkles aria-hidden /> new
      </Badge>
      <Badge tone="paper">
        <span aria-hidden className="size-2 rounded-full bg-lime ring-2 ring-ink" />
        all systems normal
      </Badge>
    </div>
  );
}
