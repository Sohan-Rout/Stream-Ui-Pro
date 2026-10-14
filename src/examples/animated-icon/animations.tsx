import { Bell, Heart, PenLine, Rocket, Settings, Smartphone, Sparkles } from "lucide-react";
import { AnimatedIcon, type IconAnimation } from "@streamui/react";

const demos: { animation: IconAnimation; icon: typeof Rocket }[] = [
  { animation: "draw", icon: PenLine },
  { animation: "spin", icon: Settings },
  { animation: "bounce", icon: Rocket },
  { animation: "wiggle", icon: Bell },
  { animation: "pulse", icon: Heart },
  { animation: "shake", icon: Smartphone },
  { animation: "pop", icon: Sparkles },
];

export default function AnimatedIconAnimations() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {demos.map(({ animation, icon: Icon }) => (
        // Hovering the tile animates the icon: the tile is its direct parent.
        <li
          key={animation}
          className="flex cursor-default flex-col items-center gap-2 border-2 border-ink bg-paper-raised px-6 py-4 shadow-brutal-sm hover:bg-lime-soft"
        >
          <AnimatedIcon animation={animation}>
            <Icon aria-hidden className="size-7" strokeWidth={1.75} />
          </AnimatedIcon>
          <span className="font-mono text-xs">{animation}</span>
        </li>
      ))}
    </ul>
  );
}
