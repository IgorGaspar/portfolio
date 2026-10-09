# igorgaspar.tech

Personal portfolio of Igor Gaspar, AI engineer and fullstack developer. Bilingual (Portuguese at `/`, English at `/en`), with an AI agent that answers questions about the work, a WebGL hero and scroll choreography that degrades gracefully.

**Live:** https://igorgaspar.tech

## What is in it

- **AI agent.** A Route Handler (`app/api/agent/route.ts`) streams answers from the Anthropic API as NDJSON. It checks the request origin, rate limits by client IP and by a site-wide daily ceiling (in memory, since the site runs as a single instance), validates the body with Zod and cancels the upstream call when the visitor closes the chat. The API key never reaches the browser. The chat UI lives in `components/agent/`.
- **Three motion levels.** `lib/motion/` (GSAP, ScrollTrigger, SplitText, Lenis) is driven by `data-*` attributes and loaded in its own chunk after the page is idle. It runs a full level on desktop, a light one on touch screens and a fades-only one under `prefers-reduced-motion`.
- **3D neural core.** One fixed React Three Fiber canvas serves the hero and the contact section (`components/three/`). It loads on the visitor's first input, grows from a single point and pauses when off screen. Devices that cannot afford it, or that ask for reduced motion, get a pre-rendered static image.
- **Performance.** CSS is inlined, fonts are not preloaded, and the hero text is painted from CSS alone, so it never waits for JavaScript. Mobile Lighthouse scores 93-94 in the default simulated run.
- **Accessibility.** WCAG AA contrast in both themes, visible focus, keyboard-operable chat dialog that returns focus to its opener, and zero axe violations in the automated audit.
- **SEO.** Per-locale metadata and `hreflang`, generated Open Graph images, Person JSON-LD, `robots.txt` and `sitemap.xml`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP · Lenis · Motion · React Three Fiber · Anthropic SDK · Zod · Vitest · Playwright

## Run it locally

Requires Node 22.

```bash
npm install
cp .env.example .env.local   # then fill in ANTHROPIC_API_KEY
npm run dev
```

The agent prompt is private and not in this repository (see below). Without it, a local run falls back to the generic templates in `content/agent/*.example.md`, so everything still works.

### Environment

Server-side only. Nothing here is ever prefixed with `NEXT_PUBLIC_`.

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Key for the agent route |
| `ANTHROPIC_MODEL` | Model used by the agent (defaults to Claude Haiku 4.5) |
| `AGENT_RATE_LIMIT_MAX`, `AGENT_RATE_LIMIT_WINDOW` | Requests per IP and window (default 20 per hour) |
| `AGENT_DAILY_LIMIT` | Site-wide ceiling of agent calls per UTC day (default 200). Past it the agent points visitors to e-mail |

### The agent prompt

`content/agent/instructions.md` and `content/agent/knowledge.md` are git-ignored. Copy the `.example.md` files, edit them, and keep the originals out of version control. In production they are mounted into the container at `/app/content/agent/`; if they are missing there, the route answers with a polite "unavailable" message instead of running on the template.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and `tsc --noEmit` |
| `npm test` | Vitest: agent library and route handler, with the SDK mocked |
| `npm run test:e2e` | Playwright: smoke tests, keyboard navigation and axe audits, including reduced motion. The agent API is always mocked |
| `npm run eval:agent` | Sends a fixed question set to the real model. **Spends API credit** |

## Project layout

```
app/             routes, the agent Route Handler, health check, robots, sitemap
components/      sections, agent chat, 3D scene, layout and UI pieces
content/         typed pt/en dictionaries, project data, agent prompt templates
lib/             agent, rate limit, i18n, motion
e2e/             Playwright specs
tests/           Vitest specs
```

## Deployment

The app builds with `output: "standalone"` and ships as a container (`Dockerfile`, Node 22 Alpine, non-root user, healthcheck on `/api/health`). It runs on a VPS managed by Coolify, which handles routing and HTTPS.
