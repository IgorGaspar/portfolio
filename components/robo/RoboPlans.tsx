import { robo } from "@/content/robo";
import { Badge } from "../ui/Badge";
import { SectionHeading } from "../ui/SectionHeading";
import { Mark } from "./Mark";
import { WhatsAppLink } from "./WhatsAppLink";

export function RoboPlans() {
  const { plans } = robo;

  return (
    <section id="planos" aria-labelledby="planos-title" className="section">
      <div className="container-page">
        <SectionHeading id="planos-title" title={plans.title} subtitle={plans.subtitle} />

        <ul className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.items.map((plan) => {
            const featured = plan.id === "plus";
            const upcoming = plan.id === "pro";

            return (
              <li key={plan.id} data-reveal="up">
                <article
                  aria-labelledby={`plano-${plan.id}`}
                  className={`project-card flex h-full flex-col rounded-2xl border bg-surface p-6 sm:p-8 ${
                    featured ? "border-accent" : "border-border"
                  }`}
                >
                  <div className="flex min-h-7 flex-wrap items-center justify-between gap-3">
                    <h3 id={`plano-${plan.id}`} className="text-2xl font-semibold">
                      {plan.name}
                    </h3>
                    {plan.badge && <Badge>{plan.badge}</Badge>}
                  </div>

                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold sm:text-5xl">
                      {plan.price}
                    </span>
                    {!upcoming && <span className="text-muted">{plans.perMonth}</span>}
                  </p>
                  <p className="mt-2 font-mono text-sm text-accent">
                    {plan.firstMonth ?? plan.priceNote}
                  </p>

                  <p className="mt-6 text-muted">{plan.summary}</p>

                  <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
                    {plan.features.map((feature) => (
                      <li
                        key={feature.label}
                        className={`flex gap-3 ${feature.included ? "" : "text-muted"}`}
                      >
                        <Mark included={feature.included} />
                        <span>
                          <span className="sr-only">
                            {feature.included ? plans.included : plans.notIncluded}:{" "}
                          </span>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                    <li className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="w-4 shrink-0 text-center font-mono text-accent"
                      >
                        +
                      </span>
                      {plan.extra}
                    </li>
                  </ul>

                  <div className="mt-auto pt-8">
                    {plan.setup && <p className="mb-4 text-sm text-muted">{plan.setup}</p>}
                    <WhatsAppLink
                      draft={plan.draft}
                      className={`btn w-full ${featured ? "btn-solid" : ""}`}
                    >
                      {plan.cta}
                    </WhatsAppLink>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 max-w-3xl text-sm text-muted">{plans.footnote}</p>
      </div>
    </section>
  );
}
