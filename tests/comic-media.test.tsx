/** ComicAudioPlayer, ComicTrackList, ComicEqualizer, and ComicAnimatedIcon keep the classic behavior. */
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bell } from "lucide-react";
import { ComicAnimatedIcon, ComicAudioPlayer, ComicEqualizer, ComicTrackList, type Track } from "@streamuilib/react";

const tracks: Track[] = [
  { id: "a", title: "First", artist: "Band", src: "a.wav", duration: 30 },
  { id: "b", title: "Second", artist: "Band", src: "b.wav", duration: 45 },
];

/* The test DOM can't decode audio: make play/pause fire the events a browser would. */
const proto = HTMLMediaElement.prototype;
const original = { play: proto.play, pause: proto.pause };
beforeEach(() => {
  proto.play = function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  };
  proto.pause = function (this: HTMLMediaElement) {
    this.dispatchEvent(new Event("pause"));
  };
});
afterEach(() => {
  proto.play = original.play;
  proto.pause = original.pause;
  cleanup();
});

describe("ComicAudioPlayer", () => {
  test("is a labelled player that plays, pauses, and skips", async () => {
    render(<ComicAudioPlayer tracks={tracks} />);
    expect(screen.getByRole("region", { name: "Audio player: First" })).toBeTruthy();
    expect(screen.getByText("Track 1 of 2")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy();
    expect(screen.getByText("Playing First by Band")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Next track" }));
    expect(screen.getByText("Second")).toBeTruthy();
  });

  test("seek and volume are named sliders; mute toggles", async () => {
    render(<ComicAudioPlayer tracks={tracks} />);
    expect(screen.getByRole("slider", { name: "Seek" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Volume" }).getAttribute("aria-valuetext")).toBe("80%");
    await userEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(screen.getByRole("button", { name: "Unmute" }).getAttribute("aria-pressed")).toBe("true");
  });

  test("playlist shows the comic track list", async () => {
    render(<ComicAudioPlayer tracks={tracks} playlist />);
    await userEvent.click(screen.getByRole("button", { name: /Second/ }));
    expect(screen.getByRole("button", { name: /Second/ }).getAttribute("aria-current")).toBe("true");
  });
});

describe("ComicTrackList", () => {
  test("marks the current track and shows NOW! while playing", async () => {
    const picked: number[] = [];
    render(<ComicTrackList tracks={tracks} index={0} playing onSelect={(i) => picked.push(i)} />);
    expect(screen.getByRole("list", { name: "Playlist" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Now playing: First/ }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByText("Now!").getAttribute("aria-hidden")).toBe("true");
    await userEvent.click(screen.getByRole("button", { name: /Second/ }));
    expect(picked).toEqual([1]);
  });
});

describe("ComicEqualizer", () => {
  test("is decorative, with bars and notes only while playing", () => {
    const { container, rerender } = render(<ComicEqualizer bars={6} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("aria-hidden")).toBe("true");
    expect(root.dataset.playing).toBe("true");
    expect(root.querySelectorAll(".sui-eq-bar")).toHaveLength(6);
    expect(root.querySelectorAll(".sui-comic-eq-note")).toHaveLength(2);
    rerender(<ComicEqualizer playing={false} notes={false} />);
    expect((container.firstElementChild as HTMLElement).dataset.playing).toBeUndefined();
    expect(container.querySelectorAll(".sui-comic-eq-note")).toHaveLength(0);
  });
});

describe("ComicAnimatedIcon", () => {
  test("wraps an AnimatedIcon with its animation and trigger", () => {
    const { container } = render(
      <ComicAnimatedIcon animation="shake" trigger="loop">
        <Bell aria-hidden />
      </ComicAnimatedIcon>,
    );
    const icon = container.querySelector("[data-sui-icon]") as HTMLElement;
    expect(icon.dataset.suiIcon).toBe("shake");
    expect(icon.dataset.suiTrigger).toBe("loop");
    expect((container.firstElementChild as HTMLElement).dataset.trigger).toBe("loop");
  });
});
