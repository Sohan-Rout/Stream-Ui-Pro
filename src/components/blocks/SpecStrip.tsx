import { Check } from "lucide-react";
import { Section } from "@/components/ui/Section";

const items = ["Tailwind v4 ready", "React 19 ready", "shadcn CLI ready", "Accessible by default"];

export function SpecStrip() {
  return (
    <Section aria-label="Compatibility">
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 bg-paper px-5 py-5 sm:px-8">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center border-2 border-ink bg-lime text-on-bright"
            >
              <Check className="size-3.5" strokeWidth={3.5} />
            </span>
            <span className="font-bold">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
