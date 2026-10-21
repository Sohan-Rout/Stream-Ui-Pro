import { ComicRadio, ComicRadioGroup } from "@streamuilib/react";

export default function ComicRadioGroupHorizontal() {
  return (
    <ComicRadioGroup legend="Size" orientation="horizontal">
      <ComicRadio name="comic-size" value="s" label="Small" />
      <ComicRadio name="comic-size" value="m" label="Medium" defaultChecked />
      <ComicRadio name="comic-size" value="l" label="Large" />
    </ComicRadioGroup>
  );
}
