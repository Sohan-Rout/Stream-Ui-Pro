import type { LucideIcon } from "lucide-react";
import { Bell, Gauge, GitBranch, Globe, Lock, Play, Star, Zap } from "lucide-react";

const features: { icon: LucideIcon; title: string; body: string; tone: string; stars: number }[] = [
  { icon: Zap, title: "Instant previews", body: "Every pull request gets a live URL in under a minute.", tone: "bg-lime", stars: 3 },
  { icon: GitBranch, title: "Branch timelines", body: "See what changed on each branch, commit by commit.", tone: "bg-pink", stars: 3 },
  { icon: Bell, title: "Smart alerts", body: "Get pinged when a metric moves, not every time it twitches.", tone: "bg-blue", stars: 2 },
  { icon: Gauge, title: "Performance budgets", body: "Fail the build when a page gets slower than you allow.", tone: "bg-violet", stars: 2 },
  { icon: Lock, title: "SSO and audit logs", body: "SAML, SCIM, and a full trail of who did what.", tone: "bg-orange", stars: 1 },
  { icon: Globe, title: "Edge regions", body: "Run in 30 regions and pick where your data lives.", tone: "bg-lime", stars: 1 },
];

/**
 * Level-select feature grid: each feature is an arcade level tile, numbered
 * 1-1 to 1-6, with a pixel bevel and a star rating. The first one is marked
 * as where to start.
 */
export function LevelsFeaturesSection() {
  return (
    <section className="@container bg-blue-soft text-ink">
      <header className="flex flex-col items-center gap-4 p-8 text-center @3xl:p-12">
        <p className="border-2 border-ink bg-paper-raised px-3 py-1 font-mono text-xs font-bold tracking-widest uppercase shadow-brutal-sm">
          World 1 · Select a level
        </p>
        <h2 className="max-w-xl font-display text-3xl leading-tight tracking-tight text-balance uppercase @3xl:text-5xl">
          Six levels to production.
        </h2>
      </header>
      <ul className="grid grid-cols-1 gap-5 px-8 pb-10 @xl:grid-cols-2 @4xl:grid-cols-3 @3xl:px-12 @3xl:pb-14">
        {features.map((f, i) => (
          <li
            key={f.title}
            className="group relative flex flex-col gap-4 border-4 border-ink bg-paper-raised p-5 shadow-brutal transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg motion-reduce:transition-none"
          >
            {i === 0 && (
              <span className="absolute -top-3.5 right-4 inline-flex items-center gap-1 border-2 border-ink bg-pink px-2 py-0.5 font-mono text-xs font-bold text-on-bright uppercase">
                <Play aria-hidden className="size-3 fill-current" /> Start
              </span>
            )}
            <div className="flex items-center justify-between">
              <span className={`grid size-14 place-items-center border-2 border-ink font-mono text-lg font-bold text-on-bright pixel-bevel ${f.tone}`}>
                1-{i + 1}
              </span>
              <span className="flex gap-0.5" aria-label={`${f.stars} of 3 stars`}>
                {[0, 1, 2].map((s) => (
                  <Star key={s} aria-hidden className={`size-5 ${s < f.stars ? "fill-orange text-ink" : "text-ink-faint"}`} />
                ))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <f.icon aria-hidden className="size-5 shrink-0" />
              <h3 className="font-display text-lg tracking-tight">{f.title}</h3>
            </div>
            <p className="leading-relaxed text-ink-muted">{f.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
