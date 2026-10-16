import { Select } from "@streamuilib/react";

export default function SelectBasic() {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor="select-region" className="mb-2 block font-bold">
        Region
      </label>
      <Select id="select-region" defaultValue="bom">
        <option value="iad">US East (Virginia)</option>
        <option value="fra">Europe (Frankfurt)</option>
        <option value="bom">Asia (Mumbai)</option>
        <option value="syd">Oceania (Sydney)</option>
      </Select>
    </div>
  );
}
