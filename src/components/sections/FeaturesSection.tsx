import type { LucideIcon } from "lucide-react";
import { Bell, Gauge, GitBranch, Globe, Lock, Zap } from "lucide-react";

const features: { icon: LucideIcon; title: string; body: string; tone: string }[] = [
  { icon: Zap, title: "Instant previews", body: "Every pull request gets a live URL in under a minute.", tone: "bg-lime" },
  { icon: GitBranch, title: "Branch timelines", body: "See what changed on each branch, commit by commit.", tone: "bg-pink" },
  { icon: Bell, title: "Smart alerts", body: "Get pinged when a metric moves, not every time it twitches.", tone: "bg-blue" },
  { icon: Gauge, title: "Performance budgets", body: "Fail the build when a page gets slower than you allow.", tone: "bg-violet" },
  { icon: Lock, title: "SSO and audit logs", body: "SAML, SCIM, and a full trail of who did what.", tone: "bg-orange" },
  { icon: Globe, title: "Edge regions", body: "Run in 30 regions and pick where your data lives.", tone: "bg-lime" },
];

/** Feature grid separated by hard rules. */
export function FeaturesSection() {
  return (
    <section className="@container bg-paper text-ink">
      <header className="border-b-2 border-ink p-8 @3xl:p-12">
        <p className="font-mono text-xs font-bold tracking-widest text-ink-muted uppercase">Features</p>
        <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight tracking-tight text-balance @3xl:text-4xl">
          Everything between merge and production.
        </h2>
      </header>
      <ul className="grid grid-cols-1 gap-0.5 bg-ink @xl:grid-cols-2 @4xl:grid-cols-3">
        {features.map((f) => (
          <li key={f.title} className="flex flex-col gap-4 bg-paper p-8">
            <span
              className={`grid size-11 place-items-center border-2 border-ink text-on-bright shadow-brutal-sm ${f.tone}`}
            >
              <f.icon aria-hidden className="size-5" />
            </span>
            <h3 className="font-display text-lg tracking-tight">{f.title}</h3>
            <p className="leading-relaxed text-ink-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
