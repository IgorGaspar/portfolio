import type { Dictionary } from "@/content";
import { mailto } from "@/lib/contact";
import { SectionHeading } from "../ui/SectionHeading";

export function WorkWithMe({ dict }: { dict: Dictionary }) {
  const { workWithMe, ui } = dict;

  return (
    <section id="work-with-me" aria-labelledby="work-with-me-title" className="section">
      <div className="container-page">
        <SectionHeading id="work-with-me-title" title={workWithMe.title} />

        {/* Vertical track on mobile, horizontal from lg up. */}
        <div data-progress-list data-work-with-me className="relative mt-16 pl-8 lg:pl-0">
          <span aria-hidden="true" className="progress-line progress-line-responsive" />
          <span
            aria-hidden="true"
            data-line-fill
            className="progress-line progress-line-fill progress-line-responsive"
          />
          <ol className="space-y-10 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0">
            {workWithMe.steps.map((step, i) => (
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

        {/* Opens e-mail until a scheduling link (Cal.com or Calendly) is provided. */}
        <a href={mailto(ui.subjectProject)} data-pulse className="btn btn-solid mt-12">
          {workWithMe.cta}
        </a>
      </div>
    </section>
  );
}
