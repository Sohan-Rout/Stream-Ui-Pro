import { ComicBattery } from "@streamuilib/react";

export default function ComicBatteryLevels() {
  return (
    <div className="flex flex-wrap items-center gap-x-12 gap-y-10 pt-6 pl-4">
      <ComicBattery value={100} />
      <ComicBattery value={46} />
      <ComicBattery value={12} label="Low battery" />
      <ComicBattery value={72} charging />
    </div>
  );
}
