import type { Dictionary } from "@/content";
import { SectionHeading } from "../ui/SectionHeading";

export function Stack({ dict }: { dict: Dictionary }) {
  const { stack } = dict;

  return (
    <section id="stack" aria-labelledby="stack-title" className="section">
      <div className="container-page">
        <SectionHeading id="stack-title" title={stack.title} />

        <dl className="mt-16 divide-y divide-border border-y border-border">
          {stack.groups.map((group) => (
            <div key={group.label} className="grid gap-4 py-6 md:grid-cols-[12rem_1fr] md:gap-8">
              <dt className="font-mono text-sm text-muted">{group.label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="pill">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
