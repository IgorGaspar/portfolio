import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

// Scroll choreography for the whole page (spec section 3). Everything here is
// progressive enhancement: the server-rendered page is complete without it.
//
// Motion levels (spec 3.0):
//   full    - desktop with a fine pointer: smooth scroll, pins, scrub, cursor
//   light   - phones and tablets: simple entrances, no pin, no smooth scroll
//   reduced - prefers-reduced-motion: 150 ms fades only

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const DESKTOP = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const QUERIES = {
  reduced: "(prefers-reduced-motion: reduce)",
  full: `(prefers-reduced-motion: no-preference) and ${DESKTOP}`,
  light: `(prefers-reduced-motion: no-preference) and (not (${DESKTOP}))`,
  // The pinned horizontal projects need room for a whole case on screen.
  tall: "(min-height: 700px)",
};

type Cleanups = (() => void)[];

const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

/** Elements already on screen when motion starts are left alone, so nothing flashes. */
const onScreen = (el: Element) => el.getBoundingClientRect().top < window.innerHeight * 0.9;

const EASE = "power3.out";

// ── Global ──────────────────────────────────────────────────────────────────

function smoothScroll(cleanups: Cleanups) {
  const lenis = new Lenis({
    lerp: 0.1,
    anchors: true,
    // Scrollable areas keep their own native scroll.
    prevent: (node) => node.closest("dialog, [data-native-scroll]") !== null,
    // Lenis stops by itself while the page is locked (agent panel open).
    autoToggle: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  activeLenis = lenis;
  cleanups.push(() => {
    activeLenis = undefined;
    gsap.ticker.remove(raf);
    lenis.destroy();
  });
}

let activeLenis: Lenis | undefined;

/** Jumps the page to a scroll position without animation, with or without Lenis. */
function jumpTo(top: number) {
  if (activeLenis) activeLenis.scrollTo(top, { immediate: true, force: true });
  else window.scrollTo({ top, behavior: "instant" });
}

function progressBar() {
  gsap.fromTo(
    "#scroll-progress",
    { scaleX: 0 },
    { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
  );
}

/** Nav background after 80 px and the underline of the section in view. Runs at every level. */
function navState(cleanups: Cleanups) {
  const header = document.querySelector<HTMLElement>("[data-nav]");
  if (!header) return;

  const onScroll = () => header.toggleAttribute("data-top", window.scrollY < 80);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const underline = header.querySelector<HTMLElement>("[data-nav-underline]");
  const links = $<HTMLAnchorElement>("[data-nav-link]", header);
  const visible = new Set<string>();

  const update = () => {
    const current = links.find((link) => visible.has(link.hash.slice(1)));
    links.forEach((link) =>
      link === current
        ? link.setAttribute("aria-current", "location")
        : link.removeAttribute("aria-current"),
    );
    if (!underline) return;
    underline.style.opacity = current ? "1" : "0";
    if (current) {
      underline.style.transform = `translateX(${current.offsetLeft}px) scaleX(${current.offsetWidth})`;
    }
  };

  // A section is "in view" while it crosses the middle of the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      update();
    },
    { rootMargin: "-50% 0px -50% 0px" },
  );
  links.forEach((link) => {
    const section = document.getElementById(link.hash.slice(1));
    if (section) observer.observe(section);
  });

  cleanups.push(() => {
    window.removeEventListener("scroll", onScroll);
    observer.disconnect();
    header.removeAttribute("data-top");
    links.forEach((link) => link.removeAttribute("aria-current"));
    if (underline) underline.style.opacity = "0";
  });
}

/**
 * Custom cursor that replaces the native one on desktop: a dot at the pointer
 * and a ring that trails it. The ring grows over links and buttons, and turns
 * into a labelled disc over elements with data-cursor. Inside the agent panel
 * and over text fields the native cursor comes back.
 */
function customCursor(cleanups: Cleanups) {
  const root = document.documentElement;
  const ring = document.createElement("div");
  const dot = document.createElement("div");
  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);

  const moveX = gsap.quickTo(ring, "x", { duration: 0.25, ease: EASE });
  const moveY = gsap.quickTo(ring, "y", { duration: 0.25, ease: EASE });
  const NATIVE = "dialog, input, textarea, select";
  const INTERACTIVE = "a, button, summary, label, [role=button]";
  const ON_ACCENT = ".btn, [aria-pressed=true]";

  const onMove = (event: PointerEvent) => {
    const target = event.target as Element | null;
    const native = Boolean(target?.closest(NATIVE));
    const labelled = native ? null : target?.closest<HTMLElement>("[data-cursor]");

    // The native cursor is only hidden once the custom one has a position.
    root.toggleAttribute("data-custom-cursor", !native);
    dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    moveX(event.clientX);
    moveY(event.clientY);

    ring.textContent = labelled?.dataset.cursor ?? "";
    ring.toggleAttribute("data-active", Boolean(labelled));
    ring.toggleAttribute("data-hover", !labelled && Boolean(target?.closest(INTERACTIVE)));
    // Over accent-coloured controls the cursor switches to the dark tone to stay visible.
    const onAccent = Boolean(target?.closest(ON_ACCENT));
    ring.toggleAttribute("data-contrast", onAccent);
    dot.toggleAttribute("data-contrast", onAccent);
    ring.style.opacity = native ? "0" : "1";
    dot.style.opacity = native || labelled ? "0" : "1";
  };
  const onLeave = () => {
    root.removeAttribute("data-custom-cursor");
    ring.style.opacity = dot.style.opacity = "0";
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  root.addEventListener("pointerleave", onLeave);
  cleanups.push(() => {
    window.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    root.removeAttribute("data-custom-cursor");
    ring.remove();
    dot.remove();
  });
}

/** Layout changes that ScrollTrigger cannot see on its own. */
function refreshOnLayoutChange(cleanups: Cleanups) {
  let timer = 0;
  const refresh = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
  };

  // The inline chat grows as answers arrive; accordions open inside project cards.
  // Both are watched by size, so the refresh happens once the change has settled.
  const chat = document.getElementById("agent");
  const observer = new ResizeObserver(refresh);
  if (chat) observer.observe(chat);
  $("[data-project-text-inner]").forEach((text) => observer.observe(text));
  void document.fonts.ready.then(refresh);

  cleanups.push(() => {
    window.clearTimeout(timer);
    observer.disconnect();
  });
}

