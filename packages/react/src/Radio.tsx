import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

export type RadioProps = Omit<ComponentProps<"input">, "type"> & {
  label?: ReactNode;
  /** Secondary line under the label. */
  description?: ReactNode;
};

/**
 * A native radio with a brutal face. Group radios by giving them the same
 * `name`, inside a RadioGroup (or any fieldset with a legend).
 */
export function Radio({ label, description, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-start gap-3 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <input type="radio" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "mt-px grid size-6 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper-raised shadow-brutal-sm transition-colors duration-150",
          "peer-checked:bg-lime peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue",
          "[&>span]:scale-0 peer-checked:[&>span]:scale-100",
        )}
      >
        <span className="size-2.5 rounded-full bg-ink transition-transform duration-150 motion-reduce:transition-none" />
      </span>
      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && <span className="font-semibold">{label}</span>}
          {description && <span className="text-sm text-ink-muted">{description}</span>}
        </span>
      )}
    </label>
  );
}

export type RadioGroupProps = ComponentProps<"fieldset"> & {
  /** Visible group label, rendered as the fieldset's legend. */
  legend: ReactNode;
  orientation?: "vertical" | "horizontal";
};

/** A fieldset with a legend: screen readers announce the group name with each radio. */
export function RadioGroup({ legend, orientation = "vertical", className, children, ...props }: RadioGroupProps) {
  return (
    <fieldset className={cn("min-w-0", className)} {...props}>
      <legend className="mb-3 font-bold">{legend}</legend>
      <div className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-wrap gap-x-6")}>{children}</div>
    </fieldset>
  );
}
