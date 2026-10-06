"use client";

import { useLayoutEffect } from "react";

const STORAGE_KEY = "theme";

// Runs while the HTML is parsed, so the saved theme applies before first paint.
const script = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

/**
 * Applies the saved theme. The inline script covers full page loads; the
 * effect covers client-side navigations between locales, where the root
 * layout re-renders and inline scripts do not execute.
 */
export function ThemeScript() {
  useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        document.documentElement.dataset.theme = saved;
      }
    } catch {
      // Storage unavailable: keep the default theme.
    }
  }, []);

  return (
    <script
      // "text/plain" on the client keeps React from warning about a script it will not run.
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
