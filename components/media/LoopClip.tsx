"use client";

import { useEffect, useRef } from "react";

export type Clip = {
  webm: string;
  mp4: string;
  /** Still frame shown before playback and with reduced motion. */
  poster: string;
  width: number;
  height: number;
};

type Props = {
  clip: Clip;
  /** Text alternative for the whole clip. Leave it out when a parent already describes it. */
  label?: string;
  className?: string;
  videoClassName?: string;
};

/**
 * A short screen recording looping like a GIF (a muted, inline <video> is the same thing at
 * a tenth of the weight). It plays only while on screen and never with reduced motion,
 * where the poster frame stays.
 */
export function LoopClip({ clip, label, className = "", videoClassName = "h-auto w-full" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    // The wrapper carries the description; the video itself is decoration for assistive tech.
    <div role={label ? "img" : undefined} aria-label={label} className={className}>
      <video
        ref={ref}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="metadata"
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        className={videoClassName}
      >
        <source src={clip.webm} type="video/webm" />
        <source src={clip.mp4} type="video/mp4" />
      </video>
    </div>
  );
}
