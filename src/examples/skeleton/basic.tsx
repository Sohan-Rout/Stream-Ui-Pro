import { Skeleton } from "@streamuilib/react";

export default function SkeletonBasic() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading profile" className="flex w-full max-w-xs items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}
