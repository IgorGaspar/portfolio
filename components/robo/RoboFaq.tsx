import { robo } from "@/content/robo";
import { SectionHeading } from "../ui/SectionHeading";

export function RoboFaq() {
  const { faq } = robo;

  return (
    <section id="duvidas" aria-labelledby="duvidas-title" className="section">
      <div className="container-page">
        <SectionHeading id="duvidas-title" title={faq.title} />

        <div className="mt-12 max-w-4xl space-y-3">
          {faq.items.map((item) => (
            <details
              key={item.title}
              data-accordion
              className="group rounded-xl border border-border bg-surface"
            >
              <summary className="flex list-none items-center justify-between gap-4 px-5 py-4 font-medium">
                {item.title}
                <span
                  aria-hidden="true"
                  className="font-mono text-accent transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="border-t border-border px-5 py-4 text-muted">{item.body}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
