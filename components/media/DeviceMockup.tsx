import Image from "next/image";
import { type Clip, LoopClip } from "./LoopClip";

export type Screen = {
  /** Screenshot; with a clip, use the clip's first frame here and as its poster. */
  image: { src: string; width: number; height: number };
  clip?: Clip;
};

export type Screens = { desktop: Screen; mobile: Screen };

const fill = "h-full w-full object-cover object-top";

function ScreenMedia({ screen, sizes }: { screen: Screen; sizes: string }) {
  if (screen.clip) return <LoopClip clip={screen.clip} className="h-full" videoClassName={fill} />;
  return (
    <Image
      src={screen.image.src}
      alt=""
      width={screen.image.width}
      height={screen.image.height}
      sizes={sizes}
      className={fill}
    />
  );
}

type Props = {
  screens: Screens;
  /** Describes both screens at once; the devices themselves are decoration. */
  label: string;
  /** Rendered size of the whole mockup, for the image `sizes` hints. */
  width?: string;
  className?: string;
};

/**
 * The same product on a laptop and on a phone, side by side, to show the layout works on
 * every screen. Frames are plain CSS, so the only weight is the screenshots or clips.
 */
export function DeviceMockup({ screens, label, width = "540px", className = "" }: Props) {
  return (
    <div role="img" aria-label={label} className={`relative pr-[14%] pb-[4%] ${className}`}>
      {/* Laptop: lid with bezel, then the base. */}
      <div className="rounded-t-[1.1rem] border border-white/10 bg-[#0d0f14] p-[2.2%] pb-[3%] shadow-2xl">
        <div className="aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-black">
          <ScreenMedia screen={screens.desktop} sizes={`calc(${width} * 0.84)`} />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative -mx-[5%] h-[0.9rem] rounded-b-[1rem] border border-t-0 border-white/10 bg-gradient-to-b from-[#2a2e37] to-[#14161c] shadow-xl"
      >
        <span className="absolute top-0 left-1/2 h-[35%] w-[16%] -translate-x-1/2 rounded-b-md bg-black/40" />
      </div>

      {/* Phone, overlapping the laptop's right edge. */}
      <div className="absolute right-0 bottom-0 w-[27%] rounded-[1.6rem] border border-white/15 bg-[#0d0f14] p-[1.6%] shadow-2xl ring-1 ring-black/40">
        <div className="aspect-[390/664] overflow-hidden rounded-[1.25rem] bg-black">
          <ScreenMedia screen={screens.mobile} sizes={`calc(${width} * 0.27)`} />
        </div>
      </div>
    </div>
  );
}
