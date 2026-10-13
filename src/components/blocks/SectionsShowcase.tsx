import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Tiny browser frame holding a schematic of a page section. */
function Wireframe({
  name,
  count,
  tone,
  children,
}: {
  name: string;
  count: number;
  tone: string;
  children: ReactNode;
}) {
  return (
    <li className="bg-paper p-5 sm:p-6">
      <div className="border-2 border-ink bg-paper-raised shadow-brutal">
        <div className="flex items-center gap-1.5 border-b-2 border-ink px-3 py-2">
          <span className="size-2.5 rounded-full border-2 border-ink bg-pink" />
          <span className="size-2.5 rounded-full border-2 border-ink bg-yellow" />
          <span className="size-2.5 rounded-full border-2 border-ink bg-green" />
        </div>
        <div aria-hidden className="flex h-40 flex-col gap-2 p-4">
          {children}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-lg font-display tracking-tight">{name}</h3>
        <span className={`border-2 border-ink px-2 font-mono text-xs font-bold text-on-bright ${tone}`}>
          ×{count}
        </span>
      </div>
    </li>
  );
}

const bar = "h-2.5 bg-ink";
const ghost = "h-2.5 bg-ink-faint";

export function SectionsShowcase() {
  return (
    <Section id="sections" aria-labelledby="sections-title">
      <SectionHeading
        index="02"
        eyebrow="Sections"
        title={<span id="sections-title">Whole pages, pre-assembled.</span>}
        description="Composed from the same primitives, so a hero and a pricing table never disagree about what a button looks like."
      />
      <ul className="grid grid-cols-1 gap-0.5 bg-ink sm:grid-cols-2 lg:grid-cols-3">
        <Wireframe name="Hero" count={6} tone="bg-yellow">
          <div className={`${bar} w-3/4`} />
          <div className={`${bar} w-1/2`} />
          <div className={`${ghost} mt-1 w-2/3`} />
          <div className="mt-auto flex gap-2">
            <div className="h-6 w-16 border-2 border-ink bg-yellow" />
            <div className="h-6 w-12 border-2 border-ink" />
          </div>
        </Wireframe>

        <Wireframe name="Pricing" count={4} tone="bg-blue">
          <div className="grid h-full grid-cols-3 gap-2">
            {["", "bg-blue", ""].map((t, i) => (
              <div key={i} className={`flex flex-col gap-1.5 border-2 border-ink p-1.5 ${t}`}>
                <div className="h-2 w-1/2 bg-ink" />
                <div className="h-4 w-3/4 bg-ink" />
                <div className={`${ghost} mt-1`} />
                <div className={ghost} />
                <div className="mt-auto h-3 border-2 border-ink bg-paper" />
              </div>
            ))}
          </div>
        </Wireframe>

        <Wireframe name="Features" count={5} tone="bg-pink">
          <div className="grid h-full grid-cols-2 gap-2">
            {["bg-pink", "bg-yellow", "bg-green", "bg-blue"].map((t) => (
              <div key={t} className="flex items-start gap-1.5">
                <div className={`size-5 shrink-0 border-2 border-ink ${t}`} />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="h-2 w-3/4 bg-ink" />
                  <div className={ghost} />
                </div>
              </div>
            ))}
          </div>
        </Wireframe>

        <Wireframe name="Testimonials" count={3} tone="bg-green">
          <div className="flex h-full gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-1 flex-col gap-1.5 border-2 border-ink p-2">
                <div className="font-mono text-lg leading-none font-bold">&ldquo;</div>
                <div className={ghost} />
                <div className={`${ghost} w-4/5`} />
                <div className="mt-auto flex items-center gap-1.5">
                  <div className="size-4 rounded-full border-2 border-ink bg-green" />
                  <div className="h-2 w-1/2 bg-ink" />
                </div>
              </div>
            ))}
          </div>
        </Wireframe>

        <Wireframe name="FAQ" count={2} tone="bg-orange">
          {[true, false, false, false].map((open, i) => (
            <div key={i} className={`border-2 border-ink px-2 py-1.5 ${open ? "bg-orange" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="h-2 w-2/3 bg-ink" />
                <div className="font-mono text-xs leading-none font-bold">{open ? "−" : "+"}</div>
              </div>
              {open && <div className={`${ghost} mt-1.5 w-4/5`} />}
            </div>
          ))}
        </Wireframe>

        <Wireframe name="Footer" count={4} tone="bg-violet">
          <div className="mt-auto grid grid-cols-4 gap-3 border-t-2 border-ink pt-3">
            <div className="flex flex-col gap-1.5">
              <div className="size-5 border-2 border-ink bg-violet" />
              <div className={ghost} />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-2 w-3/4 bg-ink" />
                <div className={ghost} />
                <div className={ghost} />
                <div className={`${ghost} w-1/2`} />
              </div>
            ))}
          </div>
        </Wireframe>
      </ul>
    </Section>
  );
}
