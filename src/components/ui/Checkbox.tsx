import type { ComponentProps, ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label?: ReactNode;
};

/**
 * A native checkbox with a brutal face. The real `<input>` stays in the DOM
 * (visually hidden), so forms, keyboard, and screen readers work unchanged.
 * Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).
 */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "grid size-6 shrink-0 place-items-center border-2 border-ink bg-paper-raised text-on-bright shadow-brutal-sm transition-colors duration-150",
          "peer-checked:bg-lime peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue",
          "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
        )}
      >
        <Check className="size-4" strokeWidth={3.5} />
      </span>
      {label && <span className="font-semibold">{label}</span>}
    </label>
  );
}
