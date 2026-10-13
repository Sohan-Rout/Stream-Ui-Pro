import { Bell, Mail, Plus, Trash } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DemoCell } from "@/components/demos/DemoCell";
import { ProgressDemo } from "@/components/demos/ProgressDemo";
import { TabsDemo } from "@/components/demos/TabsDemo";
import { TogglesDemo } from "@/components/demos/TogglesDemo";

const avatars = [
  { initials: "AK", tone: "bg-yellow" },
  { initials: "RM", tone: "bg-pink" },
  { initials: "JS", tone: "bg-blue" },
  { initials: "TW", tone: "bg-green" },
];

export function ComponentShowcase() {
  return (
    <Section id="components" aria-labelledby="components-title">
      <SectionHeading
        index="01"
        eyebrow="Components"
        title={<span id="components-title">Primitives with opinions.</span>}
        description="Every specimen below is live. Click it, tab to it, break it. Hover lifts, press sinks, focus always shows."
      />
      <div className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
        <DemoCell file="button.tsx" note="4 variants">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button>
              <Plus aria-hidden /> Create
            </Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="pink">
              <Trash aria-hidden /> Delete
            </Button>
            <Button variant="blue" size="icon" aria-label="Notifications">
              <Bell aria-hidden />
            </Button>
          </div>
        </DemoCell>

        <DemoCell file="input.tsx" note="with icon">
          <div className="w-full max-w-xs">
            <label htmlFor="demo-email" className="mb-2 block font-bold">
              Email
            </label>
            <div className="flex items-center border-2 border-ink bg-paper-raised shadow-brutal-sm transition-shadow duration-150 focus-within:shadow-brutal">
              <Mail aria-hidden className="ml-3 size-4.5 shrink-0 text-ink-muted" />
              <input
                id="demo-email"
                type="email"
                placeholder="you@loud.dev"
                aria-describedby="demo-email-hint"
                className="h-11 w-full min-w-0 bg-transparent px-3 placeholder:text-ink-muted focus:outline-none"
              />
            </div>
            <p id="demo-email-hint" className="mt-2 text-sm text-ink-muted">
              We&apos;ll only email you about releases.
            </p>
          </div>
        </DemoCell>

        <DemoCell file="switch.tsx" note="+ checkbox">
          <TogglesDemo />
        </DemoCell>

        <DemoCell file="tabs.tsx" note="arrow keys work">
          <TabsDemo />
        </DemoCell>

        <DemoCell file="progress.tsx" note="interactive">
          <ProgressDemo />
        </DemoCell>

        <DemoCell file="badge.tsx" note="+ avatar stack">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="green">stable</Badge>
              <Badge tone="blue">beta</Badge>
              <Badge tone="orange">labs</Badge>
              <Badge tone="paper">deprecated</Badge>
            </div>
            <div className="flex items-center">
              {avatars.map((a) => (
                <span
                  key={a.initials}
                  className={`-ml-3 grid size-12 place-items-center rounded-full border-2 border-ink font-mono text-sm font-bold text-on-bright first:ml-0 ${a.tone}`}
                >
                  {a.initials}
                </span>
              ))}
              <span className="-ml-3 grid size-12 place-items-center rounded-full border-2 border-ink bg-paper-raised font-mono text-sm font-bold">
                +9
              </span>
            </div>
          </div>
        </DemoCell>
      </div>
    </Section>
  );
}
