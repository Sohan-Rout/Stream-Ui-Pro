"use client";

import { useState } from "react";
import { ComicButton, ComicDialog, ComicInput } from "@streamuilib/react";

export default function ComicDialogForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col items-center gap-3">
      <ComicDialog
        open={open}
        onOpenChange={setOpen}
        title="Join the team"
        description="Pick a hero name. You can change it later."
        trigger={<ComicButton pop={false}>Sign me up</ComicButton>}
      >
        <form
          method="dialog"
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            setName(new FormData(e.currentTarget).get("hero") as string);
          }}
        >
          <label className="flex flex-col gap-2">
            <span className="font-bold">Hero name</span>
            <ComicInput name="hero" required placeholder="Captain Brutal" autoFocus />
          </label>
          <ComicButton type="submit" className="self-end" pop="WELCOME!">
            Join
          </ComicButton>
        </form>
      </ComicDialog>
      {name && <p className="font-mono text-sm">Welcome aboard, {name}!</p>}
    </div>
  );
}
