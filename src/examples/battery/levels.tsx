import { Battery } from "@streamuilib/react";

export default function BatteryLevels() {
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      <Battery value={100} />
      <Battery value={64} />
      <Battery value={38} />
      <Battery value={12} label="Low battery" />
      <Battery value={72} charging />
    </div>
  );
}
