"use client";

import dynamic from "next/dynamic";

// The floating button and panel (and the animation library they use) load after
// hydration, in their own chunk, to keep the initial JavaScript small.
export const AgentDockLazy = dynamic(
  () => import("./AgentDock").then((module) => module.AgentDock),
  { ssr: false },
);
