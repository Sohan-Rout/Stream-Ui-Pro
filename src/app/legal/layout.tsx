import type { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { LegalNav } from "@/components/legal/LegalNav";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <Section className="flex-1" railClassName="flex h-full flex-col lg:flex-row">
      <LegalNav />
      <div className="min-w-0 flex-1 px-5 py-10 sm:px-10 sm:py-14">{children}</div>
    </Section>
  );
}
