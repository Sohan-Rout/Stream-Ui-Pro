import { Section } from "@/components/ui/Section";

const specs = [
  { label: "Framework", value: "React 19 · Next.js" },
  { label: "Styling", value: "Tailwind CSS v4" },
  { label: "Types", value: "TypeScript, strict" },
  { label: "Distribution", value: "Source in your repo" },
];

export function SpecStrip() {
  return (
    <Section aria-label="Stack">
      <dl className="grid grid-cols-2 gap-0.5 bg-ink md:grid-cols-4">
        {specs.map((s) => (
          <div key={s.label} className="flex flex-col gap-1 bg-paper px-5 py-5 sm:px-8">
            <dt className="font-mono text-xs text-ink-muted uppercase">{s.label}</dt>
            <dd className="font-bold">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
