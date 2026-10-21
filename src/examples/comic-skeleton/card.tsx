import { ComicSkeleton } from "@streamuilib/react";

export default function ComicSkeletonCard() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading story"
      className="flex w-72 -rotate-1 flex-col gap-3 border-[3px] border-ink bg-paper-raised p-4 shadow-[5px_5px_0_var(--ink)]"
    >
      <ComicSkeleton className="h-32 w-full" />
      <ComicSkeleton className="h-5 w-3/4" />
      <ComicSkeleton className="h-4 w-full" />
      <ComicSkeleton className="h-4 w-1/2" />
    </div>
  );
}
