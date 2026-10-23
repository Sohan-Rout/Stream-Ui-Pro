import { Cube } from "@streamuilib/react";

export default function CubeSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      <Cube size="sm" tone="orange" />
      <Cube size="md" tone="violet" variant="beveled" />
      <Cube size="lg" tone="lime" variant="lined" />
    </div>
  );
}
