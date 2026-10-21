import { ComicSelect } from "@streamuilib/react";

export default function ComicSelectStates() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-bold">Plan</span>
        <ComicSelect invalid defaultValue="">
          <option value="">Choose a plan…</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </ComicSelect>
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-bold">Region</span>
        <ComicSelect disabled defaultValue="eu">
          <option value="eu">Europe</option>
        </ComicSelect>
      </label>
    </div>
  );
}
