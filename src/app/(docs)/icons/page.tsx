import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { indexSeo } from "@/lib/seo-copy";
import Link from "next/link";
import { Badge } from "@streamuilib/react";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { IconBrowser } from "@/components/docs/IconBrowser";

export const metadata: Metadata = pageMetadata({ ...indexSeo.icons, path: "/icons" });

const usage = `import { Rocket } from "lucide-react";
import { AnimatedIcon } from "@streamuilib/react";

// Static
<Rocket className="size-5" strokeWidth={1.75} aria-hidden />

// Animated: plays on hover of the icon or its direct parent
<AnimatedIcon animation="bounce">
  <Rocket className="size-5" aria-hidden />
</AnimatedIcon>`;

const brandUsage = `// bun add react-icons
import { SiGithub } from "react-icons/si";

// Monochrome; takes the text color. Name it when it stands alone.
<SiGithub className="size-5" aria-label="GitHub" role="img" />`;

export default function IconsPage() {
  return (
    <div className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Icons" }]}
        title="Icons"
        description="2,000+ line icons on a 24px grid that you can animate with draw, spin, bounce, and more, plus 3,400+ brand logos. Click any icon to copy its JSX."
        meta={
          <>
            <Badge tone="paper">24px grid</Badge>
            <Badge tone="paper">tree-shakable</Badge>
            <Badge tone="pink">animated</Badge>
            <Badge tone="lime">brand logos</Badge>
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
        <p className="max-w-2xl leading-relaxed text-ink-muted">
          Brand icons come from the{" "}
          <code className="font-mono text-sm text-ink">react-icons</code> package. Copy them as
          JSX, or as a standalone SVG to drop in anywhere.
        </p>
        <CodeBlock code={brandUsage} filename="brand-icons.tsx" />
        <p className="font-mono text-xs text-ink-muted">
          Line icons from Lucide, ISC licensed. Brand icons from Simple Icons (CC0) via react-icons; each
          logo is a trademark of its owner, so follow that brand&apos;s guidelines when you use it.
        </p>
      </DocSection>
    </div>
  );
}
