import { ComicAvatar, ComicAvatarGroup } from "@streamuilib/react";

const team = [
  { initials: "AL", name: "Ada Lovelace", tone: "lime", shape: "blob" },
  { initials: "GH", name: "Grace Hopper", tone: "pink", shape: "burst" },
  { initials: "KJ", name: "Katherine Johnson", tone: "blue", shape: "seal" },
  { initials: "MH", name: "Margaret Hamilton", tone: "violet", shape: "blob" },
] as const;

export default function ComicAvatarGroupExample() {
  return (
    <ComicAvatarGroup aria-label="Project members">
      {team.map((m) => (
        <ComicAvatar key={m.initials} initials={m.initials} name={m.name} tone={m.tone} shape={m.shape} />
      ))}
      <ComicAvatar initials="+6" name="6 more members" tone="paper" shape="splat" />
    </ComicAvatarGroup>
  );
}
