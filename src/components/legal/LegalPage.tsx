import type { ReactNode } from "react";

/** Date shown on every legal page; bump it whenever the wording changes. */
export const LEGAL_UPDATED = "16 October 2026";

/** Header plus readable long-form type for a legal page. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="max-w-2xl">
      <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
        {eyebrow} <span aria-hidden className="h-0.5 w-8 bg-ink" />
        <span className="text-ink-muted">Updated {LEGAL_UPDATED}</span>
      </p>
      <h1 className="mt-5 font-display text-4xl leading-tight tracking-tight sm:text-5xl">{title}</h1>
      <div className="mt-5 text-lg leading-relaxed text-ink-muted">{intro}</div>
      <div
        className={[
          "mt-10 flex flex-col gap-4 leading-relaxed",
          "[&_h2]:mt-8 [&_h2:first-child]:mt-0 [&_h2]:border-t-2 [&_h2]:border-ink [&_h2]:pt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-tight",
          "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_li]:marker:text-pink",
          "[&_a]:font-semibold [&_a]:underline [&_a]:decoration-2 [&_a]:underline-offset-4",
          "[&_strong]:font-semibold",
        ].join(" ")}
      >
        {children}
      </div>
    </article>
  );
}
