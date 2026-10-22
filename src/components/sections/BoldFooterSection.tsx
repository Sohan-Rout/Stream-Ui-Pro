import { Button, Input } from "@streamuilib/react";

/** The brights, in order: the stripe, the column chips, and the wordmark letters cycle through them. */
const BRIGHTS = ["var(--lime)", "var(--pink)", "var(--blue)", "var(--violet)", "var(--orange)"];

const columns = [
  { title: "Product", links: ["Features", "Pricing", "Changelog", "Status"], color: "var(--lime)" },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"], color: "var(--pink)" },
  { title: "Legal", links: ["Privacy", "Terms", "Security"], color: "var(--blue)" },
];

const WORDMARK = "ACME";

/**
 * Bold footer: the library's brights on a dark ink background. A rainbow
 * stripe across the top, a loud headline with the newsletter signup, link
 * columns under bright chips with links that underline in their column's
 * color, a giant wordmark with every letter in its own bright, and a
 * copyright strip. No JavaScript and no motion.
 */
export function BoldFooterSection() {
  return (
    <footer className="@container relative isolate overflow-hidden bg-ink text-paper">
      {/* A faint dot grid on the dark, for texture. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundImage: "radial-gradient(color-mix(in oklab, var(--paper) 9%, transparent) 1.3px, transparent 1.8px)", backgroundSize: "22px 22px" }}
      />

      {/* The rainbow stripe. */}
      <div aria-hidden className="flex h-3">
        {BRIGHTS.map((c) => (
          <span key={c} className="flex-1" style={{ backgroundColor: c }} />
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pt-14 pb-10 @3xl:grid-cols-5 @3xl:gap-8 @3xl:px-8">
        {/* Headline and signup. */}
        <div className="flex flex-col gap-6 @3xl:col-span-2">
          <p className="font-display text-4xl leading-[1.05] tracking-tight @3xl:text-5xl">
            Let&apos;s make something{" "}
            <span className="whitespace-nowrap">
              <span className="inline-block -rotate-2 border-[3px] border-paper bg-lime px-2 text-on-bright shadow-[5px_5px_0_var(--pink)]">loud</span>.
            </span>
          </p>
          <form className="flex flex-col gap-3" action="#">
            <label htmlFor="bold-footer-email" className="font-semibold text-paper/80">
              Product updates, once a month. No noise.
            </label>
            {/* Side by side only when the column is wide enough for a whole address. */}
            <div className="flex flex-col gap-3 @sm:flex-row @3xl:flex-col @5xl:flex-row">
              <Input id="bold-footer-email" type="email" required placeholder="you@company.com" frameClassName="flex-1 border-paper shadow-[4px_4px_0_var(--violet)]" />
              <Button type="submit" className="shadow-[4px_4px_0_var(--pink)] hover:shadow-[6px_6px_0_var(--pink)]">
                Subscribe
              </Button>
            </div>
          </form>
        </div>

        {/* Link columns under bright chips. */}
        {columns.map((c) => (
          <nav key={c.title} aria-label={c.title} className="flex flex-col gap-4">
            <p
              className="w-fit border-2 border-paper px-2 py-0.5 font-mono text-xs font-bold tracking-widest text-on-bright uppercase"
              style={{ backgroundColor: c.color }}
            >
              {c.title}
            </p>
            <ul className="flex flex-col gap-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="font-semibold text-paper decoration-[3px] underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2"
                    style={{ textDecorationColor: c.color, outlineColor: c.color }}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* The giant wordmark: each letter its own bright, sized to the footer's width. */}
      <p aria-hidden className="flex justify-center px-4 font-display leading-[0.8] tracking-tighter select-none" style={{ fontSize: "clamp(4rem, 24cqw, 18rem)" }}>
        {[...WORDMARK].map((ch, i) => (
          <span key={i} style={{ color: BRIGHTS[i % BRIGHTS.length], textShadow: "0.04em 0.04em 0 color-mix(in oklab, var(--paper) 18%, transparent)" }}>
            {ch}
          </span>
        ))}
      </p>

      {/* The copyright strip. */}
      <div className="mt-6 flex flex-col gap-3 border-t-2 border-paper/20 px-6 py-5 font-mono text-xs text-paper/70 @xl:flex-row @xl:items-center @xl:justify-between @3xl:px-8">
        <span>© Acme, Inc.</span>
        <span aria-hidden className="flex gap-2">
          {BRIGHTS.map((c) => (
            <span key={c} className="size-3 rounded-full border-2 border-paper" style={{ backgroundColor: c }} />
          ))}
        </span>
        <span>Made with stream/ui</span>
      </div>
    </footer>
  );
}
