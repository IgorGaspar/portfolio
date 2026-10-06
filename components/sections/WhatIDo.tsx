import type { Dictionary } from "@/content";
import { SectionHeading } from "../ui/SectionHeading";

export function WhatIDo({ dict }: { dict: Dictionary }) {
  const { whatIDo } = dict;

  return (
    <section aria-labelledby="what-i-do-title" className="section">
      <div className="container-page">
        <SectionHeading id="what-i-do-title" title={whatIDo.title} />
        <ol className="mt-16 space-y-16">
          {whatIDo.pillars.map((pillar, i) => (
            <li
              key={pillar.title}
              className="grid gap-4 border-t border-border pt-8 md:grid-cols-[8rem_1fr] md:gap-8"
            >
              <span aria-hidden="true" className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="max-w-4xl">
                <h3 className="text-pillar font-semibold">{pillar.title}</h3>
                <p className="mt-4 text-lead text-muted">{pillar.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