// ── Entrances ───────────────────────────────────────────────────────────────

/** Section titles: each line rises 24 px (full) or the whole title does (light). */
function titles(full: boolean) {
  for (const title of $('[data-reveal="title"]')) {
    if (onScreen(title)) continue;
    const scrollTrigger = { trigger: title, start: "top 80%", once: true };

    if (!full) {
      gsap.from(title, { y: 24, opacity: 0, duration: 0.6, ease: EASE, scrollTrigger });
      continue;
    }

    SplitText.create(title, {
      type: "lines",
      autoSplit: true,
      onSplit: (split) =>
        gsap.from(split.lines, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: EASE,
          stagger: 0.08,
          scrollTrigger,
        }),
    });
  }
}

function reveals() {
  for (const el of $('[data-reveal="up"]')) {
    if (onScreen(el)) continue;
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: EASE,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  }
}

/** Reduced motion: the only movement left is a 150 ms fade. */
function fadeReveals() {
  for (const el of $("[data-reveal], [data-project]")) {
    if (onScreen(el)) continue;
    gsap.from(el, {
      opacity: 0,
      duration: 0.15,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  }
}

function agentBox() {
  const box = document.querySelector<HTMLElement>('[data-reveal="agent"]');
  if (!box || onScreen(box)) return;

  gsap
    .timeline({ scrollTrigger: { trigger: box, start: "top 75%", once: true } })
    .from(box, { y: 40, opacity: 0, duration: 0.7, ease: EASE })
    .from(
      $("ul button", box),
      { y: 12, opacity: 0, duration: 0.4, ease: EASE, stagger: 0.08, clearProps: "all" },
      "-=0.3",
    );
}

/** Contact title uses the same mask as the hero headline, closing the loop. */
function contactTitle() {
  const title = document.querySelector<HTMLElement>('[data-reveal="mask"]');
  if (!title || onScreen(title)) return;

  gsap.fromTo(
    title,
    { clipPath: "inset(0 0 100% 0)", y: 24 },
    {
      clipPath: "inset(0 0 -10% 0)",
      y: 0,
      duration: 0.9,
      ease: EASE,
      clearProps: "clipPath",
      scrollTrigger: { trigger: title, start: "top 85%", once: true },
    },
  );
}

// ── What I do ───────────────────────────────────────────────────────────────

const splitWords = (el: Element) => SplitText.create(el, { type: "words", aria: "none" }).words;

/** Desktop: the section is pinned and one pillar at a time is revealed word by word. */
function pillarsPinned(cleanups: Cleanups) {
  const section = document.querySelector<HTMLElement>("[data-pillars]");
  if (!section) return;
  const pillars = $("[data-pillar]", section);

  section.setAttribute("data-pinned", "");
  cleanups.push(() => section.removeAttribute("data-pinned"));

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: section, start: "top top", end: "+=150%", pin: true, scrub: true },
  });

  pillars.forEach((pillar, i) => {
    const words = splitWords(pillar.querySelector("[data-pillar-text]")!);
    const number = pillar.querySelector("[data-pillar-number]");

    if (i > 0) {
      timeline
        .fromTo(pillar, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
        .from(number, { yPercent: 100, duration: 0.2 }, "<");
    }
    timeline.fromTo(words, { opacity: 0.15 }, { opacity: 1, duration: 0.1, stagger: 0.03 });
    if (i < pillars.length - 1) timeline.to(pillar, { autoAlpha: 0, duration: 0.2 }, "+=0.3");
  });

  timeline.fromTo(
    "[data-pillars-progress]",
    { scaleY: 0 },
    { scaleY: 1, duration: timeline.duration() },
    0,
  );
}

