import { Bell, Mail, Plus, Trash } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge, Button, Input, Avatar, AvatarGroup } from "@streamuilib/react";
import { DemoCell } from "@/components/demos/DemoCell";
import { ProgressDemo } from "@/components/demos/ProgressDemo";
import { TabsDemo } from "@/components/demos/TabsDemo";
import { TogglesDemo } from "@/components/demos/TogglesDemo";

const avatars = [
  { initials: "AK", tone: "lime" },
  { initials: "RM", tone: "pink" },
  { initials: "JS", tone: "blue" },
  { initials: "TW", tone: "violet" },
] as const;

export function ComponentShowcase() {
  return (
    <Section id="components" aria-labelledby="components-title">
      <SectionHeading
        index="01"
        eyebrow="Components"
        title={<span id="components-title">Accessible primitives, every state styled.</span>}
        description="Each specimen is the real component. Try it with a mouse or the keyboard: hover, press, focus, and disabled all have defined states."
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
            <Input
              id="demo-email"
              type="email"
              icon={<Mail />}
              placeholder="name@company.com"
              aria-describedby="demo-email-hint"
            />
            <p id="demo-email-hint" className="mt-2 text-sm text-ink-muted">
              Used for release notes only.
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
              <Badge tone="lime">stable</Badge>
              <Badge tone="blue">beta</Badge>
              <Badge tone="orange">labs</Badge>
              <Badge tone="paper">deprecated</Badge>
            </div>
            <AvatarGroup>
              {avatars.map((a) => (
                <Avatar key={a.initials} initials={a.initials} tone={a.tone} />
              ))}
              <Avatar initials="+9" tone="paper" />
            </AvatarGroup>
          </div>
        </DemoCell>
      </div>
    </Section>
  );
}
