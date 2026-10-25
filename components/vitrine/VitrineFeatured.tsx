import Link from "next/link";
import { vitrine } from "@/content/vitrine";
import { BotClip } from "../robo/BotClip";
import { Badge } from "../ui/Badge";

/** The offers bot, first and largest product. No price here: the sales page has it. */
export function VitrineFeatured() {
  const { featured } = vitrine;

  return (
    <section id="produtos" aria-labelledby="featured-title" className="section scroll-mt-16">
      <div className="container-page">
        <article
          data-reveal="up"
          className="grid items-center gap-10 rounded-2xl border border-accent/40 bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:gap-14"
        >
          <div className="min-w-0">
            <Badge>{featured.badge}</Badge>
            <h2 id="featured-title" className="mt-6 text-section font-semibold">
              {featured.title}
            </h2>
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
      </div>
    </section>
  );
}
