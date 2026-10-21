import { ComicCheckbox } from "@streamuilib/react";

export default function ComicCheckboxGroup() {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 font-bold">Today&rsquo;s missions</legend>
      <ComicCheckbox name="mission" value="cape" label="Iron the cape" defaultChecked />
      <ComicCheckbox name="mission" value="cat" label="Rescue the cat" />
      <ComicCheckbox name="mission" value="villain" label="Foil the villain" />
      <ComicCheckbox name="mission" value="lunch" label="Lunch (required)" checked disabled readOnly />
    </fieldset>
  );
}
