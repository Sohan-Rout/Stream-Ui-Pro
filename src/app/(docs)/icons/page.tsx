import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { DocHeader, DocSection } from "@/components/docs/DocHeader";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { IconBrowser } from "@/components/docs/IconBrowser";

export const metadata: Metadata = {
  title: "Icons",
  description: "Search the icon set and copy any icon as JSX.",
};

const usage = `import { Rocket } from "lucide-react";

<Rocket className="size-5" strokeWidth={1.75} aria-hidden />`;

export default function IconsPage() {
  return (
    <div className="flex flex-col gap-14">
      <DocHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Icons" }]}
        title="Icons"
        description="Drawn on a 24px grid with one stroke weight, so icons sit evenly next to text. Pick a size and stroke, then click any icon to copy its JSX."
        meta={
          <>
            <Badge tone="paper">24px grid</Badge>
            <Badge tone="paper">tree-shakable</Badge>
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
        <p className="font-mono text-xs text-ink-muted">
          Glyphs from Lucide, ISC licensed.
        </p>
      </DocSection>
    </div>
  );
}
