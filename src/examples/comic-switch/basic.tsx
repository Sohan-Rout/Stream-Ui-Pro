import { ComicSwitch } from "@streamuilib/react";

export default function ComicSwitchBasic() {
  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch defaultChecked /> Sound effects
      </label>
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch /> Dark lair mode
      </label>
      <label className="flex items-center gap-3 font-bold">
        <ComicSwitch defaultChecked disabled /> Always on
      </label>
    </div>
  );
}