/** Mobile: no pin; each pillar reveals its words while it crosses the screen. */
function pillarsLight() {
  for (const text of $("[data-pillar-text]")) {
    gsap.fromTo(
      splitWords(text),
      { opacity: 0.15 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: { trigger: text, start: "top 85%", end: "top 40%", scrub: true },
      },
    );
  }
}

// ── Projects ────────────────────────────────────────────────────────────────

/**
 * Architecture diagram: the connectors draw themselves in sequence, then a pulse
 * travels along them in a loop. The resting state is always the complete
 * diagram: connectors are only hidden while the diagram is still ahead, and
 * once drawn they go back to plain SVG with no animation styles left on them.
 */
function animateDiagram(svg: SVGSVGElement, cleanups: Cleanups, alreadyReached: boolean) {
  const edges = $<SVGPathElement>("[data-edge]", svg);
  const pulse = svg.querySelector<SVGCircleElement>("[data-pulse]");
  const DRAW_PROPS = "strokeDasharray,strokeDashoffset,opacity";
  let drawn = false;
  let visible = false;

  const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
  if (pulse) {
    for (const edge of edges) {
      const length = edge.getTotalLength();
      const travel = { progress: 0 };
      loop.to(travel, {
        progress: 1,
        duration: 0.7,
        ease: "power1.inOut",
        onStart: () => void gsap.set(pulse, { opacity: 1 }),
        onUpdate: () => {
          const point = edge.getPointAtLength(length * travel.progress);
          pulse.setAttribute("cx", String(point.x));
          pulse.setAttribute("cy", String(point.y));
        },
      });
    }
  }

  // The pulse runs only while the diagram is drawn and on screen.
  const syncPulse = () => (drawn && visible && pulse ? loop.play() : loop.pause());
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPulse();
  });
  observer.observe(svg);

  const finish = () => {
    drawn = true;
    gsap.set(edges, { clearProps: DRAW_PROPS });
    syncPulse();
  };

  const draw = gsap.timeline({ paused: true, onComplete: finish });
  if (alreadyReached) {
    finish();
  } else {
    for (const edge of edges) {
      const length = edge.getTotalLength();
      gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
      draw
        .set(edge, { opacity: 1 })
        .to(edge, { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" });
    }
  }

  cleanups.push(() => {
    observer.disconnect();
    loop.kill();
    draw.kill();
    gsap.set(edges, { clearProps: DRAW_PROPS });
    if (pulse) gsap.set(pulse, { clearProps: "opacity" });
  });

  /** Starts the drawing if it has not happened yet. Safe to call repeatedly. */
  return () => {
    if (!drawn && !draw.isActive()) draw.play();
  };
}

/** Mobile and tablet: cases stacked, each one fading up as it enters. */
function projectsStacked(cleanups: Cleanups) {
  for (const card of $("[data-project]")) {
    if (!onScreen(card)) {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: EASE,
        clearProps: "transform",
        scrollTrigger: { trigger: card, start: "top 85%", once: true },
      });
    }
  }
  for (const svg of $<SVGSVGElement>("[data-diagram]")) {
    // A diagram the visitor has already reached or passed is shown complete right away.
    const reached = svg.getBoundingClientRect().top < window.innerHeight * 0.7;
    const draw = animateDiagram(svg, cleanups, reached);
    if (!reached) {
      ScrollTrigger.create({ trigger: svg, start: "top 70%", once: true, onEnter: draw });
    }
  }
}

