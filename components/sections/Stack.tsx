import type { Dictionary } from "@/content";
import { projectIds, projects } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "../ui/SectionHeading";
import { StackGrid } from "./StackGrid";

export function Stack({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { stack } = dict;

  return (
    <section id="stack" aria-labelledby="stack-title" className="section">
      <div className="container-page">
        <SectionHeading id="stack-title" title={stack.title} />
        <StackGrid
          groups={stack.groups}
          projects={projectIds.map((id) => ({
            id,
            name: projects[id].name[locale],
          }))}
        />
      </div>
    </section>
  );
}
