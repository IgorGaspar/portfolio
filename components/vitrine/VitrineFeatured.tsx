import Image from "next/image";
import Link from "next/link";
import { vitrine } from "@/content/vitrine";
import { BotClip } from "../robo/BotClip";
import { Badge } from "../ui/Badge";
import { SectionHeading } from "../ui/SectionHeading";

/** The offers bot, first and largest product. No price here: the sales page has it. */
export function VitrineFeatured() {
  const { featured, monai, own } = vitrine;

  return (
    <section id="produtos" aria-labelledby="own-title" className="section scroll-mt-16">
      <div className="container-page">
        <SectionHeading id="own-title" title={own.title} subtitle={own.subtitle} />
        <article
          data-reveal="up"
          aria-labelledby="featured-title"
          className="mt-16 grid items-center gap-10 rounded-2xl border border-accent/40 bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-14"
        >
          <div className="min-w-0">
            <Badge>{featured.badge}</Badge>
            <h3 id="featured-title" className="mt-6 text-section font-semibold">
              {featured.title}
            </h3>
            <p className="mt-5 max-w-2xl text-lead text-muted">{featured.body}</p>
            <ul className="mt-8 space-y-3">
              {featured.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden="true" className="font-mono text-accent">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/robo-de-ofertas" className="btn btn-solid mt-10">
              {featured.cta} →
            </Link>
          </div>

          <div className="mx-auto w-56 overflow-hidden rounded-[2rem] border border-border bg-bg p-2 shadow-2xl sm:w-64">
            <BotClip label={featured.mediaAlt} className="overflow-hidden rounded-[1.5rem]" />
          </div>
        </article>

        <article
          data-reveal="up"
          aria-labelledby="monai-title"
          className="mt-8 grid items-center gap-10 rounded-2xl border border-accent/40 bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-14"
        >
          <div className="min-w-0">
            <Badge>{monai.badge}</Badge>
            <h3 id="monai-title" className="mt-6 text-section font-semibold">
              {monai.title}
            </h3>
            <p className="mt-5 max-w-2xl text-lead text-muted">{monai.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={monai.href} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                {monai.cta}
              </a>
              <Link href={monai.howItWasMade} className="link py-2 text-sm">
                {vitrine.products.howItWasMade} →
              </Link>
            </div>
          </div>
          <Image
            src={monai.image.src}
            alt={monai.image.alt}
            width={monai.image.width}
            height={monai.image.height}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[4/3] h-auto w-full rounded-xl border border-border object-cover object-top"
          />
        </article>
      </div>
    </section>
  );
}
