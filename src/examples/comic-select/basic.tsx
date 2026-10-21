import { ComicSelect } from "@streamuilib/react";

export default function ComicSelectBasic() {
  return (
    <label className="flex w-full max-w-xs flex-col gap-2">
      <span className="font-bold">Pick a power</span>
      <ComicSelect defaultValue="">
        <option value="" disabled>
          Choose one…
        </option>
        <option value="flight">Flight</option>
        <option value="strength">Super strength</option>
        <option value="speed">Speed</option>
        <option value="invisibility">Invisibility</option>
      </ComicSelect>
    </label>
  );
}
