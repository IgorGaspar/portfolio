"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { agent, useAgent } from "@/lib/agent-store";
import { contact } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import { Gasparzinho, type GasparzinhoState } from "./Gasparzinho";
import { ChatBox, type ChatLabels } from "./ChatBox";

const DESKTOP_QUERY = "(min-width: 768px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const FLIGHT_MS = 650;
const MASCOT_PX = 64;

type Point = { x: number; y: number };

/**
 * Flies the mascot element between two screen points (its centre) on a slight arc. The
 * sprite flies facing right, so it is mirrored when the flight heads left.
 * `to` is read every frame, so a target that scrolls with the page is still reached.
 * Returns a function that cancels the flight.
 */
function fly(el: HTMLElement, from: Point, to: () => Point, onDone: () => void) {
  const start = performance.now();
  const mirror = to().x < from.x ? " scaleX(-1)" : "";
  let frame = 0;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / FLIGHT_MS);
    const eased = t * t * (3 - 2 * t);
    const end = to();
    const x = from.x + (end.x - from.x) * eased - MASCOT_PX / 2;
    const y = from.y + (end.y - from.y) * eased - Math.sin(Math.PI * eased) * 48 - MASCOT_PX / 2;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)${mirror}`;
    if (t < 1) frame = requestAnimationFrame(step);
    else onDone();
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

const subscribeDesktop = (onChange: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

type Props = {
  locale: Locale;
  labels: ChatLabels & { title: string; openAgent: string; close: string; email: string };
  /** Lifts the button above a fixed bottom bar on phones (the offers-bot page has one). */
  raised?: boolean;
};

/** Floating agent button plus the side panel (desktop) or bottom sheet (mobile). */
export function AgentDock({ locale, labels, raised = false }: Props) {
  const { panelOpen, draft, status } = useAgent();
  const [buttonVisible, setButtonVisible] = useState(false);
  const [landing, setLanding] = useState(false);
  const [attended, setAttended] = useState(false);
  const flierRef = useRef<HTMLSpanElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );

  // The floating button appears once the inline chat has scrolled out above the
  // viewport: the mascot flies from the chat icon to the corner and rests there. When the
  // chat icon scrolls back into view, the mascot flies back up to take its place.
  useEffect(() => {
    const section = document.getElementById("agent");
    const icon = document.querySelector<HTMLElement>("[data-agent-core]");
    const flier = flierRef.current;
    if (!section || !icon || !flier) return;
    let timer = 0;
    let cancel = () => {};
    let firstCheck = true;
    let wasPast = false;
    let shown = false;

    const reduced = () => window.matchMedia(REDUCED_QUERY).matches;
    const corner = (): Point => ({
      x: window.innerWidth - MASCOT_PX / 2 - 12,
      // 80 px up when the button is raised above the bottom bar on phones.
      y: window.innerHeight - MASCOT_PX / 2 - 12 - (raised && window.innerWidth < 640 ? 68 : 0),
    });
    const iconCentre = (): Point => {
      const rect = icon.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };
    const land = () => {
      flier.style.visibility = "hidden";
      icon.style.removeProperty("visibility");
    };
    const show = (value: boolean) => {
      shown = value;
      setButtonVisible(value);
    };

    const sectionObserver = new IntersectionObserver(([entry]) => {
      const past = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      const arriving = past && !wasPast && !firstCheck;
      const returning = !past && wasPast;
      firstCheck = false;
      wasPast = past;

      if (arriving && !reduced()) {
        window.clearTimeout(timer);
        cancel();
        const from = { x: iconCentre().x, y: -24 };
        flier.style.visibility = "visible";
        cancel = fly(flier, from, corner, land);
        timer = window.setTimeout(() => {
          setLanding(true);
          show(true);
        }, FLIGHT_MS * 0.8);
      } else if (!returning || reduced()) {
        window.clearTimeout(timer);
        show(past);
      }
      // Returning with motion: the button stays until the chat icon is in view (below).
    });

    const iconObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !shown || wasPast || reduced()) return;
        window.clearTimeout(timer);
        cancel();
        // The icon stays hidden until the mascot lands on it.
        icon.style.visibility = "hidden";
        show(false);
        flier.style.visibility = "visible";
        cancel = fly(flier, corner(), iconCentre, land);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    sectionObserver.observe(section);
    iconObserver.observe(icon);
    return () => {
      sectionObserver.disconnect();
      iconObserver.disconnect();
      window.clearTimeout(timer);
      cancel();
      icon.style.removeProperty("visibility");
    };
  }, [raised]);

  // The mascot arrives in flight and settles into its idle float once it has landed.
  useEffect(() => {
    if (!landing) return;
    const timer = window.setTimeout(() => setLanding(false), 900);
    return () => window.clearTimeout(timer);
  }, [landing]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!panelOpen || !dialog) return;
    if (!dialog.open) {
      const active = document.activeElement;
      openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
      dialog.showModal();
    }
    // preventScroll: the panel starts off-screen, and scrolling it into view would shift the dialog.
    dialog.querySelector("textarea")?.focus({ preventScroll: true });
    document.documentElement.style.overflow = "hidden";

    // A phone's on-screen keyboard shrinks the visual viewport but not the fixed layout the
    // dialog is sized to, so the input would sit behind it. Follow the visual viewport.
    const viewport = window.visualViewport;
    const fit = () => {
      if (!viewport) return;
      dialog.style.top = `${viewport.offsetTop}px`;
      dialog.style.height = `${viewport.height}px`;
      dialog.style.bottom = "auto";
    };
    fit();
    viewport?.addEventListener("resize", fit);
    viewport?.addEventListener("scroll", fit);

    return () => {
      document.documentElement.style.overflow = "";
      viewport?.removeEventListener("resize", fit);
      viewport?.removeEventListener("scroll", fit);
      dialog.style.removeProperty("top");
      dialog.style.removeProperty("height");
      dialog.style.removeProperty("bottom");
    };
  }, [panelOpen]);

  const mascot: GasparzinhoState =
    status !== "idle" ? "thinking" : landing ? "flying" : attended ? "happy" : "idle";
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
              data-agent-open
              onClick={() => agent.openPanel()}
              onPointerEnter={() => setAttended(true)}
              onPointerLeave={() => setAttended(false)}
              onFocus={(event) => setAttended(event.currentTarget.matches(":focus-visible"))}
              onBlur={() => setAttended(false)}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className={`fixed right-3 z-30 inline-flex items-center justify-center rounded-2xl ${raised ? "bottom-20 sm:bottom-3" : "bottom-3"}`}
            >
              <m.span
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="inline-flex"
              >
                <Gasparzinho state={mascot} size={64} />
              </m.span>
            </m.button>
          )}
        </AnimatePresence>

        {/* The mascot in flight between the chat icon and the corner (see `fly`). */}
        <span
          ref={flierRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 invisible"
        >
          <Gasparzinho state="flying" size={MASCOT_PX} />
        </span>

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
          <AnimatePresence
            onExitComplete={() => {
              dialogRef.current?.close();
              // The floating button unmounts while the panel is open, so the opener
              // may be gone: fall back to the button that replaced it.
              const opener = openerRef.current;
              const target = opener?.isConnected
                ? opener
                : document.querySelector<HTMLElement>("[data-agent-open]");
              target?.focus({ preventScroll: true });
              openerRef.current = null;
            }}
          >
            {panelOpen && (
              <m.div
                key="agent-panel"
                initial={offscreen}
                animate={{ x: 0, y: 0 }}
                exit={offscreen}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="absolute inset-x-0 bottom-0 flex h-[88svh] max-h-full flex-col rounded-t-2xl border border-accent-2/30 bg-surface p-5 text-text md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-[27rem] md:rounded-none md:border-y-0 md:border-r-0 md:p-6"
              >
                <header className="mb-4 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Gasparzinho state={status !== "idle" ? "thinking" : "idle"} size={44} />
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
