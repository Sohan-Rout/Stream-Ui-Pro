import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { ComicInput } from "@streamuilib/react";

/**
 * The same vintage print palette as the Comic cover hero (newsprint, golden
 * yellow, brick red), so the two bookend a page. Custom properties on the
 * footer, one place to retune.
 */
const PALETTE = {
  "--comic-paper": "oklch(0.965 0.022 85)",
  "--comic-yellow": "oklch(0.87 0.12 88)",
  "--comic-red": "oklch(0.58 0.16 32)",
} as CSSProperties;

const DOTS: CSSProperties = {
  backgroundImage: "radial-gradient(color-mix(in oklab, var(--ink) 11%, transparent) 1.3px, transparent 1.8px)",
  backgroundSize: "10px 10px",
};

/** A 12-point starburst in a 100×100 box. */
const BURST = (() => {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 12;
    const r = i % 2 ? 34 : 50;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M${pts.join("L")}Z`;
})();

/** Each link column is a small panel at its own tilt. */
const columns = [
  { title: "Product", links: ["Features", "Pricing", "Changelog", "Status"], tilt: -0.8 },
  { title: "Company", links: ["About", "Careers", "Blog", "Press"], tilt: 0.6 },
  { title: "Legal", links: ["Privacy", "Terms", "Security"], tilt: -0.4 },
];

/** A caption box stuck over a panel's top-left corner, like a comic's narration. */
const caption =
  "absolute -top-4 -left-2 -rotate-2 border-[3px] border-ink px-2.5 py-0.5 font-mono text-xs font-bold tracking-wide uppercase shadow-[3px_3px_0_var(--ink)]";

/**
 * Comic footer: the last page of the issue. A "The end?" panel with the
 * newsletter signup ("…or is it?"), a brick-red brand panel with a starburst,
 * link columns as tilted panels under caption boxes, and a "To be
 * continued…" strip along the bottom. Pairs with the Comic cover hero.
 */
export function ComicFooterSection() {
  return (
    <footer className="@container relative isolate overflow-hidden border-t-4 border-ink text-ink" style={{ ...PALETTE, backgroundColor: "var(--comic-paper)" }}>
      <div aria-hidden className="absolute inset-0 -z-10" style={DOTS} />

      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-14 pb-12 @3xl:px-8 @3xl:pt-16">
        <div className="grid grid-cols-1 gap-8 @3xl:grid-cols-5 @3xl:gap-6">
          {/* The final panel: the signup. */}
          <div className="relative -rotate-[0.6deg] border-4 border-ink bg-paper-raised p-6 pt-8 shadow-[6px_6px_0_var(--ink)] @3xl:col-span-3 @3xl:p-8 @3xl:pt-10">
            <span className={caption} style={{ backgroundColor: "var(--comic-yellow)" }}>
              Last page
            </span>
            <p className="font-display text-5xl leading-none tracking-tight @3xl:text-6xl" style={{ textShadow: "4px 4px 0 var(--comic-red)" }}>
              The end?
            </p>
            <form className="mt-6 flex flex-col gap-3" action="#">
              <label htmlFor="comic-footer-email" className="font-semibold">
                …or is it? Get the next issue in your inbox, once a month.
              </label>
              <div className="flex flex-col gap-3 @sm:flex-row">
                <ComicInput id="comic-footer-email" type="email" required placeholder="you@company.com" frameClassName="flex-1" />
                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 border-4 border-ink bg-ink px-5 font-display text-sm text-paper uppercase shadow-[4px_4px_0_var(--comic-red)] transition-[translate,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--comic-red)] active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-blue motion-reduce:transition-none"
                >
                  Subscribe <ArrowRight aria-hidden className="size-4" />
                </button>
              </div>
            </form>
          </div>

          {/* The brand panel. */}
          <div
            className="relative flex rotate-[0.8deg] flex-col justify-between gap-6 border-4 border-ink p-6 shadow-[6px_6px_0_var(--ink)] @3xl:col-span-2 @3xl:p-8"
            style={{ backgroundColor: "var(--comic-red)", color: "var(--comic-paper)" }}
          >
            <span aria-hidden className="absolute -top-8 -right-5 grid size-20 place-items-center">
              <svg viewBox="0 0 100 100" overflow="visible" className="absolute inset-0 size-full drop-shadow-[3px_3px_0_var(--ink)]">
                <path d={BURST} fill="var(--comic-yellow)" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
              </svg>
              <span className="relative rotate-12 font-display text-sm text-ink">No. 1</span>
            </span>
            <span className="font-display text-3xl tracking-tight @3xl:text-4xl">ACME COMICS</span>
            <p className="max-w-xs text-sm leading-relaxed font-medium">
              Launch pages with punch, printed fresh every release since issue one.
            </p>
          </div>
        </div>

        {/* Link columns as a strip of panels. */}
        <div className="grid grid-cols-1 gap-8 @md:grid-cols-3 @md:gap-5">
          {columns.map((c) => (
            <nav
              key={c.title}
              aria-label={c.title}
              className="relative border-4 border-ink bg-paper-raised p-5 pt-7 shadow-[5px_5px_0_var(--ink)]"
              style={{ rotate: `${c.tilt}deg` }}
            >
              <p className={caption} style={{ backgroundColor: "var(--comic-yellow)" }}>
                {c.title}
              </p>
              <ul className="flex flex-col gap-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-semibold decoration-[3px] underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue"
                      style={{ textDecorationColor: "var(--comic-red)" }}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* The back-cover strip. */}
      <div className="flex flex-col gap-2 border-t-4 border-ink bg-ink px-4 py-3 font-mono text-xs text-paper @xl:flex-row @xl:items-center @xl:justify-between @3xl:px-8">
        <span>© Acme Comics, Inc.</span>
        <span className="font-bold tracking-widest uppercase" style={{ color: "var(--comic-yellow)" }}>
          To be continued…
        </span>
        <span>Made with stream/ui</span>
      </div>
    </footer>
  );
}