/**
 * Desktop: the section is pinned and the scroll plays a script, measured in
 * pixels of scroll: read case 1 (its text scrolls inside the card), slide to
 * case 2, read it, and so on. Because the script is in pixels, opening an
 * accordion only makes the current "read" step longer; nothing before it moves.
 */
function projectsHorizontal(cleanups: Cleanups) {
  const section = document.querySelector<HTMLElement>("[data-projects]");
  const viewport = section?.querySelector<HTMLElement>("[data-projects-viewport]");
  const track = section?.querySelector<HTMLElement>("[data-projects-track]");
  if (!section || !viewport || !track) return;

  const cards = $("[data-project]", track);
  const texts = cards.map((card) => card.querySelector<HTMLElement>("[data-project-text]")!);
  const images = cards.map((card) => $("img", card));
  const diagrams = cards.map((card) =>
    $<SVGSVGElement>("[data-diagram]", card).map((svg) => animateDiagram(svg, cleanups, false)),
  );

  section.setAttribute("data-horizontal", "");

  // Scroll spent resting on a case before and after its text moves.
  const DWELL = 120;
  type Step = { kind: "read" | "slide"; card: number; length: number; from: number; to: number };
  let steps: Step[] = [];
  let total = 0;
  // Where the scroll currently is in the script: which step, and how far into it.
  let place = { step: 0, offset: 0 };

  const measure = () => {
    const origin = track.getBoundingClientRect().left;
    const maxX = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const offsets = cards.map((card) => Math.min(card.getBoundingClientRect().left - origin, maxX));

    steps = [];
    cards.forEach((_, i) => {
      const overflow = Math.max(0, texts[i].scrollHeight - texts[i].clientHeight);
      steps.push({ kind: "read", card: i, length: overflow + DWELL * 2, from: 0, to: overflow });
      if (i < cards.length - 1) {
        steps.push({
          kind: "slide",
          card: i + 1,
          length: offsets[i + 1] - offsets[i],
          from: offsets[i],
          to: offsets[i + 1],
        });
      }
    });
    total = steps.reduce((sum, step) => sum + step.length, 0);
    return total;
  };

  const clamp = gsap.utils.clamp;

  const apply = (scrolled: number) => {
    let remaining = clamp(0, total, scrolled);
    let x = 0;
    const arrival: number[] = cards.map((_, i) => (i === 0 ? 1 : 0));

    let placed = false;

    for (const [index, step] of steps.entries()) {
      if (!placed && (remaining <= step.length || index === steps.length - 1)) {
        // While reading, the place is the text position, so text added below does not move it.
        const offset = step.kind === "read" ? Math.min(remaining, DWELL + step.to) : remaining;
        place = { step: index, offset };
        placed = true;
      }
      if (step.kind === "read") {
        texts[step.card].scrollTop = clamp(0, step.to, remaining - DWELL);
      } else {
        const progress = step.length > 0 ? clamp(0, 1, remaining / step.length) : 1;
        if (remaining > 0) x = step.from + (step.to - step.from) * progress;
        arrival[step.card] = remaining > 0 ? progress : 0;
      }
      remaining -= step.length;
    }

    gsap.set(track, { x: -x });
    cards.forEach((_, i) => {
      // Images open up from a 10% inset as their case arrives.
      if (images[i].length > 0) {
        gsap.set(images[i], { clipPath: `inset(${(1 - arrival[i]) * 10}%)` });
      }
      // Diagrams start drawing as soon as their case is coming into view.
      if (arrival[i] > 0.25) diagrams[i].forEach((draw) => draw());
    });
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: () => `+=${measure()}`,
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => apply(self.scroll() - self.start),
    onRefresh: (self) => apply(self.scroll() - self.start),
  });

  // When the script changes length (an accordion opened, the window resized),
  // the page goes back to the same place in it, so what is on screen stays put.
  let saved: typeof place | undefined;
  const savePlace = () => (saved = trigger.isActive ? { ...place } : undefined);
  const restorePlace = () => {
    const step = saved && steps[saved.step];
    if (!saved || !step) return;
    const before = steps.slice(0, saved.step).reduce((sum, s) => sum + s.length, 0);
    const scrolled = before + Math.min(saved.offset, step.length);
    if (Math.abs(trigger.start + scrolled - trigger.scroll()) > 1) jumpTo(trigger.start + scrolled);
    apply(scrolled);
  };
  ScrollTrigger.addEventListener("refreshInit", savePlace);
  ScrollTrigger.addEventListener("refresh", restorePlace);
  cleanups.push(() => {
    ScrollTrigger.removeEventListener("refreshInit", savePlace);
    ScrollTrigger.removeEventListener("refresh", restorePlace);
  });

  // Keyboard only: focusing something in another case scrolls the page to it.
  // Mouse clicks (such as opening an accordion) leave the page where it is.
  const onFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (!target.matches(":focus-visible")) return;
    const index = cards.findIndex((card) => card.contains(target));
    if (index < 0) return;

    let offset = 0;
    for (const step of steps) {
      if (step.kind === "read" && step.card === index) {
        const text = texts[index];
        const position = text.contains(target)
          ? target.getBoundingClientRect().top -
            text.getBoundingClientRect().top +
            text.scrollTop -
            text.clientHeight / 2
          : 0;
        offset += DWELL + clamp(0, step.to, position);
        break;
      }
      offset += step.length;
    }
    window.scrollTo({ top: trigger.start + offset });
  };
  // The browser may still scroll the clipped containers to reveal the focused element.
  const resetScroll = (event: Event) => ((event.currentTarget as HTMLElement).scrollLeft = 0);

  track.addEventListener("focusin", onFocus);
  section.addEventListener("scroll", resetScroll);
  viewport.addEventListener("scroll", resetScroll);
  cleanups.push(() => {
    track.removeEventListener("focusin", onFocus);
    section.removeEventListener("scroll", resetScroll);
    viewport.removeEventListener("scroll", resetScroll);
    section.removeAttribute("data-horizontal");
    gsap.set(track, { clearProps: "transform" });
    gsap.set(images.flat(), { clearProps: "clipPath" });
    texts.forEach((text) => (text.scrollTop = 0));
  });
}

