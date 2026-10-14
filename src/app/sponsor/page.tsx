import type { Metadata } from "next";
import { ArrowUpRight, Bug, Share2, Star } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { buttonStyles, cn } from "@streamui/react";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import { fundingPlatforms } from "@/lib/funding";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = pageMetadata({ ...indexSeo.sponsor, path: "/sponsor" });

const toneBg = { lime: "bg-lime", pink: "bg-pink", blue: "bg-blue" } as const;
const toneButton = { lime: "primary", pink: "pink", blue: "blue" } as const;

const otherWays = [
  {
    icon: Star,
    title: "Star the repo",
    body: "Stars help other developers find the project on GitHub.",
    href: siteConfig.githubUrl,
    label: "Star on GitHub",
  },
  {
    icon: Bug,
    title: "Report a bug",
    body: "Clear bug reports and component requests shape what gets built next.",
    href: `${siteConfig.githubUrl}/issues`,
    label: "Open an issue",
  },
  {
    icon: Share2,
    title: "Share it",
    body: "A post or a mention in your project's README goes a long way.",
    href: siteConfig.url,
    label: new URL(siteConfig.url).host,
  },
];

export default function SponsorPage() {
  return (
    <>
      <Section railClassName="px-5 py-14 sm:px-10 sm:py-20">
        <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
          Sponsor <span aria-hidden className="h-0.5 w-8 bg-ink" />
          <span className="text-ink-muted">Support the project</span>
        </p>
        <h1 className="mt-5 max-w-2xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          Keep stream/ui free and growing.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
          stream/ui is free and MIT licensed. Sponsorships pay for the time it takes to
          maintain it: new components, bug fixes, accessibility work, and docs.
        </p>
      </Section>

      <Section aria-labelledby="give-title">
        <h2 id="give-title" className="sr-only">
          Ways to give
        </h2>
        {fundingPlatforms.length > 0 ? (
          <ul
            className={cn(
              "grid grid-cols-1 gap-0.5 bg-ink",
              fundingPlatforms.length > 1 && "md:grid-cols-2",
              fundingPlatforms.length > 2 && "lg:grid-cols-3",
            )}
          >
            {fundingPlatforms.map((p) => (
              <li key={p.id} className="flex flex-col gap-5 bg-paper p-8 sm:p-10">
                <span aria-hidden className={cn("h-3 w-12 border-2 border-ink", toneBg[p.tone])} />
                <h3 className="font-display text-2xl tracking-tight">{p.name}</h3>
                <p className="flex-1 leading-relaxed text-ink-muted">{p.blurb}</p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles({ variant: toneButton[p.tone], className: "self-start" })}
                >
                  {p.cta} <ArrowUpRight aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-start gap-4 bg-paper-sunken px-5 py-12 sm:px-10">
            <p className="font-display text-2xl tracking-tight">Sponsorship links are on the way.</p>
            <p className="max-w-xl leading-relaxed text-ink-muted">
              GitHub Sponsors, Open Collective, and Ko-fi pages are being set up. Until
              then, a star on GitHub is the best way to help.
            </p>
            <a href={siteConfig.githubUrl} className={buttonStyles({ variant: "secondary" })}>
              <SiGithub aria-hidden /> Star on GitHub
            </a>
          </div>
        )}
      </Section>

      <Section aria-labelledby="other-title">
        <header className="border-b-2 border-ink px-5 py-10 sm:px-10">
          <h2 id="other-title" className="font-display text-3xl tracking-tight">
            Other ways to help
          </h2>
        </header>
        <ul className="grid grid-cols-1 gap-0.5 bg-ink md:grid-cols-3">
          {otherWays.map((w) => (
            <li key={w.title} className="flex flex-col gap-4 bg-paper p-8">
              <w.icon aria-hidden className="size-6" strokeWidth={1.75} />
              <h3 className="font-display text-lg tracking-tight">{w.title}</h3>
              <p className="flex-1 leading-relaxed text-ink-muted">{w.body}</p>
              <a
                href={w.href}
                className="inline-flex items-center gap-1 self-start text-sm font-bold underline decoration-2 underline-offset-4"
              >
                {w.label} <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
