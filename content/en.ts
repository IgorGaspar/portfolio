import type { Dictionary } from "./types";

// Copy from section 2B of the spec (docs/PACOTE-PARA-O-CODE.md). Do not edit without updating the spec.
export const en: Dictionary = {
  meta: {
    title: "Igor Gaspar · AI Engineer & Fullstack Developer",
    description:
      "I build products with AI agents that work in production, from prompt to database. See my projects and stack, and talk to my agent.",
  },
  nav: {
    projects: "Projects",
    howIBuild: "How I build",
    journey: "Journey",
    contact: "Contact",
    cta: "Get in touch",
  },
  hero: {
    eyebrow: "Igor Gaspar · AI Engineer & Fullstack Developer",
    title: "I put AI agents into production.",
    subtitle:
      "From prompt to database. I build LLM products that work beyond the demo: tested, secure with user data, and deployed.",
    ctaHire: "Hire me for your team",
    ctaProject: "I have a project",
    agentLink: "Or ask my agent ↓",
  },
  agent: {
    title: "Ask me anything.",
    support:
      "This agent knows my background, my projects and how I work. It's also an example of what I build.",
    chips: [
      "Which projects have you shipped to production?",
      "What would it be like to work with you on a project?",
      "What's your experience with .NET and Angular?",
    ],
    placeholder: "Type your question…",
    notice:
      "AI-generated answers based on information I provided. For anything important, reach out to me directly.",
  },
  whatIDo: {
    title: "Three things I deliver.",
    pillars: [
      {
        title: "AI agents and LLMs in production",
        body: "Agents with tool use, structured outputs and automated evals. Rate limits, fallbacks and confirmation before any action that touches data. Not a prototype: a running system.",
      },
      {
        title: "End-to-end product",
        body: "Front end, back end, database and deployment. Next.js, React, Angular, .NET, Node.js, Python, PostgreSQL, Docker and CI/CD. I take work from proof of concept to production.",
      },
      {
        title: "AI applied to business",
        body: "I'm pursuing a Master's in Business and AI and an MBA in Business Transformation with Generative AI. I start from the problem, not the tool.",
      },
    ],
  },
  projects: {
    title: "Projects in production.",
    subtitle: "Three real systems, three different ways of using Claude.",
    items: {
      monai: {
        badge: "My own product · live",
        title: "MonAI: personal finance in plain language",
        summary:
          "You type an expense the way you'd say it. An AI agent interprets it, shows a preview and only saves it after you confirm.",
        problem:
          "Finance apps ask for a form for every expense. People who stop logging lose track of their month.",
        solution:
          "Just type \"spent 45 at the grocery store on my Itaú debit card\". An agent powered by Claude Haiku 4.5 extracts amount, account, category, date and payment method, shows a preview and only saves after confirmation. The app also handles accounts, recurring expenses and income, and projects cash flow for the coming months.",
        engineering: [
          "User isolation with Row-Level Security in PostgreSQL, plus ownership checks in every service",
          "Money stored as fixed-precision decimals; balance and transaction written in the same database transaction",
          "Structured model output, automated agent evals and a heuristic fallback parser",
          "Opt-in consent for AI use, data export and deletion (Brazil's LGPD)",
          "More than 50 test files and CI running lint, tests and build on every change",
        ],
        stack: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind CSS",
          "Prisma",
          "PostgreSQL",
          "NextAuth",
          "Claude Haiku 4.5",
          "Docker",
          "VPS with Coolify",
          "GitHub Actions",
        ],
        linkNote: "(app interface in Portuguese)",
        mediaAlt: "MonAI screen with the agent input and bank accounts",
      },
      b2b: {
        badge: "Engineering case · live",
        title: "Autonomous sales agent for B2B events",
        summary:
          "From first contact to sales meeting: a Telegram agent that captures, enriches and nurtures every lead from an event.",
        problem:
          "A B2B event generates leads that go cold between sign-up and sales follow-up.",
        solution:
          "An autonomous Telegram agent for Aegis Summit. It captures leads with consent, enriches company data from public sources and runs communication sequences from 14 days before to 3 days after the event. At the end, it takes the lead all the way to booking a meeting with the sales team.",
        engineering: [
          "Native Anthropic tool-use loop with Claude Sonnet 4.6 and 8 tools, no LangChain",
          "Proactive sequences in a scheduler, decoupled from the model: the LLM handles conversation, the scheduler guarantees timing",
          "Pluggable enrichment: heuristics on the email domain + web search with Tavily",
          "Dashboard with funnel KPIs, LGPD consent and a data deletion command",
          "Automated tests with pytest and continuous deployment on Railway",
        ],
        stack: [
          "Python",
          "FastAPI",
          "python-telegram-bot",
          "Claude Sonnet 4.6 (tool use)",
          "Supabase (PostgreSQL)",
          "APScheduler",
          "Tavily",
          "Railway",
        ],
        diagram: {
          label:
            "Architecture diagram: Telegram → Agent (Claude + 8 tools) → Supabase · Sequence scheduler → Telegram · Enrichment → Agent",
          nodes: {
            telegram: ["Telegram"],
            agent: ["Agent", "Claude + 8 tools"],
            supabase: ["Supabase"],
            scheduler: ["Sequence scheduler"],
            enrichment: ["Enrichment"],
          },
        },
      },
      esteticaah: {
        badge: "Real client · live",
        title: "EstetiCaah: website and AI customer assistant",
        summary:
          "A beauty clinic website where visitors pick a treatment, get answers from an AI and arrive on WhatsApp ready to book.",
        problem:
          "The clinic needed to turn website visits into bookings, without leaving questions about treatments unanswered.",
        solution:
          "The visitor picks a treatment and the chat opens already knowing what it's about. An n8n flow uses Claude Sonnet 4.6 to answer questions and, when the client is ready, hands them off to the clinic's WhatsApp.",
        engineering: [
          "Context-aware chat: the chosen treatment reaches the assistant as a prefilled variable",
          "Orchestration in n8n, with the model writing the answers",
          "Direct handoff to the clinic's WhatsApp, where the booking is closed",
          "Server-side rendering with TanStack Start, deployed on Vercel",
        ],
        stack: [
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
        linkNote: "(site in Portuguese)",
        mediaAlt: "Home page of the EstetiCaah website",
        diagram: {
          label:
            "Architecture diagram: Website (treatment) → Typebot → n8n → Claude Sonnet 4.6 → Clinic's WhatsApp",
          nodes: {
            site: ["Website", "treatment"],
            typebot: ["Typebot"],
            n8n: ["n8n"],
            claude: ["Claude Sonnet 4.6"],
            whatsapp: ["Clinic's WhatsApp"],
          },
        },
      },
    },
  },
  howIBuild: {
    title: "How I build.",
    subtitle: "AI speeds up the work, but the quality bar is still mine.",
    steps: [
      {
        title: "Understand the problem.",
        body: "Before any code: what needs to change for the business, and how we'll know it did.",
      },
      {
        title: "Prove it fast.",
        body: "A short proof of concept to validate the approach before investing in the full version.",
      },
      {
        title: "Test what matters.",
        body: "Automated tests on business rules and evals on agent behavior.",
      },
      {
        title: "Protect the data.",
        body: "User isolation, consent, API keys kept on the server.",
      },
      {
        title: "Ship and follow up.",
        body: "CI-driven deploys, a staging environment before production, and adjustments based on real usage.",
      },
    ],
    footer:
      "Day to day, I work with Claude Code, Cursor and GitHub Copilot, with human review on every change.",
    terminal: [
      "# understand: what needs to change?",
      "$ git checkout -b poc/agent",
      "$ npm test && npm run eval:agent",
      "✓ RLS on · opt-in consent · key on the server only",
      "$ git push → CI: lint ✓ test ✓ build ✓ → deploy",
    ],
  },
  stack: {
    title: "Tools I use in production.",
    groups: [
      {
        label: "AI and agents",
        items: [
          "Claude (Anthropic SDK)",
          "tool use",
          "structured outputs",
          "evals",
          "MCP",
          "n8n",
          "Typebot",
          "Claude Code",
          "Cursor",
          "GitHub Copilot",
        ],
      },
      {
        label: "Front end",
        items: ["React", "Next.js", "Angular", "TypeScript", "Tailwind CSS", "TanStack Start"],
      },
      {
        label: "Back end",
        items: ["C# / .NET", "Node.js", "Python", "FastAPI", "REST APIs"],
      },
      {
        label: "Data",
        items: ["PostgreSQL", "SQL Server", "MySQL", "MongoDB", "Prisma", "Supabase"],
      },
      {
        label: "Infrastructure",
        items: ["Docker", "GitHub Actions", "Vercel", "Railway", "VPS with Coolify"],
      },
      { label: "Mobile", items: ["Flutter"] },
    ],
  },
  journey: {
    title: "From mechanical engineering to AI.",
    subtitle: "A non-linear path that taught me to solve the problem before picking the tool.",
    items: [
      { period: "2014–2019", heading: "**Mechanical Engineering**, UniABC" },
      {
        period: "2020–2021",
        heading: "**Logistics checker**, Paulo Vieira Transportes.",
        body: "Operations, load planning and customer service.",
      },
      {
        period: "2021–2023",
        heading: "**IT Technician**, Santa Casa de Misericórdia de Mauá (hospital).",
        body: "Support for an entire hospital: network, Active Directory and the hospital management system.",
      },
      {
        period: "2022–2023",
        heading: "**Systems Analysis and Development**, Universidade Cruzeiro do Sul",
      },
      {
        period: "2023–present",
        heading: "**Fullstack Developer**, Farmarcas.",
        body: ".NET and Angular every day. I drive initiatives end to end, from research and proof of concept to production. I refactored a flow that fired multiple simultaneous requests into a single call: from 40 s down to 8 s. I brought AI assistants and agents into the team's development workflow.",
        stat: "40 s → 8 s",
      },
      {
        period: "2025–present",
        heading:
          "**Master's in Business and AI** (AGTU) and **MBA in Business Transformation with Generative AI** (Faculdade Hub)",
      },
      {
        period: "2026",
        heading: "**Own projects and first client:** MonAI, EstetiCaah and the B2B sales agent",
      },
    ],
  },
  workWithMe: {
    title: "Have a project? Here's how it works.",
    steps: [
      {
        title: "First conversation.",
        body: "In person or over Meet/Zoom. I learn the problem, the audience and what success looks like.",
      },
      {
        title: "Proposal with a demo.",
        body: "Scope, timeline and a prototype so you can see the idea working before you decide.",
      },
      {
        title: "Build with regular check-ins.",
        body: "Incremental deliveries and short meetings to adjust course.",
      },
      {
        title: "Delivery and follow-up.",
        body: "Live in production, documented, and adjusted based on real usage.",
      },
    ],
    cta: "Book a call",
  },
  contact: {
    title: "Let's talk.",
    text: "Whether it's a role or a project, I reply personally.",
    emailLabel: "Email",
    location: "Mauá, São Paulo, Brazil · remote, or on-site in Greater São Paulo",
    languages: "Languages: Portuguese (native), English (professional working), Spanish (elementary)",
    ctaHire: "Hire me for your team",
    ctaProject: "I have a project",
    closing: "Or ask my agent.",
  },
  footer: { text: "© 2026 Igor Gaspar · Built with Next.js and Claude" },
  ui: {
    skipToContent: "Skip to content",
    mainNav: "Main navigation",
    menu: "Menu",
    language: "Language",
    themeToggle: "Toggle light/dark theme",
    problem: "The problem",
    solution: "The solution",
    engineering: "Engineering you don't see on screen",
    lookInside: "Look inside",
    stack: "Stack",
    links: "Links",
    copy: "Copy",
    copied: "Copied ✓",
    send: "Send",
    subjectHire: "Role",
    subjectProject: "Project",
    photoAlt: "IG monogram",
    notFoundTitle: "Page not found.",
    notFoundText: "The address you opened doesn't exist on this site.",
    notFoundBack: "Back to home",
  },
};
