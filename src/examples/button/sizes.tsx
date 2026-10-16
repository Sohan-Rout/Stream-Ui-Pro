import { Plus } from "lucide-react";
import { Button } from "@streamuilib/react";

export default function ButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add item">
        <Plus aria-hidden />
      </Button>
    </div>
  );
}
