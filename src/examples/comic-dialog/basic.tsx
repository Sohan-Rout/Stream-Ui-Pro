"use client";

import { useState } from "react";
import { ComicButton, ComicDialog } from "@streamuilib/react";

export default function ComicDialogBasic() {
  const [open, setOpen] = useState(false);

  return (
    <ComicDialog
      open={open}
      onOpenChange={setOpen}
      title="Delete this project?"
      description="This removes all deployments, and it can't be undone."
      sfx="Gulp!"
      trigger={
        <ComicButton tone="pink" pop={false}>
          Delete project
        </ComicButton>
      }
      footer={
        <>
          <ComicButton tone="paper" pop={false} onClick={() => setOpen(false)}>
            Cancel
          </ComicButton>
          <ComicButton tone="pink" pop="KABOOM!" onClick={() => setTimeout(() => setOpen(false), 450)}>
            Delete
          </ComicButton>
        </>
      }
    />
  );
}
