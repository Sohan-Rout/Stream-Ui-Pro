import { Radio, RadioGroup } from "@streamui/react";

export default function RadioGroupHorizontal() {
  return (
    <RadioGroup legend="T-shirt size" orientation="horizontal">
      {["S", "M", "L", "XL"].map((size) => (
        <Radio key={size} name="shirt-size" value={size} label={size} defaultChecked={size === "M"} />
      ))}
    </RadioGroup>
  );
}
