// Locale-independent project data (section 6 of the spec).
// Localized copy lives in content/pt.ts and content/en.ts.

import type { Screens } from "@/components/media/DeviceMockup";

export const projectIds = ["monai", "b2b", "esteticaah"] as const;
export type ProjectId = (typeof projectIds)[number];

export type ProjectData = {
  id: ProjectId;
  /** Short name used in chips (stack section). */
  name: { pt: string; en: string };
  link?: { label: string; href: string };
  /** The product on a laptop and on a phone (screenshots or short recordings). */
  screens?: Screens;
  diagram?: "b2b" | "esteticaah";
  /** Technologies used, matched against the stack section pills. */
  technologies: string[];
};

export const projects: Record<ProjectId, ProjectData> = {
  monai: {
    id: "monai",
    name: { pt: "MonAI", en: "MonAI" },
    link: { label: "monai.page", href: "https://monai.page" },
    screens: {
      desktop: {
        image: { src: "/media/monai.webp", width: 1072, height: 670 },
        clip: {
          webm: "/media/monai-agente.webm",
          mp4: "/media/monai-agente.mp4",
          poster: "/media/monai.webp",
          width: 1072,
          height: 670,
        },
      },
      mobile: {
        image: { src: "/media/monai-mobile.webp", width: 390, height: 664 },
        clip: {
          webm: "/media/monai-agente-mobile.webm",
          mp4: "/media/monai-agente-mobile.mp4",
          poster: "/media/monai-mobile.webp",
          width: 390,
          height: 664,
        },
      },
    },
    technologies: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Prisma",
      "PostgreSQL (RLS)",
      "NextAuth",
      "Anthropic SDK",
      "Docker",
      "VPS + Coolify",
      "GitHub Actions",
      "Vitest",
    ],
  },
  b2b: {
    id: "b2b",
    name: { pt: "Agente B2B", en: "B2B Agent" },
    screens: {
      desktop: { image: { src: "/media/b2b.webp", width: 960, height: 702 } },
      mobile: { image: { src: "/media/b2b-mobile.webp", width: 390, height: 1013 } },
    },
    diagram: "b2b",
    technologies: [
      "Python",
      "FastAPI",
      "python-telegram-bot",
      "Anthropic SDK",
      "Supabase (PostgreSQL)",
      "APScheduler",
      "Tavily",
      "Railway",
      "pytest",
    ],
  },
  esteticaah: {
    id: "esteticaah",
    name: { pt: "EstetiCaah", en: "EstetiCaah" },
    link: { label: "esteticaah.vercel.app", href: "https://esteticaah.vercel.app" },
    screens: {
      desktop: {
        image: { src: "/media/esteticaah.webp", width: 1280, height: 800 },
        clip: {
          webm: "/media/esteticaah-tour.webm",
          mp4: "/media/esteticaah-tour.mp4",
          poster: "/media/esteticaah.webp",
          width: 1280,
          height: 800,
        },
      },
      mobile: {
        image: { src: "/media/esteticaah-mobile.webp", width: 390, height: 664 },
        clip: {
          webm: "/media/esteticaah-luna-mobile.webm",
          mp4: "/media/esteticaah-luna-mobile.mp4",
          poster: "/media/esteticaah-mobile.webp",
          width: 390,
          height: 664,
        },
      },
    },
    diagram: "esteticaah",
    technologies: [
      "TanStack Start",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Typebot",
      "n8n",
      "Claude Sonnet 4.6",
      "Vercel",
    ],
  },
};

/**
 * Stack-section pills each project uses, in lowercase (spec 3.3.6). Matched by
 * exact name or as a prefix, so "vps" covers "VPS com Coolify" and "VPS with Coolify".
 */
export const stackPills: Record<ProjectId, string[]> = {
  monai: [
    "claude (anthropic sdk)",
    "structured outputs",
    "evals",
    "react",
    "next.js",
    "typescript",
    "tailwind css",
    "postgresql",
    "prisma",
    "docker",
    "github actions",
    "vps",
  ],
  b2b: [
    "claude (anthropic sdk)",
    "tool use",
    "python",
    "fastapi",
    "postgresql",
    "supabase",
    "railway",
  ],
  esteticaah: ["n8n", "typebot", "react", "typescript", "tailwind css", "tanstack start", "vercel"],
};
