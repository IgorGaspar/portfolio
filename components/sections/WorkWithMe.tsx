import type { Dictionary } from "@/content";
import { mailto } from "@/lib/contact";
import { SectionHeading } from "../ui/SectionHeading";

export function WorkWithMe({ dict }: { dict: Dictionary }) {
  const { workWithMe, ui } = dict;

  return (
    <section id="work-with-me" aria-labelledby="work-with-me-title" className="section">
      <div className="container-page">
        <SectionHeading id="work-with-me-title" title={workWithMe.title} />

        <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {workWithMe.steps.map((step, i) => (
            <li key={step.title} className="border-t border-border pt-6">
              <span aria-hidden="true" className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* Opens e-mail until a scheduling link (Cal.com or Calendly) is provided. */}
        <a href={mailto(ui.subjectProject)} className="btn btn-solid mt-12">
          {workWithMe.cta}
        </a>
      </div>
    </section>
  );
}
