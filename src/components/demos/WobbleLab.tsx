import { cn } from "@/lib/cn";

const letters = [
  { ch: "W", tone: "bg-yellow", tilt: "-rotate-6" },
  { ch: "O", tone: "bg-pink", tilt: "rotate-3" },
  { ch: "B", tone: "bg-blue", tilt: "-rotate-2" },
  { ch: "B", tone: "bg-green", tilt: "rotate-6" },
  { ch: "L", tone: "bg-orange", tilt: "-rotate-3" },
  { ch: "E", tone: "bg-violet", tilt: "rotate-2" },
];

/** Pure CSS: hover the word and a staggered wave runs through the letters. */
export function WobbleLab() {
  return (
    <div className="group grid h-56 w-full cursor-default place-items-center">
      <p aria-label="Wobble" className="flex">
        {letters.map((l, i) => (
          <span
            key={i}
            aria-hidden
            style={{ transitionDelay: `${i * 45}ms` }}
            className={cn(
              "-ml-1 grid size-12 place-items-center border-2 border-ink text-2xl font-black text-on-bright shadow-brutal-sm first:ml-0 sm:size-14 sm:text-3xl",
              "transition-[translate,rotate] duration-200 ease-out group-hover:-translate-y-4 group-hover:rotate-0 motion-reduce:transition-none",
              l.tone,
              l.tilt,
            )}
          >
            {l.ch}
          </span>
        ))}
      </p>
    </div>
  );
}
