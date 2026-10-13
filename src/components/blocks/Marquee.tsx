import { Asterisk } from "lucide-react";

const words = [
  "Components",
  "Sections",
  "Icons",
  "Labs",
  "TypeScript",
  "Tailwind v4",
  "Dark mode",
  "Copy · paste · ship",
  "Accessible",
  "Zero beige",
];

function Strip({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {words.map((w) => (
        <li
          key={w}
          className="flex items-center gap-6 px-3 text-2xl font-black tracking-tight whitespace-nowrap uppercase sm:text-3xl"
        >
          {w}
          <Asterisk aria-hidden className="size-7 text-yellow" strokeWidth={3} />
        </li>
      ))}
    </ul>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden border-b-2 border-ink bg-ink py-4 text-paper">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        <Strip />
        <Strip hidden />
      </div>
    </div>
  );
}
