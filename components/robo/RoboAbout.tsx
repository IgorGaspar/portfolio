import Link from "next/link";
import { robo } from "@/content/robo";
import { SectionHeading } from "../ui/SectionHeading";

export function RoboAbout() {
  const { about } = robo;

  return (
    <section aria-labelledby="sobre-title" className="section">
      <div className="container-page">
        <SectionHeading id="sobre-title" title={about.title} />

        <div className="mt-12 grid items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
          {/* Same "IG" monogram as the portfolio until the professional photo is provided. */}
          <div
            role="img"
            aria-label={about.photoAlt}
            className="flex size-32 items-center justify-center rounded-full border border-accent font-display text-4xl font-bold lg:size-40 lg:text-5xl"
          >
            IG
          </div>
          <div data-reveal="up" className="max-w-2xl">
            <p className="font-display text-2xl font-semibold">{about.name}</p>
            <p className="mt-1 font-mono text-sm text-muted">{about.role}</p>
            <p className="mt-5 text-lead text-muted">{about.body}</p>
            <Link href="/" className="link mt-5 inline-block">
              {about.link} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
