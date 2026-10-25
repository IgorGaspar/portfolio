"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Text alternative for the whole clip. */
  label: string;
  className?: string;
};

/**
 * The offers bot at work in a real group, looping like a GIF (a muted, inline <video> is
 * the same thing at a tenth of the weight). It plays only while on screen and never with
 * reduced motion, where the poster frame stays.
 */
export function BotClip({ label, className = "" }: Props) {
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
    <div role="img" aria-label={label} className={className}>
      <video
        ref={ref}
        aria-hidden="true"
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/robo/bot-poster.webp"
        width={360}
        height={748}
        className="h-auto w-full"
      >
        <source src="/media/robo/bot.webm" type="video/webm" />
        <source src="/media/robo/bot.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
