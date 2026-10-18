import type { LucideIcon } from "lucide-react";
import { Bell, Gauge, GitBranch, Globe, Lock, Zap } from "lucide-react";

type Feature = { icon: LucideIcon; title: string; body: string; tile: string; span: string };

/**
 * The lead feature gets the big tile (full width in two columns, a 2×2 block
 * in four); the last spans the width in two columns so rows pair up evenly.
 */
const features: Feature[] = [
  { icon: Zap, title: "Instant previews", body: "Every pull request gets a live URL in under a minute, so review happens on the real thing.", tile: "bg-lime text-on-bright", span: "@xl:col-span-2 @3xl:row-span-2" },
  { icon: GitBranch, title: "Branch timelines", body: "See what changed on each branch, commit by commit.", tile: "bg-pink-soft", span: "@3xl:col-span-2" },
  { icon: Bell, title: "Smart alerts", body: "Pinged when a metric moves, not every time it twitches.", tile: "bg-blue-soft", span: "" },
  { icon: Gauge, title: "Budgets", body: "Fail the build when a page gets slower than you allow.", tile: "bg-violet-soft", span: "" },
  { icon: Lock, title: "SSO and audit logs", body: "SAML, SCIM, and a full trail of who did what.", tile: "bg-orange-soft", span: "@3xl:col-span-2" },
  { icon: Globe, title: "Edge regions", body: "Run in 30 regions and pick where your data lives.", tile: "bg-paper-raised", span: "@xl:col-span-2" },
];

/** Bento feature grid: one big lead tile and five smaller ones in soft tints. */
export function BentoFeaturesSection() {
  return (
    <section className="@container bg-paper text-ink">
      <header className="p-8 @3xl:p-12">
        <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">Features</p>
        <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight tracking-tight text-balance @3xl:text-4xl">
          Everything between merge and production.
        </h2>
      </header>
      <ul className="grid grid-cols-1 gap-4 px-8 pb-8 @xl:grid-cols-2 @3xl:auto-rows-fr @3xl:grid-cols-4 @3xl:px-12 @3xl:pb-12">
        {features.map((f, i) => {
          const lead = i === 0;
          return (
            <li
              key={f.title}
              className={`flex flex-col gap-3 border-2 border-ink p-6 shadow-brutal ${f.tile} ${f.span} ${lead ? "justify-between bg-dots @3xl:p-8" : ""}`}
            >
              <span
                className={`grid place-items-center border-2 border-ink bg-paper-raised text-ink shadow-brutal-sm ${lead ? "size-16" : "size-10"}`}
              >
                <f.icon aria-hidden className={lead ? "size-8" : "size-5"} />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className={`font-display tracking-tight ${lead ? "text-3xl @3xl:text-4xl" : "text-lg"}`}>{f.title}</h3>
                <p className={`leading-relaxed ${lead ? "max-w-sm text-lg" : "text-ink-muted"}`}>{f.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
