import type { Dictionary } from "@/content";
import { SectionHeading } from "../ui/SectionHeading";

export function WhatIDo({ dict }: { dict: Dictionary }) {
  const { whatIDo } = dict;

  return (
    <section data-pillars aria-labelledby="what-i-do-title" className="section">
      <div className="container-page">
        <SectionHeading id="what-i-do-title" title={whatIDo.title} />
        <div className="relative mt-16">
          {/* Progress between pillars, shown only while the section is pinned (desktop). */}
          <span
            aria-hidden="true"
            data-pillars-progress
            className="absolute -left-6 top-0 hidden h-full w-px origin-top bg-accent"
          />
          <ol data-pillars-list className="space-y-16">
            {whatIDo.pillars.map((pillar, i) => (
              <li
                key={pillar.title}
                data-pillar
                className="grid gap-4 border-t border-border pt-8 md:grid-cols-[8rem_1fr] md:gap-8"
              >
                <span aria-hidden="true" className="overflow-hidden font-mono text-sm text-accent">
                  <span data-pillar-number className="inline-block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <div className="max-w-4xl">
                  <h3 className="text-pillar font-semibold">{pillar.title}</h3>
                  <p data-pillar-text className="mt-4 text-lead text-muted">
                    {pillar.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
