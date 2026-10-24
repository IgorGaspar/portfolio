import { robo } from "@/content/robo";
import { SectionHeading } from "../ui/SectionHeading";

export function RoboHowItWorks() {
  const { howItWorks } = robo;

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="section">
      <div className="container-page">
        <SectionHeading
          id="como-funciona-title"
          title={howItWorks.title}
          subtitle={howItWorks.subtitle}
        />

        {/* Vertical track on mobile, horizontal from lg up (same as "Work with me"). */}
        <div data-progress-list className="relative mt-16 pl-8 lg:pl-0">
          <span aria-hidden="true" className="progress-line progress-line-responsive" />
          <span
            aria-hidden="true"
            data-line-fill
            className="progress-line progress-line-fill progress-line-responsive"
          />
          <ol className="space-y-10 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} data-step className="step relative lg:pt-8">
                <span
                  aria-hidden="true"
                  className="step-dot absolute -left-8 top-2 lg:left-0 lg:top-0 lg:translate-x-0 lg:-translate-y-1/2"
                />
                <span aria-hidden="true" className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <a href="#planos" data-pulse className="btn btn-solid mt-12">
          {robo.hero.secondary}
        </a>
      </div>
    </section>
  );
}
