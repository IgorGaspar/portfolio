"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// three.js and the scene load on demand, after the page is interactive.
const NeuralScene = dynamic(() => import("./NeuralScene"), { ssr: false });

type Mode =
  { kind: "pending" } | { kind: "static" } | { kind: "scene"; count: number; interactive: boolean };

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Picks the 3D scene or the static image for this device (with fallbacks). */
function chooseMode(): Mode {
  const hints = navigator as NavigatorHints;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const weak = (hints.hardwareConcurrency ?? 8) <= 4 || (hints.deviceMemory ?? 8) <= 4;

  const probe = document.createElement("canvas");
  const webgl = Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));

  if (reducedMotion || !webgl || hints.connection?.saveData || (touch && weak)) {
    return { kind: "static" };
  }
  const desktop = !touch && window.innerWidth >= 1024;
  return { kind: "scene", count: desktop ? 4000 : 1200, interactive: !touch };
}

/**
 * Background of the hero and the contact section: the WebGL neural core when
 * the device can afford it, a pre-rendered image otherwise. Nothing here is
 * needed for the content, which is already on the page.
 */
export function NeuralBackdrop() {
  const [mode, setMode] = useState<Mode>({ kind: "pending" });

  useEffect(() => {
    // The scene is decoration (about 240 KB of JavaScript): load it on the first sign of
    // life from the visitor, or after a long idle wait, so it never competes with the
    // first paint or the first interactions.
    // The static image costs no JavaScript, so it needs no waiting.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setMode({ kind: "static" }), 0);
      return () => window.clearTimeout(id);
    }
    const events = ["pointerdown", "pointermove", "scroll", "keydown", "touchstart"] as const;
    let timer = 0;
    const start = () => {
      cleanup();
      setMode(chooseMode());
    };
    const cleanup = () => {
      for (const name of events) window.removeEventListener(name, onInput);
      window.clearTimeout(timer);
    };
    const onInput = () => {
      // Let the input be handled first; the scene mounts right after.
      if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 500 });
      else setTimeout(start, 100);
      for (const name of events) window.removeEventListener(name, onInput);
    };
    for (const name of events) window.addEventListener(name, onInput, { passive: true });
    timer = window.setTimeout(start, 12_000);
    return cleanup;
  }, []);

  // The static image is drawn by CSS inside the hero and contact sections.
  useEffect(() => {
    if (mode.kind !== "static") return;
    document.documentElement.dataset.neural = "static";
    return () => {
      delete document.documentElement.dataset.neural;
    };
  }, [mode.kind]);

  if (mode.kind !== "scene") return null;
  return (
    <NeuralScene
      count={mode.count}
      interactive={mode.interactive}
      onFailure={() => setMode({ kind: "static" })}
    />
  );
}
