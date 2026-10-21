import { ComicProgress } from "@streamuilib/react";

export default function ComicProgressTones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-7 pt-3">
      <ComicProgress value={30} aria-label="Upload" />
      <ComicProgress value={64} tone="lime" aria-label="Level" />
      <ComicProgress value={85} tone="blue" aria-label="Storage" />
      <ComicProgress value={100} tone="orange" aria-label="Quest" />
    </div>
  );
}
