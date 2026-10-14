import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionThumb, ThumbFrame, type SectionSlug } from "./SectionThumbs";

const items: { slug: SectionSlug; name: string; count: number; tone: string }[] = [
  { slug: "hero", name: "Hero", count: 6, tone: "bg-lime" },
  { slug: "pricing", name: "Pricing", count: 4, tone: "bg-blue" },
  { slug: "features", name: "Features", count: 5, tone: "bg-pink" },
  { slug: "testimonials", name: "Testimonials", count: 3, tone: "bg-violet" },
  { slug: "faq", name: "FAQ", count: 2, tone: "bg-orange" },
  { slug: "footer", name: "Footer", count: 4, tone: "bg-lime" },
];

export function SectionsShowcase() {
  return (
    <Section id="sections" aria-labelledby="sections-title">
      <SectionHeading
        index="02"
        eyebrow="Sections"
        title={<span id="sections-title">Page sections built from the same parts.</span>}
        description="Composed from the same primitives, so a hero and a pricing table never disagree about what a button looks like."
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} className="bg-blue-soft p-5 sm:p-6">
            <ThumbFrame>
              <SectionThumb slug={item.slug} />
            </ThumbFrame>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-lg font-display tracking-tight">{item.name}</h3>
              <span className={`border-2 border-ink px-2 font-mono text-xs font-bold text-on-bright ${item.tone}`}>
                ×{item.count}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
