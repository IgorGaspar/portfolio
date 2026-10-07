"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { agent, useAgent } from "@/lib/agent-store";
import { contact } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import { FLIGHT_MS, startFlight } from "../three/flight";
import { AgentIcon } from "./AgentIcon";
import { ChatBox, type ChatLabels } from "./ChatBox";

const DESKTOP_QUERY = "(min-width: 768px)";

const subscribeDesktop = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type Props = {
  locale: Locale;
  labels: ChatLabels & { title: string; openAgent: string; close: string; email: string };
};

/** Floating agent button plus the side panel (desktop) or bottom sheet (mobile). */
export function AgentDock({ locale, labels }: Props) {
  const { panelOpen, draft } = useAgent();
  const [buttonVisible, setButtonVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );

  // The floating button appears once the inline chat has scrolled out above the
  // viewport. Where the 3D scene is running, the agent's core flies down from the
  // chat to the corner first, and the button fades in as it lands.
  useEffect(() => {
    const section = document.getElementById("agent");
    if (!section) return;
    let timer = 0;
    let firstCheck = true;
    let wasPast = false;

    const observer = new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      const arriving = past && !wasPast && !firstCheck;
      firstCheck = false;
      wasPast = past;
      window.clearTimeout(timer);

      const icon = document.querySelector("[data-agent-core]")?.getBoundingClientRect();
      const flying =
        arriving &&
        icon !== undefined &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        startFlight(
          { x: icon.left + icon.width / 2, y: -24 },
          // Centre of the button: 56 px wide, 20 px from the corner.
          { x: window.innerWidth - 48, y: window.innerHeight - 48 },
        );

      if (flying) timer = window.setTimeout(() => setButtonVisible(true), FLIGHT_MS * 0.8);
      else setButtonVisible(past);
    });
    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!panelOpen || !dialog) return;
    if (!dialog.open) dialog.showModal();
    // preventScroll: the panel starts off-screen, and scrolling it into view would shift the dialog.
    dialog.querySelector("textarea")?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [panelOpen]);

  const offscreen = isDesktop ? { x: "100%" } : { y: "100%" };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {buttonVisible && !panelOpen && (
            <m.button
              key="agent-button"
              type="button"
              aria-label={labels.openAgent}
              onClick={() => agent.openPanel()}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="fixed bottom-5 right-5 z-30 inline-flex size-14 items-center justify-center rounded-full border border-accent-2/60 bg-surface shadow-[0_0_32px_-6px_var(--accent-2)]"
            >
              <AgentIcon className="size-8" />
            </m.button>
          )}
        </AnimatePresence>

        <dialog
          ref={dialogRef}
          aria-labelledby="agent-panel-title"
          onCancel={(event) => {
            // Escape closes through the store so the panel can animate out.
            event.preventDefault();
            agent.closePanel();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) agent.closePanel();
          }}
          className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-clip bg-transparent backdrop:bg-black/50"
        >
          <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
            {panelOpen && (
              <m.div
                key="agent-panel"
                initial={offscreen}
                animate={{ x: 0, y: 0 }}
                exit={offscreen}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="absolute inset-x-0 bottom-0 flex h-[88svh] flex-col rounded-t-2xl border border-accent-2/30 bg-surface p-5 text-text md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[27rem] md:rounded-none md:border-y-0 md:border-r-0 md:p-6"
              >
                <header className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AgentIcon className="size-9 shrink-0" />
                    <h2 id="agent-panel-title" className="text-xl font-semibold">
                      {labels.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={agent.closePanel}
                    aria-label={labels.close}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:text-text"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </header>

                <ChatBox locale={locale} labels={labels} variant="panel" initialDraft={draft} />

                <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
                  {labels.email}:{" "}
                  <a href={`mailto:${contact.email}`} className="link">
                    {contact.email}
                  </a>
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </dialog>
      </MotionConfig>
    </LazyMotion>
  );
}
