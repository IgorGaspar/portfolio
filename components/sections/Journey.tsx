import type { Dictionary } from "@/content";
import { RichText } from "../ui/RichText";
import { SectionHeading } from "../ui/SectionHeading";

export function Journey({ dict }: { dict: Dictionary }) {
  const { journey, ui } = dict;

  return (
    <section id="journey" aria-labelledby="journey-title" className="section">
      <div className="container-page">
        <SectionHeading id="journey-title" title={journey.title} subtitle={journey.subtitle} />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,16rem)_1fr] lg:gap-20">
          {/* Photo slot: "IG" monogram until the professional photo is provided. */}
          <div>
            <div className="lg:sticky lg:top-28">
              <div
                role="img"
                aria-label={ui.photoAlt}
                data-parallax
                className="flex size-40 items-center justify-center rounded-full border border-accent font-display text-5xl font-bold lg:size-56 lg:text-7xl"
              >
                IG
              </div>
            </div>
          </div>

          <div data-progress-list data-journey className="relative pl-8">
            <span aria-hidden="true" className="progress-line" />
            {/* Runs from muted to accent: from mechanical engineering to AI. */}
            <span
              aria-hidden="true"
              data-line-fill
              className="progress-line progress-line-fill bg-linear-to-b from-muted to-accent"
            />
            <ol className="space-y-10">
              {journey.items.map((item) => (
                <li key={item.period + item.heading} data-step className="step relative">
                  <span aria-hidden="true" className="step-dot absolute -left-8 top-1.5" />
                  <div data-step-card>
                    <p className="font-mono text-sm text-accent">{item.period}</p>
                    <h3 className="mt-2 font-sans text-lg font-normal leading-snug tracking-normal text-muted sm:text-xl">
                      <RichText text={item.heading} />
                    </h3>
                    {item.body && <p className="mt-3 max-w-2xl text-muted">{item.body}</p>}
                    {item.stat && (
                      <p
                        data-counter
                        className="mt-4 inline-block rounded-lg border border-accent/40 px-4 py-2 font-mono text-2xl tabular-nums text-accent"
                      >
                        {item.stat}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
