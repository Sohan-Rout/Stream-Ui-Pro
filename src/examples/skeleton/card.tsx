import { Card, CardContent, CardFooter, CardHeader, Skeleton } from "@streamuilib/react";

export default function SkeletonCard() {
  return (
    <Card role="status" aria-busy="true" aria-label="Loading plan" className="w-full max-w-sm">
      <CardHeader>
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-11 w-full" />
      </CardFooter>
    </Card>
  );
}
