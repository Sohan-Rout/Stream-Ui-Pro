import { Avatar, AvatarGroup } from "@streamui/react";

const team = [
  { initials: "AL", name: "Ada Lovelace", tone: "lime" },
  { initials: "GH", name: "Grace Hopper", tone: "pink" },
  { initials: "KJ", name: "Katherine Johnson", tone: "blue" },
  { initials: "MH", name: "Margaret Hamilton", tone: "violet" },
] as const;

export default function AvatarGroupExample() {
  return (
    <AvatarGroup aria-label="Project members">
      {team.map((m) => (
        <Avatar key={m.initials} initials={m.initials} name={m.name} tone={m.tone} />
      ))}
      <Avatar initials="+6" name="6 more members" tone="paper" />
    </AvatarGroup>
  );
}
