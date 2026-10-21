import { ComicRadio, ComicRadioGroup } from "@streamuilib/react";

export default function ComicRadioGroupBasic() {
  return (
    <ComicRadioGroup legend="Delivery">
      <ComicRadio name="comic-delivery" value="standard" label="Standard" description="3 to 5 days" defaultChecked />
      <ComicRadio name="comic-delivery" value="express" label="Express" description="Next day" />
      <ComicRadio name="comic-delivery" value="jetpack" label="Jetpack" description="Within the hour" />
    </ComicRadioGroup>
  );
}
