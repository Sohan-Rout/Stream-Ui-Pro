import type { ReactNode } from "react";

export type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  return (
    <header className="flex flex-col gap-6 border-b-2 border-ink px-5 py-10 sm:px-10 sm:py-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
          {index}
          <span aria-hidden className="h-0.5 w-8 bg-ink" />
          <span className="text-ink-muted">{eyebrow}</span>
        </p>
        <h2 className="mt-5 max-w-2xl font-display text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
      </div>
      {(description || action) && (
        <div className="flex max-w-sm flex-col items-start gap-5">
          {description && (
            <p className="text-base leading-relaxed text-pretty text-ink-muted">
              {description}
            </p>
          )}
          {action}
        </div>
      )}
    </header>
  );
}
