import { Progress } from "@streamui/react";

const bars = [
  { label: "Storage", value: 72, tone: "pink" },
  { label: "Bandwidth", value: 38, tone: "lime" },
  { label: "Build minutes", value: 91, tone: "orange" },
] as const;

export default function ProgressTones() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-bold">{b.label}</span>
            <span className="font-mono tabular-nums">{b.value}%</span>
          </div>
          <Progress value={b.value} tone={b.tone} aria-label={b.label} />
        </div>
      ))}
    </div>
  );
}
