import { Fragment } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check, Clock, ShoppingBag } from "lucide-react";
import { buttonStyles, cn } from "@streamuilib/react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";
import { templates, type Template } from "@/lib/templates";

/** A screenshot in the same browser chrome the section previews use. */
export function Shot({ shot, url, priority, className }: { shot: Template["shots"][number]; url?: string; priority?: boolean; className?: string }) {
  return (
    <figure className={cn("flex flex-col border-2 border-ink bg-paper shadow-brutal", className)}>
      <div aria-hidden className="flex items-center gap-1.5 border-b-2 border-ink bg-paper-raised px-3 py-1.5">
        <span className="size-2 rounded-full border-2 border-ink bg-pink" />
        <span className="size-2 rounded-full border-2 border-ink bg-orange" />
        <span className="size-2 rounded-full border-2 border-ink bg-lime" />
        {url && <span className="ml-2 truncate font-mono text-xs text-ink-muted">{url}</span>}
      </div>
      <Image src={shot.src} alt={shot.alt} placeholder="blur" priority={priority} sizes="(min-width: 1152px) 640px, (min-width: 1024px) 55vw, 100vw" className="block h-auto w-full" />
    </figure>
  );
}

/** A hatched band between two template cards, so neighbors don't run together. */
export function TemplateDivider() {
  return (
    <div
      aria-hidden
      className="h-10 border-y-2 border-ink bg-paper sm:h-14"
      style={{ backgroundImage: "repeating-linear-gradient(-45deg, color-mix(in oklab, var(--color-ink) 22%, transparent) 0 1.5px, transparent 1.5px 11px)" }}
    />
  );
}

export function TemplateCard({ t, headingAs: H = "h3" }: { t: Template; headingAs?: "h2" | "h3" }) {
  const [cover, ...more] = t.shots;
  return (
    <article aria-labelledby={`template-${t.slug}`} className="grid grid-cols-1 gap-0.5 bg-ink lg:grid-cols-12">
      <div className="flex flex-col gap-5 bg-orange-soft bg-dots p-5 sm:p-8 lg:col-span-7">
        {/* The cover opens the template's page, like its name and the Details button. */}
        <Link
          href={`/templates/${t.slug}`}
          className="group block transition-[translate] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
        >
          <Shot shot={cover} url={`${new URL(siteConfig.url).host}/templates/${t.slug}`} className="group-hover:shadow-brutal-lg" />
        </Link>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {more.map((s) => (
            <Shot key={s.alt} shot={s} className="shadow-brutal-sm" />
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-paper lg:col-span-5">
        <div className="flex items-center justify-between gap-3 border-b-2 border-ink px-5 py-3 sm:px-8">
          <span className="font-mono text-xs font-bold">template/{t.slug}</span>
          {t.slug === templates[0].slug && <span className="border-2 border-ink bg-lime px-1.5 font-mono text-xs font-bold text-on-bright">New</span>}
        </div>

        <div className="flex flex-1 flex-col gap-6 p-5 sm:p-8">
          <div>
            <H id={`template-${t.slug}`} className="font-display text-3xl tracking-tight">
              <Link href={`/templates/${t.slug}`} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                {t.name}
              </Link>
            </H>
            <p className="mt-3 text-base leading-relaxed text-pretty text-ink-muted">{t.tagline}</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {t.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span className="mt-px grid size-5 shrink-0 place-items-center border-2 border-ink bg-lime text-on-bright">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <ul aria-label="Built with" className="flex flex-wrap gap-2">
            {t.stack.map((s) => (
              <li key={s} className="border-2 border-ink bg-paper-raised px-2 py-0.5 font-mono text-xs">
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4 border-t-2 border-ink pt-6">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl tracking-tight">${t.price}</span>
              <span className="text-sm text-ink-muted">one-time · unlimited projects</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {t.checkoutUrl ? (
                <a href={t.checkoutUrl} className={buttonStyles()}>
                  <ShoppingBag aria-hidden /> Buy · ${t.price}
                </a>
              ) : (
                <span aria-disabled className={cn(buttonStyles(), "pointer-events-none opacity-60")}>
                  <Clock aria-hidden /> Coming soon
                </span>
              )}
              <Link href={`/templates/${t.slug}`} className={buttonStyles({ variant: "pink" })}>
                View details <ArrowRight aria-hidden />
              </Link>
              {/* Opens the preview on this site, in a new tab, so the visitor keeps their place here. */}
              <a href={`/templates/${t.slug}/preview`} target="_blank" className={buttonStyles({ variant: "secondary" })}>
                Live preview <ArrowUpRight aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * The paid templates: complete sites built from the library. Each shows its
 * screens, what's inside, the price, and links to the live demo and checkout.
 */
export function ProTemplates() {
  return (
    <Section id="templates" aria-labelledby="templates-title">
      <SectionHeading
        index="03"
        eyebrow="Pro templates"
        title={<span id="templates-title">Whole sites, built and ready to ship.</span>}
        description="Complete Next.js sites made with these components. Buy once, get the full source, and make it yours for unlimited personal and client projects."
        action={
          <Link href="/templates" className={buttonStyles({ variant: "secondary" })}>
            All templates <ArrowUpRight aria-hidden />
          </Link>
        }
      />
      {templates.map((t, i) => (
        <Fragment key={t.slug}>
          {i > 0 && <TemplateDivider />}
          <TemplateCard t={t} />
        </Fragment>
      ))}
      <p className="border-t-2 border-ink px-5 py-4 font-mono text-xs text-ink-muted sm:px-8">More templates on the way. The library itself stays free and open source.</p>
    </Section>
  );
}
