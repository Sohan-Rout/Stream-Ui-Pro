import { Button } from "@/components/ui/Button";

export default function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="pink">Pink</Button>
      <Button variant="blue">Blue</Button>
    </div>
  );
}
