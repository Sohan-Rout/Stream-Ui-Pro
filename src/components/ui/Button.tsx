import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "blue" | "pink";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-yellow text-on-bright",
  secondary: "bg-paper-raised text-ink",
  blue: "bg-blue text-on-bright",
  pink: "bg-pink text-on-bright",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
  icon: "size-11",
};

/**
 * Class string for the brutal button look. Use it on links that should look
 * like buttons: `<a className={buttonStyles({ variant: "blue" })}>`.
 * Hover lifts the button toward the light; press pushes it into its shadow.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border-2 border-ink font-semibold whitespace-nowrap shadow-brutal select-none",
    "transition-[translate,box-shadow,background-color] duration-150 ease-out motion-reduce:transition-none",
    "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg",
    "active:translate-x-1 active:translate-y-1 active:shadow-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4.5 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
