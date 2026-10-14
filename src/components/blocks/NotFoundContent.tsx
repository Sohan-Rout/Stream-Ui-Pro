import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";

export function NotFoundContent() {
  return (
    <div className="flex flex-col items-start gap-6">
      <p className="font-mono text-xs font-bold tracking-widest uppercase">
        404 <span aria-hidden className="mx-2 inline-block h-0.5 w-8 bg-ink align-middle" />
        <span className="text-ink-muted">Not found</span>
      </p>
      <h1 className="max-w-xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
        There&apos;s nothing at this address.
      </h1>
      <p className="max-w-md text-lg leading-relaxed text-ink-muted">
        The page may have moved, or the link has a typo. The component library is a good place to start over.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link href="/components" className={buttonStyles({ size: "lg" })}>
          Browse components
        </Link>
        <Link href="/" className={buttonStyles({ variant: "secondary", size: "lg" })}>
          <ArrowLeft aria-hidden /> Home
        </Link>
      </div>
    </div>
  );
}
