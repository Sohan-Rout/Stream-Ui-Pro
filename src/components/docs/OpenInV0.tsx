import { ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@streamuilib/react";
import { openInV0Url } from "@/registry/shadcn";

/** Opens this registry item in v0, which spins up a live, editable project from it. */
export function OpenInV0({ item }: { item: string }) {
  return (
    <a
      href={openInV0Url(item)}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonStyles({ variant: "secondary", size: "sm", className: "h-11 self-start" })}
    >
      Open in v0 <ArrowUpRight aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
