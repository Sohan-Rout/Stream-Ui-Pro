import { Switch } from "@streamuilib/react";

export default function SwitchBasic() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <span id="switch-email" className="font-semibold">
          Email alerts
        </span>
        <Switch aria-labelledby="switch-email" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span id="switch-sms" className="font-semibold">
          SMS alerts
        </span>
        <Switch aria-labelledby="switch-sms" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span id="switch-locked" className="font-semibold text-ink-muted">
          Managed by admin
        </span>
        <Switch aria-labelledby="switch-locked" defaultChecked disabled />
      </div>
    </div>
  );
}
