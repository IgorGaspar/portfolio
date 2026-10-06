import type { ProjectId } from "./projects";

type TitledText = { title: string; body: string };

export type ProjectCopy = {
  badge: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  engineering: string[];
  stack: string[];
  /** Note shown next to the public link, e.g. "(site in Portuguese)". */
  linkNote?: string;
  mediaAlt?: string;
  diagram?: {
    /** Text alternative describing the flow. */
    label: string;
    /** Node labels keyed by node id (see components/diagrams). */
    nodes: Record<string, string[]>;
  };
};

export type JourneyItem = {
  period: string;
  /** Supports **bold** inline markup. */
  heading: string;
  body?: string;
  stat?: string;
};

export type Dictionary = {
  meta: { title: string; description: string };
  nav: {
    projects: string;
    howIBuild: string;
    journey: string;
    contact: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaHire: string;
    ctaProject: string;
    agentLink: string;
  };
  agent: {
    title: string;
    support: string;
    chips: string[];
    placeholder: string;
    notice: string;
  };
  whatIDo: { title: string; pillars: TitledText[] };
  projects: {
    title: string;
    subtitle: string;
    items: Record<ProjectId, ProjectCopy>;
  };
  howIBuild: {
    title: string;
    subtitle: string;
    steps: TitledText[];
    footer: string;
    terminal: string[];
  };
  stack: { title: string; groups: { label: string; items: string[] }[] };
  journey: {
    title: string;
    subtitle: string;
    items: JourneyItem[];
  };
  workWithMe: { title: string; steps: TitledText[]; cta: string };
  contact: {
    title: string;
    text: string;
    emailLabel: string;
    location: string;
    languages?: string;
    ctaHire: string;
    ctaProject: string;
    closing: string;
  };
  footer: { text: string };
  /** Functional microcopy that is not part of the section copy. */
  ui: {
    skipToContent: string;
    mainNav: string;
    menu: string;
    language: string;
    themeToggle: string;
    problem: string;
    solution: string;
    engineering: string;
    lookInside: string;
    stack: string;
    links: string;
    copy: string;
    copied: string;
    send: string;
    stop: string;
    openAgent: string;
    close: string;
    you: string;
    agentName: string;
    draftHire: string;
    draftProject: string;
    subjectHire: string;
    subjectProject: string;
    photoAlt: string;
    notFoundTitle: string;
    notFoundText: string;
    notFoundBack: string;
  };
};
