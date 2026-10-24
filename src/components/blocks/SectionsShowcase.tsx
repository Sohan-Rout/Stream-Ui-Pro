import { ArrowUpRight } from "lucide-react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhenVisible } from "@/components/ui/WhenVisible";
import { LiveThumb } from "@/components/docs/LiveThumb";
import { Live } from "@/components/docs/Live";
import { getSectionVariant, sections } from "@/registry/sections";
import { buttonStyles } from "@streamuilib/react";

/** The newest designs, live. */
const picks = [
  { slug: "hero", id: "comic", tint: "bg-orange-soft" },
  { slug: "hero", id: "jungle", tint: "bg-lime-soft" },
  { slug: "footer", id: "bold", tint: "bg-pink-soft" },
];

const designs = sections.reduce((n, s) => n + s.variants.length, 0);

export function SectionsShowcase() {
  return (
    <Section id="sections" aria-labelledby="sections-title">
      <SectionHeading
        index="02"
        eyebrow="Sections"
        title={<span id="sections-title">Whole page sections, ready to drop in.</span>}
        description={`${designs} designs across ${sections.length} sections: heroes you can play, pricing you can bonk, footers with a punchline. All built from the same components.`}
        action={
          <Link href="/sections" className={buttonStyles({ variant: "secondary" })}>
            All sections <ArrowUpRight aria-hidden />
          </Link>
        }
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink md:grid-cols-3">
        {picks.map((p) => {
          const found = getSectionVariant(p.slug, p.id);
          if (!found) throw new Error(`home: no section ${p.slug}#${p.id}`);
          const { section, variant } = found;
          return (
            <li key={`${p.slug}-${p.id}`} className={`group relative flex flex-col p-5 sm:p-6 ${p.tint}`}>
              <div aria-hidden className="flex items-center gap-1.5 border-2 border-b-0 border-ink bg-paper-raised px-3 py-1.5">
                <span className="size-2 rounded-full border-2 border-ink bg-pink" />
                <span className="size-2 rounded-full border-2 border-ink bg-orange" />
                <span className="size-2 rounded-full border-2 border-ink bg-lime" />
                <span className="ml-2 truncate font-mono text-xs text-ink-muted">
                  {section.slug}/{variant.id}.tsx
                </span>
              </div>
              {/* The previews are whole sections: mount them only as they scroll near. */}
              <WhenVisible className="aspect-video bg-paper-sunken bg-dots">
                <LiveThumb>
                  <Live file={variant.file} headingAs="h3" />
                </LiveThumb>
              </WhenVisible>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg tracking-tight">
                  <Link href={`/sections/${section.slug}#${variant.id}`} className="after:absolute after:inset-0">
                    {variant.name}
                  </Link>
                </h3>
                <span className="font-mono text-xs font-bold text-ink-muted">{section.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
