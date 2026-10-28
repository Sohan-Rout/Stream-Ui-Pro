import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Clock, ShoppingBag } from "lucide-react";
import { buttonStyles, cn } from "@streamuilib/react";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getTemplate, templates, type Template } from "@/lib/templates";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { Shot } from "@/components/blocks/ProTemplates";

/** Every template page is prerendered at build time; nothing here waits on the request. */
export const instant = false;

export function generateStaticParams() {
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/templates/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return pageMetadata({ ...t.seo, path: `/templates/${t.slug}` });
}

/** Product and breadcrumb structured data, so search results can show the price. */
function structuredData(t: Template) {
  const url = absoluteUrl(`/templates/${t.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: t.name,
        description: t.seo.description,
        url,
        image: t.gallery.map((s) => absoluteUrl(s.src.src)),
        brand: { "@type": "Brand", name: siteConfig.name },
        category: "Website template",
        offers: {
          "@type": "Offer",
          price: t.price.toFixed(2),
          priceCurrency: "USD",
          url: t.checkoutUrl || url,
          availability: t.checkoutUrl ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Templates", item: absoluteUrl("/templates") },
          { "@type": "ListItem", position: 3, name: t.name, item: url },
        ],
      },
    ],
  };
}

function BuyButtons({ t }: { t: Template }) {
  return (
    <div className="flex flex-wrap gap-3">
      {t.checkoutUrl ? (
        <a href={t.checkoutUrl} className={buttonStyles({ size: "lg" })}>
          <ShoppingBag aria-hidden /> Buy for ${t.price}
        </a>
      ) : (
        <span aria-disabled className={cn(buttonStyles({ size: "lg" }), "pointer-events-none opacity-60")}>
          <Clock aria-hidden /> Coming soon
        </span>
      )}
      <a href={`/templates/${t.slug}/preview`} target="_blank" className={buttonStyles({ variant: "secondary", size: "lg" })}>
        Live preview <ArrowUpRight aria-hidden />
      </a>
    </div>
  );
}

export default async function TemplatePage({ params }: PageProps<"/templates/[slug]">) {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) notFound();

  return (
    <>
      <JsonLd data={structuredData(t)} />

      <Section aria-labelledby="template-title">
        <div className="grid grid-cols-1 gap-0.5 bg-ink lg:grid-cols-12">
          <div className="flex flex-col gap-6 bg-paper px-5 py-12 sm:px-10 sm:py-16 lg:col-span-5">
            <nav aria-label="Breadcrumb" className="font-mono text-xs text-ink-muted">
              <Link href="/templates" className="hover:text-ink hover:underline">
                Templates
              </Link>{" "}
              / <span className="text-ink">{t.name}</span>
            </nav>
            <h1 id="template-title" className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {t.name}
            </h1>
            <p className="text-lg leading-relaxed text-pretty text-ink-muted">{t.tagline}</p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl tracking-tight">${t.price}</span>
              <span className="text-sm text-ink-muted">one-time · unlimited projects</span>
            </p>
            <BuyButtons t={t} />
            <ul aria-label="Built with" className="flex flex-wrap gap-2">
              {t.stack.map((s) => (
                <li key={s} className="border-2 border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-soft bg-dots p-5 sm:p-8 lg:col-span-7">
            <Shot shot={t.gallery[0]} url={`${new URL(siteConfig.url).host}/templates/${t.slug}`} priority />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="inside-title">
        <SectionHeading index="01" eyebrow="What's inside" title={<span id="inside-title">Every section a launch page needs.</span>} />
        <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
          {t.sections.map((s) => (
            <li key={s.name} className="flex gap-4 bg-paper p-5 sm:p-6">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center border-2 border-ink bg-lime text-on-bright">
                <Check aria-hidden className="size-3.5" strokeWidth={3} />
              </span>
              <span>
                <h3 className="font-display text-lg tracking-tight">{s.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.text}</p>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="screens-title">
        <SectionHeading index="02" eyebrow="Screens" title={<span id="screens-title">A look at every section.</span>} />
        <ul className="grid grid-cols-1 gap-6 bg-paper-sunken bg-dots p-5 sm:p-8 md:grid-cols-2">
          {t.gallery.map((s) => (
            <li key={s.alt}>
              <Shot shot={s} />
              <p className="mt-3 text-sm text-ink-muted">{s.alt}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="faq-title">
        <SectionHeading index="03" eyebrow="Questions" title={<span id="faq-title">Before you buy.</span>} />
        <dl className="grid grid-cols-1 gap-0.5 bg-ink md:grid-cols-2">
          {t.faq.map((f) => (
            <div key={f.question} className="bg-paper p-5 sm:p-8">
              <dt className="font-display text-lg tracking-tight">{f.question}</dt>
              <dd className="mt-2 text-base leading-relaxed text-ink-muted">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section aria-labelledby="buy-title" railClassName="bg-lime text-on-bright">
        <div className="flex flex-col items-start gap-6 px-5 py-14 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <h2 id="buy-title" className="max-w-xl font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
            Ship your landing page this week.
          </h2>
          <BuyButtons t={t} />
        </div>
      </Section>
    </>
  );
}
