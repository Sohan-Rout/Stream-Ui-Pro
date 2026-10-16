import type { ComponentProps } from "react";
import { cn } from "./cn";

export type CardTone = "paper" | "lime" | "pink" | "blue" | "violet" | "orange";

const tones: Record<CardTone, string> = {
  paper: "bg-paper-raised",
  lime: "bg-lime-soft",
  pink: "bg-pink-soft",
  blue: "bg-blue-soft",
  violet: "bg-violet-soft",
  orange: "bg-orange-soft",
};

export type CardProps = ComponentProps<"div"> & {
  /** Surface tint. Soft tints keep large areas light. */
  tone?: CardTone;
};

/** A bordered surface with a hard shadow. Compose with the Card* parts. */
export function Card({ tone = "paper", className, ...props }: CardProps) {
  return (
    <div
      className={cn("flex flex-col border-2 border-ink text-ink shadow-brutal", tones[tone], className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 border-b-2 border-ink p-5", className)} {...props} />;
}

/** Renders an h3 by default; pass `as` to match your page's heading level. */
export function CardTitle({
  as: Heading = "h3",
  className,
  ...props
}: ComponentProps<"h3"> & { as?: "h2" | "h3" | "h4" }) {
  return <Heading className={cn("text-lg leading-tight font-bold tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm leading-relaxed text-ink-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex-1 p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-wrap items-center gap-3 border-t-2 border-ink p-5", className)} {...props} />;
}
