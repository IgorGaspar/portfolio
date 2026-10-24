import Image from "next/image";
import { robo } from "@/content/robo";
import { WhatsAppLink } from "./WhatsAppLink";

export function RoboHero() {
  const { hero } = robo;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden pt-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_75%_40%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%),radial-gradient(40%_40%_at_60%_70%,color-mix(in_srgb,var(--accent-2)_12%,transparent),transparent_70%)]"
      />

      <div className="container-page grid items-center gap-14 py-20 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="hero-in font-mono text-sm text-muted">{hero.eyebrow}</p>
          <h1
            id="hero-title"
            className="hero-mask mt-6 max-w-4xl text-hero font-bold lg:text-[clamp(3.5rem,0.6rem+4.6vw,5rem)]"
          >
            {hero.title}
          </h1>
          <p className="hero-in mt-8 max-w-2xl text-lead text-muted [--i:3]">{hero.subtitle}</p>

          <div className="hero-in mt-10 flex flex-col gap-4 sm:flex-row [--i:4]">
            <WhatsAppLink draft={robo.draft} className="btn btn-solid">
              {hero.cta}
            </WhatsAppLink>
            <a href="#planos" className="btn">
              {hero.secondary}
            </a>
          </div>

          <ul className="hero-in mt-8 flex flex-wrap gap-2 [--i:5]">
            {hero.highlights.map((item) => (
              <li key={item} className="pill">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Phone-sized screenshot of the bot at work. */}
        <div className="hero-in mx-auto w-64 overflow-hidden rounded-[2rem] border border-border bg-surface p-2 shadow-2xl [--i:4] sm:w-72 lg:w-80">
          <Image
            src="/media/robo/mensagem.webp"
            alt={hero.mediaAlt}
            width={640}
            height={1125}
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 1024px) 320px, 288px"
            className="h-auto w-full rounded-[1.5rem]"
          />
        </div>
      </div>
    </section>
  );
}
