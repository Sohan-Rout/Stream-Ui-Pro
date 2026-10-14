import { ArrowRight, Download, Trash } from "lucide-react";
import { Button } from "@streamui/react";

export default function ButtonWithIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button variant="secondary">
        <Download aria-hidden /> Export CSV
      </Button>
      <Button>
        Continue <ArrowRight aria-hidden />
      </Button>
      <Button variant="pink" disabled>
        <Trash aria-hidden /> Delete
      </Button>
    </div>
  );
}
