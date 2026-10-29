import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buttonStyles } from "@streamuilib/react";
import { IntentLink as Link } from "@/components/ui/IntentLink";
import { templates } from "@/lib/templates";

/**
 * A short strip pointing from the sections to a Pro template: the same kind
 * of page, already put together.
 */
export function TemplatePromo() {
  const t = templates[0];
  return (
    <aside aria-label="Pro template" className="flex flex-col items-start gap-5 border-2 border-ink bg-orange-soft p-5 shadow-brutal sm:flex-row sm:items-center sm:p-6">
      <Link href={`/templates/${t.slug}`} tabIndex={-1} aria-hidden className="hidden w-44 shrink-0 border-2 border-ink bg-paper sm:block">
        <Image src={t.shots[0].src} alt="" placeholder="blur" sizes="176px" className="block h-auto w-full" />
      </Link>
      <div className="flex-1">
        <p className="font-mono text-xs font-bold tracking-widest uppercase">
          Pro template · ${t.price}
        </p>
        <p className="mt-1 font-display text-xl tracking-tight">Want the whole page, already put together?</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          {t.name} is a complete landing page, hero to footer, built from these sections. Full source, one-time price.
        </p>
      </div>
      <Link href={`/templates/${t.slug}`} className={buttonStyles({ variant: "pink", className: "shrink-0" })}>
        View {t.name} <ArrowRight aria-hidden />
      </Link>
    </aside>
  );
}
