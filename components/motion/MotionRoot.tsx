"use client";

import { useEffect } from "react";

// The page re-mounts when the visitor switches language; from the second mount on
// the content cross-fades in (spec 3.2).
let mountedBefore = false;

/** Loads the scroll choreography after hydration, in its own chunk. Renders nothing. */
export function MotionRoot() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    if (mountedBefore && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .getElementById("main")
        ?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: "ease-out" });
    }
    mountedBefore = true;

    void import("@/lib/motion").then(({ initMotion }) => {
      if (!cancelled) cleanup = initMotion();
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
