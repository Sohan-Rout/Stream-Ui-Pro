"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { Button, Dialog } from "@streamuilib/react";

export default function DialogBasic() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Delete this project?"
      description="This removes all deployments and can't be undone."
      trigger={
        <Button variant="pink">
          <Trash aria-hidden /> Delete project
        </Button>
      }
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="pink" onClick={() => setOpen(false)}>
            Delete
          </Button>
        </>
      }
    />
  );
}
