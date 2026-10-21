import { ComicAvatar } from "@streamuilib/react";

export default function ComicAvatarShapes() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ComicAvatar initials="AL" name="Ada Lovelace" shape="blob" size="sm" />
      <ComicAvatar initials="GH" name="Grace Hopper" shape="burst" tone="pink" tilt={-8} />
      <ComicAvatar initials="KJ" name="Katherine Johnson" shape="seal" tone="blue" />
      <ComicAvatar initials="MH" name="Margaret Hamilton" shape="splat" tone="orange" size="lg" tilt={6} />
    </div>
  );
}
