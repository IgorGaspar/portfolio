import type { Dictionary } from "@/content";
import { SectionHeading } from "../ui/SectionHeading";

export function HowIBuild({ dict }: { dict: Dictionary }) {
  const { howIBuild } = dict;

  return (
    <section id="how-i-build" aria-labelledby="how-i-build-title" className="section">
      <div className="container-page">
        <SectionHeading
          id="how-i-build-title"
          title={howIBuild.title}
          subtitle={howIBuild.subtitle}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-16">
          <ol className="relative space-y-10 border-l border-border pl-8">
            {howIBuild.steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-8 top-2 size-2.5 -translate-x-1/2 rounded-full border border-accent bg-bg"
                />
                <span aria-hidden="true" className="font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-xl font-semibold sm:text-2xl">{step.title}</h3>
                <p className="mt-2 max-w-xl text-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          {/* Decorative terminal, desktop only (spec 3.3.5). Always dark. */}
          <div aria-hidden="true" className="hidden lg:block">
            <div className="sticky top-28 overflow-hidden rounded-xl border border-[#1e2230] bg-[#07080c] font-mono text-sm text-[#e8eaf0] shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-[#1e2230] px-4 py-3">
                <span className="size-2.5 rounded-full bg-[#1e2230]" />
                <span className="size-2.5 rounded-full bg-[#1e2230]" />
                <span className="size-2.5 rounded-full bg-[#1e2230]" />
              </div>
              <ul className="space-y-4 p-5">
                {howIBuild.terminal.map((line) => (
                  <li
                    key={line}
                    className={
                      line.startsWith("#")
                        ? "text-[#8a90a2]"
                        : line.startsWith("✓")
                          ? "text-[#7cf5c8]"
                          : undefined
                    }
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 max-w-3xl border-t border-border pt-6 text-muted">
          {howIBuild.footer}
        </p>
      </div>
    </section>
  );
}
