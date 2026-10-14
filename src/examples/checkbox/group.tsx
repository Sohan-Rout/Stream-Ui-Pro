import { Checkbox } from "@/components/ui/Checkbox";

export default function CheckboxGroup() {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 font-bold">Notify me about</legend>
      <Checkbox name="notify" value="releases" label="New releases" defaultChecked />
      <Checkbox name="notify" value="security" label="Security advisories" defaultChecked />
      <Checkbox name="notify" value="digest" label="Weekly digest" />
      <Checkbox name="notify" value="billing" label="Billing (required)" checked disabled readOnly />
    </fieldset>
  );
}
