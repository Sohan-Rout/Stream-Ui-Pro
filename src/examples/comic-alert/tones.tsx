import { ComicAlert } from "@streamuilib/react";

export default function ComicAlertTones() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-7 pt-3">
      <ComicAlert tone="info" title="Heads up">
        A new version is rolling out tonight.
      </ComicAlert>
      <ComicAlert tone="success" title="Changes saved">
        Your profile is up to date.
      </ComicAlert>
      <ComicAlert tone="warning" title="Almost out of seats">
        You are using 9 of 10 seats on your plan.
      </ComicAlert>
      <ComicAlert tone="danger" title="Payment failed">
        We could not charge your card ending in 4242.
      </ComicAlert>
    </div>
  );
}
