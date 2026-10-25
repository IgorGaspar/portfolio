import { robo } from "@/content/robo";
import { WhatsAppLink } from "./WhatsAppLink";

export function RoboClosing() {
  const { closing } = robo;

  return (
    <section
      id="contato"
      aria-labelledby="contato-title"
      className="section relative overflow-hidden"
    >
      <div aria-hidden="true" className="neural-static" />
      {/* Same glow as the hero, closing the page where it started. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_80%_60%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)]"
      />
      <div className="container-page">
        <h2 id="contato-title" data-reveal="mask" className="max-w-5xl text-hero font-bold">
          {closing.title}
        </h2>
        <p data-reveal="up" className="mt-6 max-w-2xl text-lead text-muted">
          {closing.text}
        </p>
        <WhatsAppLink draft={robo.draft} className="btn btn-solid mt-10">
          {closing.cta}
        </WhatsAppLink>
        <p className="mt-8 text-sm text-muted">{closing.note}</p>
      </div>
    </section>
  );
}
