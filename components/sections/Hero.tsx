import type { Dictionary } from "@/content";
import { mailto } from "@/lib/contact";
import { AgentCta } from "../agent/AgentCta";

export function Hero({ dict }: { dict: Dictionary }) {
  const { hero, ui } = dict;

  return (
    <section
      data-hero
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden pt-16"
    >
      {/* Static backdrop. The neural core (components/three) renders above it, behind the text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_40%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%),radial-gradient(40%_40%_at_60%_70%,color-mix(in_srgb,var(--accent-2)_12%,transparent),transparent_70%)]"
      />

      <div aria-hidden="true" className="neural-static" />

      <div className="container-page py-20">
        <p className="hero-in font-mono text-sm text-muted">{hero.eyebrow}</p>
        <h1 id="hero-title" className="hero-mask mt-6 max-w-5xl text-hero font-bold">
          {hero.title}
        </h1>
        <p className="hero-in mt-8 max-w-2xl text-lead text-muted [--i:3]">{hero.subtitle}</p>

        <div className="hero-in mt-10 flex flex-col gap-4 sm:flex-row [--i:4]">
          <AgentCta href={mailto(ui.subjectHire)} draft={ui.draftHire} className="btn">
            {hero.ctaHire}
          </AgentCta>
          <AgentCta href={mailto(ui.subjectProject)} draft={ui.draftProject} className="btn">
            {hero.ctaProject}
          </AgentCta>
        </div>

        <a
          href="#agent"
          className="hero-in mt-8 inline-block py-2 text-sm text-muted [--i:5] underline-offset-4 transition-colors hover:text-accent-2 hover:underline"
        >
          {hero.agentLink}
        </a>
      </div>
    </section>
  );
}
