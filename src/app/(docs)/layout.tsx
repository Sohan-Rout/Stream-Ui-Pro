import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { DocsMobileNav, DocsSidebar } from "@/components/docs/DocsNav";
import { docsNav } from "@/registry/nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <Section className="flex-1" railClassName="flex h-full flex-col lg:flex-row">
      <DocsSidebar groups={docsNav} />
      <DocsMobileNav groups={docsNav} />
      <div className="min-w-0 flex-1 px-5 py-10 sm:px-10 sm:py-14">{children}</div>
    </Section>
  );
}
