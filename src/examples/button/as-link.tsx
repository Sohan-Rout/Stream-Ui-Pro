import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonStyles } from "@streamui/react";

export default function ButtonAsLink() {
  return (
    <Link href="/components" className={buttonStyles({ variant: "blue" })}>
      Browse components <ArrowUpRight aria-hidden />
    </Link>
  );
}
