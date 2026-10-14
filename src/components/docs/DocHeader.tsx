import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export type Crumb = { label: string; href?: string };

export function DocHeader({
  crumbs,
  title,
  description,
  meta,
}: {
  crumbs: Crumb[];
  title: string;
  description: ReactNode;
  meta?: ReactNode;
}) {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href && { item: absoluteUrl(c.href) }),
    })),
  };

  return (
    <header className="flex flex-col gap-5 border-b-2 border-ink pb-10">
      <JsonLd data={breadcrumbs} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-ink-muted">
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight aria-hidden className="size-3.5" />}
              {c.href ? (
                <Link href={c.href} className="underline-offset-4 hover:text-ink hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-bold text-ink">
                  {c.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{title}</h1>
      <p className="max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted">{description}</p>
      {meta && <div className="flex flex-wrap items-center gap-2">{meta}</div>}
    </header>
  );
}

export function DocSection({ title, id, children }: { title: string; id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex scroll-mt-20 flex-col gap-6">
      <h2 id={id} className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest uppercase">
        <span aria-hidden className="h-0.5 w-8 bg-ink" />
        {title}
      </h2>
      {children}
    </section>
  );
}
