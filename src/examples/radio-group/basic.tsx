import { Radio, RadioGroup } from "@streamui/react";

export default function RadioGroupBasic() {
  return (
    <RadioGroup legend="Billing" className="w-full max-w-xs">
      <Radio name="billing" value="monthly" label="Monthly" description="$24 per seat, cancel anytime" defaultChecked />
      <Radio name="billing" value="yearly" label="Yearly" description="$19 per seat, billed once" />
      <Radio name="billing" value="invoice" label="Invoice" description="Enterprise only" disabled />
    </RadioGroup>
  );
}