// ── Lists with a progress line (how I build, journey, work with me) ─────────

type StepHandler = (index: number, step: HTMLElement) => void;

/**
 * A line that fills with the scroll; each step lights up when the line reaches
 * it. `onFirstActive` runs once per step. Works for vertical and horizontal lists.
 */
function progressList(root: HTMLElement, cleanups: Cleanups, onFirstActive?: StepHandler) {
  const fill = root.querySelector<HTMLElement>("[data-line-fill]");
  const steps = $("[data-step]", root);
  if (!fill || steps.length === 0) return;

  const seen = new Set<number>();
  let horizontal = false;
  let thresholds: number[] = [];

  const measure = () => {
    const box = root.getBoundingClientRect();
    horizontal = fill.offsetWidth > fill.offsetHeight;
    thresholds = steps.map((step) => {
      const rect = step.getBoundingClientRect();
      return horizontal ? (rect.left - box.left) / box.width : (rect.top - box.top) / box.height;
    });
  };

  root.setAttribute("data-progress-ready", "");

  const apply = (progress: number) => {
    gsap.set(fill, horizontal ? { scaleX: progress, scaleY: 1 } : { scaleY: progress, scaleX: 1 });
    steps.forEach((step, i) => {
      const active = progress > 0 && progress >= thresholds[i];
      step.classList.toggle("is-active", active);
      if (active && !seen.has(i)) {
        seen.add(i);
        onFirstActive?.(i, step);
      }
    });
  };

  const trigger = ScrollTrigger.create({
    trigger: root,
    start: "top 70%",
    end: "bottom 55%",
    onRefresh: (self) => {
      measure();
      apply(self.progress);
    },
    onUpdate: (self) => apply(self.progress),
  });
  measure();
  apply(trigger.progress);

  cleanups.push(() => {
    root.removeAttribute("data-progress-ready");
    steps.forEach((step) => step.classList.remove("is-active"));
  });
}

