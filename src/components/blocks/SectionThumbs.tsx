import type { ReactNode } from "react";

export type SectionSlug = "hero" | "pricing" | "features" | "testimonials" | "faq" | "footer";

const bar = "h-2.5 bg-ink";
const ghost = "h-2.5 bg-ink-faint";

/** Tiny browser window that frames a section schematic. */
export function ThumbFrame({ children }: { children: ReactNode }) {
  return (
    <div className="border-2 border-ink bg-paper-raised shadow-brutal">
      <div className="flex items-center gap-1.5 border-b-2 border-ink px-3 py-2">
        <span className="size-2.5 rounded-full border-2 border-ink bg-pink" />
        <span className="size-2.5 rounded-full border-2 border-ink bg-orange" />
        <span className="size-2.5 rounded-full border-2 border-ink bg-lime" />
      </div>
      <div aria-hidden className="flex h-40 flex-col gap-2 p-4">
        {children}
      </div>
    </div>
  );
}

/** Schematic of a page section, drawn with bars and boxes. */
export function SectionThumb({ slug }: { slug: SectionSlug }) {
  switch (slug) {
    case "hero":
      return (
        <>
          <div className={`${bar} w-3/4`} />
          <div className={`${bar} w-1/2`} />
          <div className={`${ghost} mt-1 w-2/3`} />
          <div className="mt-auto flex gap-2">
            <div className="h-6 w-16 border-2 border-ink bg-lime" />
            <div className="h-6 w-12 border-2 border-ink" />
          </div>
        </>
      );
    case "pricing":
      return (
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
      );
    case "features":
      return (
        <div className="grid h-full grid-cols-2 gap-2">
          {["bg-pink", "bg-lime", "bg-violet", "bg-blue"].map((t) => (
            <div key={t} className="flex items-start gap-1.5">
              <div className={`size-5 shrink-0 border-2 border-ink ${t}`} />
              <div className="flex flex-1 flex-col gap-1">
                <div className="h-2 w-3/4 bg-ink" />
                <div className={ghost} />
              </div>
            </div>
          ))}
        </div>
      );
    case "testimonials":
      return (
        <div className="flex h-full gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-1 flex-col gap-1.5 border-2 border-ink p-2">
              <div className="font-mono text-lg leading-none font-bold">&ldquo;</div>
              <div className={ghost} />
              <div className={`${ghost} w-4/5`} />
              <div className="mt-auto flex items-center gap-1.5">
                <div className="size-4 rounded-full border-2 border-ink bg-violet" />
                <div className="h-2 w-1/2 bg-ink" />
              </div>
            </div>
          ))}
        </div>
      );
    case "faq":
      return (
        <>
          {[true, false, false, false].map((open, i) => (
            <div key={i} className={`border-2 border-ink px-2 py-1.5 ${open ? "bg-orange" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="h-2 w-2/3 bg-ink" />
                <div className="font-mono text-xs leading-none font-bold">{open ? "−" : "+"}</div>
              </div>
              {open && <div className={`${ghost} mt-1.5 w-4/5`} />}
            </div>
          ))}
        </>
      );
    case "footer":
      return (
        <div className="mt-auto grid grid-cols-4 gap-3 border-t-2 border-ink pt-3">
          <div className="flex flex-col gap-1.5">
            <div className="size-5 border-2 border-ink bg-lime" />
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
      );
  }
}
