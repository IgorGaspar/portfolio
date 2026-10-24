import { robo } from "@/content/robo";
import { SectionHeading } from "../ui/SectionHeading";
import { Mark } from "./Mark";

const labelClass = "font-mono text-xs uppercase tracking-widest text-muted";

export function RoboSetup() {
  const { setup } = robo;

  return (
    <section id="implantacao" aria-labelledby="implantacao-title" className="section">
      <div className="container-page">
        <SectionHeading id="implantacao-title" title={setup.title} subtitle={setup.subtitle} />

        <dl className="mt-12 divide-y divide-border border-y border-border">
          {setup.prices.map((item) => (
            <div key={item.plan} className="flex items-baseline justify-between gap-4 py-5">
              <dt className="text-muted">{item.plan}</dt>
              <dd className="font-display text-2xl font-bold sm:text-3xl">{item.price}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="up">
            <h3 className={labelClass}>{setup.includedTitle}</h3>
            <ul className="mt-6 space-y-4">
              {setup.included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Mark included />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal="up">
            <h3 className={labelClass}>{setup.yoursTitle}</h3>
            <ul className="mt-6 space-y-4">
              {setup.yours.map((item) => (
                <li key={item.title} className="rounded-xl border border-border bg-surface p-5">
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="mt-2 text-sm text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