function progressLists(full: boolean, cleanups: Cleanups) {
  for (const root of $("[data-progress-list]")) {
    if (root.closest("[data-how-i-build]"))
      progressList(root, cleanups, terminalTyping(full, cleanups));
    else if (root.hasAttribute("data-journey"))
      progressList(root, cleanups, journeyStep(full, cleanups));
    else progressList(root, cleanups, workWithMeStep(root));
  }
}

/** Desktop terminal: types one command as each step lights up. */
function terminalTyping(full: boolean, cleanups: Cleanups): StepHandler | undefined {
  const lines = $("[data-terminal-line]");
  if (!full || lines.length === 0) return undefined;

  const texts = lines.map((line) => line.textContent ?? "");
  lines.forEach((line) => (line.style.visibility = "hidden"));
  cleanups.push(() =>
    lines.forEach((line, i) => {
      line.style.visibility = "";
      line.textContent = texts[i];
    }),
  );

  return (index) => {
    const line = lines[index];
    if (!line) return;
    const text = texts[index];
    const typed = { length: 0 };
    line.textContent = "";
    line.style.visibility = "";
    gsap.to(typed, {
      length: text.length,
      duration: text.length * 0.025,
      ease: "none",
      onUpdate: () => void (line.textContent = text.slice(0, Math.round(typed.length))),
    });
  };
}

