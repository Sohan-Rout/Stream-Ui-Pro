import { Section } from "@/components/ui/Section";
import { NotFoundContent } from "@/components/blocks/NotFoundContent";

export default function NotFound() {
  return (
    <Section className="flex-1" railClassName="flex h-full flex-col justify-center px-5 py-24 sm:px-10">
      <NotFoundContent />
    </Section>
  );
}
