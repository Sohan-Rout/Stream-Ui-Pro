import { Alert, Button } from "@streamuilib/react";

export default function AlertWithAction() {
  return (
    <Alert
      tone="danger"
      title="Deploy failed"
      className="w-full max-w-md"
      action={
        <>
          <Button size="sm">Retry deploy</Button>
          <Button size="sm" variant="secondary">
            View logs
          </Button>
        </>
      }
    >
      The build step exited with code 1 after 42 seconds.
    </Alert>
  );
}