/** Journey: the card slides in from the side; the Farmarcas stat counts from 40 to 8. */
function journeyStep(full: boolean, cleanups: Cleanups): StepHandler {
  // The final text is kept aside and always put back: when the motion level
  // changes mid-count (a window resize), the counter must not keep a half-way value.
  const counters = new Map($("[data-counter]").map((el) => [el, el.textContent ?? ""]));
  const counts: gsap.core.Tween[] = [];
  cleanups.push(() => {
    counts.forEach((count) => count.kill());
    counters.forEach((text, el) => (el.textContent = text));
  });

  return (index, step) => {
    const card = step.querySelector("[data-step-card]");
    if (card && !onScreenAbove(step)) {
      gsap.from(card, {
        x: full && index % 2 === 1 ? -24 : 24,
        duration: 0.6,
        ease: EASE,
        clearProps: "transform",
      });
    }

    const counter = step.querySelector<HTMLElement>("[data-counter]");
    const original = counter && counters.get(counter);
    const match = original?.match(/^(\d+)(\D+)(\d+)(\D*)$/);
    if (!counter || !original || !match) return;
    const [, from, middle, to, suffix] = match;
    const value = { n: Number(from) };
    counts.push(
      gsap.to(value, {
        n: Number(to),
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () =>
          void (counter.textContent = `${from}${middle}${Math.round(value.n)}${suffix}`),
        onComplete: () => void (counter.textContent = original),
        // If anything stops the count early, the real number is shown, never a half-way one.
        onInterrupt: () => void (counter.textContent = original),
      }),
    );
  };
}

/** True when the element is already above the viewport (reached by a jump, not by scrolling in). */
const onScreenAbove = (el: Element) => el.getBoundingClientRect().bottom < 0;

/** Work with me: the scheduling button pulses once when the last step lights up. */
function workWithMeStep(root: HTMLElement): StepHandler {
  const last = $("[data-step]", root).length - 1;
  return (index) => {
    if (index !== last) return;
    gsap.fromTo(
      "[data-pulse]",
      { scale: 1 },
      {
        scale: 1.06,
        duration: 0.3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
        clearProps: "scale",
      },
    );
  };
}

// ── Stack and journey photo ─────────────────────────────────────────────────

function stackPills() {
  const pills = $("[data-pill]");
  if (pills.length === 0 || onScreen(pills[0])) return;

  // CSS transitions on the pills would fight the tween, so they are off until it ends.
  gsap.set(pills, { transition: "none" });
  gsap.from(pills, {
    opacity: 0,
    scale: 0.9,
    duration: 0.4,
    ease: EASE,
    stagger: { each: 0.02, from: "random" },
    clearProps: "all",
    scrollTrigger: { trigger: pills[0].closest("dl"), start: "top 80%", once: true },
  });
}

function photoParallax() {
  gsap.to("[data-parallax]", {
    y: -30,
    ease: "none",
    scrollTrigger: { trigger: "#journey", start: "top bottom", end: "bottom top", scrub: true },
  });
}

// ── Entry point ─────────────────────────────────────────────────────────────

/** Starts every effect for the current motion level. Returns a function that undoes all of it. */
export function initMotion() {
  const media = gsap.matchMedia();

  media.add(QUERIES, (context) => {
    const { reduced, full, tall } = context.conditions as Record<keyof typeof QUERIES, boolean>;
    const cleanups: Cleanups = [];
    const cleanup = () => cleanups.forEach((fn) => fn());

    navState(cleanups);

    if (reduced) {
      fadeReveals();
      return cleanup;
    }

    if (full) {
      smoothScroll(cleanups);
      customCursor(cleanups);
    }
    progressBar();
    titles(full);
    reveals();
    agentBox();

    if (full) pillarsPinned(cleanups);
    else pillarsLight();

    if (full && tall) projectsHorizontal(cleanups);
    else projectsStacked(cleanups);

    progressLists(full, cleanups);
    stackPills();
    if (full) photoParallax();
    contactTitle();

    refreshOnLayoutChange(cleanups);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return cleanup;
  });

  return () => media.revert();
}
