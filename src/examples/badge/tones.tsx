import { Badge } from "@/components/ui/Badge";

export default function BadgeTones() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge tone="lime">stable</Badge>
      <Badge tone="pink">new</Badge>
      <Badge tone="blue">beta</Badge>
      <Badge tone="violet">preview</Badge>
      <Badge tone="orange">labs</Badge>
      <Badge tone="paper">deprecated</Badge>
    </div>
  );
}
