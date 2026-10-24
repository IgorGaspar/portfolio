import { robo } from "@/content/robo";
import { SectionHeading } from "../ui/SectionHeading";
import { Mark } from "./Mark";

const labelClass = "font-mono text-xs uppercase tracking-widest text-muted";

export function RoboBenefits() {
  const { benefits } = robo;

  return (
    <section aria-labelledby="beneficios-title" className="section">
      <div className="container-page">
        <SectionHeading id="beneficios-title" title={benefits.title} />

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {benefits.items.map((item, i) => (
            <li key={item.title} data-reveal="up" className="bg-surface p-6 sm:p-10">
              <span aria-hidden="true" className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-xl font-semibold sm:text-2xl">{item.title}</h3>
              <p className="mt-3 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>

        <div data-reveal="up" className="mt-16">
          <h3 className={labelClass}>{benefits.includedTitle}</h3>
          <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {benefits.included.map((item) => (
              <li key={item} className="flex gap-3">
                <Mark included />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
