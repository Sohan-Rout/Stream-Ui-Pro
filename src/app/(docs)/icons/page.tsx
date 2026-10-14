import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { Badge } from "@streamui/react";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { IconBrowser } from "@/components/docs/IconBrowser";

export const metadata: Metadata = pageMetadata({
  title: "Icons",
  description:
    "Search 2,000+ icons, adjust size and stroke, add draw, spin, or bounce animations, and copy the React JSX.",
  path: "/icons",
});

const usage = `import { Rocket } from "lucide-react";
import { AnimatedIcon } from "@streamui/react";

// Static
<Rocket className="size-5" strokeWidth={1.75} aria-hidden />

// Animated: plays on hover of the icon or its direct parent
<AnimatedIcon animation="bounce">
  <Rocket className="size-5" aria-hidden />
</AnimatedIcon>`;

export default function IconsPage() {
  return (
    <div className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Icons" }]}
        title="Icons"
        description="Drawn on a 24px grid with one stroke weight, so icons sit evenly next to text. Pick a size, stroke, and animation, then click any icon to copy its JSX."
        meta={
          <>
            <Badge tone="paper">24px grid</Badge>
            <Badge tone="paper">tree-shakable</Badge>
            <Badge tone="pink">animated</Badge>
          </>
        }
      />
      <IconBrowser />
      <DocSection title="Usage" id="usage">
        <p className="max-w-2xl leading-relaxed text-ink-muted">
          Import icons by name so only the ones you use are bundled. Size them with
          Tailwind and let color inherit from the text. Mark decorative icons{" "}
          <code className="font-mono text-sm text-ink">aria-hidden</code>, and give icon-only
          buttons an <code className="font-mono text-sm text-ink">aria-label</code>.
        </p>
        <CodeBlock code={usage} filename="usage.tsx" />
        <p className="max-w-2xl leading-relaxed text-ink-muted">
          Animations are pure CSS from the package theme, and all of them stop when the
          user prefers reduced motion.{" "}
          <Link href="/components/animated-icon" className="font-semibold text-ink underline decoration-2 underline-offset-4">
            Animated Icon docs
          </Link>
        </p>
        <p className="font-mono text-xs text-ink-muted">
          Glyphs from Lucide, ISC licensed.
        </p>
      </DocSection>
    </div>
  );
}
