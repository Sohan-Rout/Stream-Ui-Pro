import { ComicSkeleton } from "@streamuilib/react";

export default function ComicSkeletonBasic() {
  return (
    <div aria-busy="true" aria-label="Loading profile" className="flex items-center gap-4">
      <ComicSkeleton className="size-14 rounded-full" />
      <div className="flex flex-col gap-2.5">
        <ComicSkeleton className="h-5 w-44" />
        <ComicSkeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
