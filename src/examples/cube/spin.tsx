import { Cube } from "@streamuilib/react";

export default function CubeSpin() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <Cube spin="loop" tone="pink" label="Spinning cube" />
      {/* spin="hover" turns while the pointer is over it, or while its parent has focus. */}
      <button type="button" className="rounded-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue">
        <Cube spin="hover" variant="beveled" tone="orange" label="Hover to spin" />
      </button>
    </div>
  );
}
