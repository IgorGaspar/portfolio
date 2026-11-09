"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { type Clip, LoopClip } from "./LoopClip";

export type Screen = {
  /** Screenshot; with a clip, use the clip's first frame here and as its poster. */
  image: { src: string; width: number; height: number };
  clip?: Clip;
};

export type Screens = { desktop: Screen; mobile: Screen };

type Device = keyof Screens;

const fill = "h-full w-full object-cover object-top";

function ScreenMedia({
  screen,
  sizes,
  className = fill,
}: {
  screen: Screen;
  sizes: string;
  className?: string;
}) {
  if (screen.clip)
    return <LoopClip clip={screen.clip} className="h-full" videoClassName={className} />;
  return (
    <Image
      src={screen.image.src}
      alt=""
      width={screen.image.width}
      height={screen.image.height}
      sizes={sizes}
      className={className}
    />
  );
}

export type MockupLabels = { desktop: string; mobile: string; close: string };

const ptLabels: MockupLabels = {
  desktop: "Ampliar a tela do computador",
  mobile: "Ampliar a tela do celular",
  close: "Fechar",
};

type Props = {
  screens: Screens;
  /** Describes both screens at once; the frames themselves are decoration. */
  label: string;
  labels?: MockupLabels;
  className?: string;
};

const screenButton =
  "block h-full w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * The same product on a laptop and on a phone, to show the layout works on every screen.
 * Frames are plain CSS, so the only weight is the screenshots or clips. Each screen opens
 * full size on click, so the text can be read. On small screens only the phone is shown,
 * large, because a laptop that narrow would be unreadable.
 */
export function DeviceMockup({ screens, label, labels = ptLabels, className = "" }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Device | null>(null);

  const show = (device: Device) => {
    setOpen(device);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <div className={`relative sm:pr-[14%] sm:pb-[4%] ${className}`}>
      <p className="sr-only">{label}</p>

      {/* Laptop: lid with bezel, then the base. */}
      <div className="hidden sm:block">
        <div className="rounded-t-[1.1rem] border border-white/10 bg-[#0d0f14] p-[2.2%] pb-[3%] shadow-2xl">
          <div className="aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-black">
            <button
              type="button"
              aria-label={labels.desktop}
              onClick={() => show("desktop")}
              className={screenButton}
            >
              <ScreenMedia screen={screens.desktop} sizes="(min-width: 1280px) 1000px, 86vw" />
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative -mx-[5%] h-[0.9rem] rounded-b-[1rem] border border-t-0 border-white/10 bg-gradient-to-b from-[#2a2e37] to-[#14161c] shadow-xl"
        >
          <span className="absolute top-0 left-1/2 h-[35%] w-[16%] -translate-x-1/2 rounded-b-md bg-black/40" />
        </div>
      </div>

      {/* Phone: alone and large on small screens, overlapping the laptop from sm up. */}
      <div className="mx-auto w-[72%] max-w-[300px] rounded-[1.8rem] border border-white/15 bg-[#0d0f14] p-2 shadow-2xl ring-1 ring-black/40 sm:absolute sm:right-0 sm:bottom-0 sm:w-[27%] sm:max-w-none sm:rounded-[1.6rem] sm:p-[1.6%]">
        <div className="aspect-[390/664] overflow-hidden rounded-[1.35rem] bg-black sm:rounded-[1.25rem]">
          <button
            type="button"
            aria-label={labels.mobile}
            onClick={() => show("mobile")}
            className={screenButton}
          >
            <ScreenMedia screen={screens.mobile} sizes="(min-width: 640px) 280px, 300px" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-label={open ? labels[open] : undefined}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          // A click on the backdrop (the dialog itself, outside its content) closes it.
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
      >
        {open && (
          <div className="flex flex-col items-end gap-3 p-4">
            <button
              type="button"
              onClick={close}
              className="btn btn-solid px-4 py-2 text-sm"
              autoFocus
            >
              {labels.close}
            </button>
            <div
              className={
                open === "desktop"
                  ? "w-[min(92vw,calc(80vh*1.6))] overflow-hidden rounded-lg border border-white/10"
                  : "w-[min(92vw,calc(80vh*0.587))] overflow-hidden rounded-[1.5rem] border border-white/15"
              }
            >
              <ScreenMedia screen={screens[open]} sizes="92vw" className="h-auto w-full" />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
