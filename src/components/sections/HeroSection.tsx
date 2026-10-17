import { ArrowRight } from "lucide-react";
import { Badge, Button } from "@streamuilib/react";

const bars = [
  { label: "Mon", height: "h-2/5", tone: "bg-blue" },
  { label: "Tue", height: "h-11/20", tone: "bg-blue" },
  { label: "Wed", height: "h-9/20", tone: "bg-blue" },
  { label: "Thu", height: "h-7/10", tone: "bg-blue" },
  { label: "Fri", height: "h-9/10", tone: "bg-pink" },
  { label: "Sat", height: "h-3/5", tone: "bg-blue" },
];

/** Split hero: pitch on the left, a product glimpse on the right. */
export function HeroSection({ headingAs: Heading = "h1" }: { headingAs?: "h1" | "h2" | "h3" }) {
  return (
    <section className="@container bg-paper">
      <div className="grid grid-cols-1 @3xl:grid-cols-2">
        <div className="flex flex-col justify-center gap-6 p-8 @3xl:border-r-2 @3xl:border-ink @3xl:p-12">
          <Badge tone="paper" className="self-start">
            <span aria-hidden className="size-2 rounded-full bg-lime ring-2 ring-ink" />
            Version 2.0 is out
          </Badge>
          <Heading className="font-display text-4xl leading-none tracking-tight text-balance @3xl:text-5xl">
            Know what shipped, before anyone asks.
          </Heading>
          <p className="max-w-md text-lg leading-relaxed text-ink-muted">
            Acme turns your deploys, incidents, and metrics into one live
            timeline your whole team can read.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">
              Start free trial <ArrowRight aria-hidden />
            </Button>
            <Button size="lg" variant="secondary">
              Book a demo
            </Button>
          </div>
          <p className="font-mono text-xs text-ink-muted">No credit card · Cancel anytime</p>
        </div>

        <div className="flex items-center justify-center border-t-2 border-ink bg-lime-soft bg-dots p-8 @3xl:border-t-0 @3xl:p-12">
          <figure className="w-full max-w-sm border-2 border-ink bg-paper-raised p-5 shadow-brutal-lg">
            <figcaption className="flex items-baseline justify-between">
              <span className="font-bold">Deploys this week</span>
              <span className="font-mono text-xs text-ink-muted">+18%</span>
            </figcaption>
            <div aria-hidden className="mt-5 flex h-40 items-end gap-3 border-b-2 border-ink">
              {bars.map((b) => (
                <div key={b.label} className="flex h-full flex-1 flex-col justify-end">
                  <div className={`border-2 border-b-0 border-ink ${b.height} ${b.tone}`} />
                </div>
              ))}
            </div>
            <div aria-hidden className="mt-2 flex gap-3 font-mono text-xs text-ink-muted">
              {bars.map((b) => (
                <span key={b.label} className="flex-1 text-center">
                  {b.label}
                </span>
              ))}
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
