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

/** Picks the 3D scene or the static image for this device (spec 3.3.1, fallbacks). */
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
    // Wait for idle time so the scene never competes with the first paint.
    const start = () => setMode(chooseMode());
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
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
