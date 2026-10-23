import { Cube } from "@streamuilib/react";

export default function CubeVariants() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <figure className="flex flex-col items-center gap-2">
        <Cube variant="solid" label="Solid cube" />
        <figcaption className="font-mono text-xs uppercase">solid</figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <Cube variant="lined" tone="pink" label="Lined cube" />
        <figcaption className="font-mono text-xs uppercase">lined</figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <Cube variant="beveled" tone="blue" label="Beveled cube" />
        <figcaption className="font-mono text-xs uppercase">beveled</figcaption>
      </figure>
    </div>
  );
}
