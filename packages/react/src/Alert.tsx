import type { ComponentProps, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "./cn";

export type AlertTone = "info" | "success" | "warning" | "danger";

const tones: Record<AlertTone, { surface: string; tile: string; icon: typeof Info }> = {
  info: { surface: "bg-blue-soft", tile: "bg-blue", icon: Info },
  success: { surface: "bg-lime-soft", tile: "bg-lime", icon: CircleCheck },
  warning: { surface: "bg-orange-soft", tile: "bg-orange", icon: TriangleAlert },
  danger: { surface: "bg-pink-soft", tile: "bg-pink", icon: CircleAlert },
};

export type AlertProps = Omit<ComponentProps<"div">, "title"> & {
  tone?: AlertTone;
  title?: ReactNode;
  /** Replaces the tone's default icon. Pass `null` for no icon. */
  icon?: ReactNode;
  /** Buttons or links shown under the message. */
  action?: ReactNode;
};

/**
 * A message box. Warnings and errors use role="alert" so screen readers
 * announce them right away; info and success use the politer role="status".
 */
export function Alert({ tone = "info", title, icon, action, className, children, role, ...props }: AlertProps) {
  const t = tones[tone];
  const urgent = tone === "warning" || tone === "danger";
  const glyph = icon === undefined ? <t.icon className="size-5" strokeWidth={2.25} /> : icon;

  return (
    <div
      role={role ?? (urgent ? "alert" : "status")}
      className={cn("flex gap-4 border-2 border-ink p-4 text-ink shadow-brutal-sm", t.surface, className)}
      {...props}
    >
      {glyph && (
        <span
          aria-hidden
          className={cn("grid size-9 shrink-0 place-items-center border-2 border-ink text-on-bright", t.tile)}
        >
          {glyph}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
        {title && <p className="font-bold">{title}</p>}
        {children && <div className="text-sm leading-relaxed">{children}</div>}
        {action && <div className="mt-2 flex flex-wrap gap-3">{action}</div>}
      </div>
    </div>
  );
}
