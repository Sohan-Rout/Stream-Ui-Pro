import { Alert } from "@streamuilib/react";

export default function AlertTones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Alert tone="info" title="New version available">
        v0.2 adds Dialog, Tooltip, and Accordion.
      </Alert>
      <Alert tone="success" title="Changes saved" />
      <Alert tone="warning" title="Storage almost full">
        You’ve used 92% of your plan’s storage.
      </Alert>
      <Alert tone="danger" title="Payment failed">
        Your card was declined. Update it to keep your workspace.
      </Alert>
    </div>
  );
}
