"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button, Dialog, Input } from "@streamuilib/react";

export default function DialogForm() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Invite a teammate"
      trigger={
        <Button>
          <UserPlus aria-hidden /> Invite
        </Button>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(false);
        }}
      >
        <div>
          <label htmlFor="dialog-invite-email" className="mb-2 block font-bold">
            Email
          </label>
          <Input id="dialog-invite-email" type="email" required placeholder="name@company.com" />
        </div>
        <Button type="submit" className="self-end">
          Send invite
        </Button>
      </form>
    </Dialog>
  );
}
