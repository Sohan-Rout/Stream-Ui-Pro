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
        <p className="flex items-center gap-3 font-mono text-xs font-semibold tracking-widest text-ink-muted uppercase">
          <span className="border-2 border-ink bg-yellow px-1.5 py-0.5 text-on-bright">{index}</span>
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl leading-none font-display tracking-tight text-balance sm:text-5xl">
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
