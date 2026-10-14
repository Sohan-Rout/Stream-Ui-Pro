import { Avatar } from "@/components/ui/Avatar";

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-4">
      <Avatar initials="AL" name="Ada Lovelace" size="sm" tone="pink" />
      <Avatar initials="GH" name="Grace Hopper" size="md" tone="lime" />
      <Avatar initials="KJ" name="Katherine Johnson" size="lg" tone="blue" />
    </div>
  );
}
