"use client";

import { useEffect } from "react";

// The page re-mounts when the visitor switches language; from the second mount on
// the content cross-fades in.
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

    // The choreography is not needed for the first paint: start it once the page has
    // loaded and the main thread is idle (the hero entrance is pure CSS).
    let idle = 0;
    const start = () => {
      idle = typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(load, { timeout: 800 })
        : window.setTimeout(load, 200);
    };
    const load = () => {
      void import("@/lib/motion").then(({ initMotion }) => {
        if (!cancelled) cleanup = initMotion();
      });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
      if (typeof window.requestIdleCallback === "function") window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup?.();
    };
  }, []);

  return null;
}
