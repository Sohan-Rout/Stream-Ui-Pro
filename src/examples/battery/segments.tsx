import { Battery } from "@streamuilib/react";

export default function BatterySegments() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-6">
        <Battery value={80} segments={4} size="sm" />
        <Battery value={55} segments={5} />
        <Battery value={18} segments={5} size="lg" />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <Battery value={90} tone="blue" />
        <Battery value={45} tone="violet" showValue={false} label="Controller battery" />
        <Battery value={30} tone="pink" segments={3} charging />
      </div>
    </div>
  );
}
