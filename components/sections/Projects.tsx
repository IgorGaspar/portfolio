import Image from "next/image";
import type { Dictionary } from "@/content";
import { projectIds, projects } from "@/content/projects";
import { ArchitectureDiagram } from "../diagrams/ArchitectureDiagram";
import { Badge } from "../ui/Badge";
import { SectionHeading } from "../ui/SectionHeading";

const labelClass = "font-mono text-xs uppercase tracking-widest text-muted";

export function Projects({ dict }: { dict: Dictionary }) {
  const { ui } = dict;
  const total = String(projectIds.length).padStart(2, "0");

  return (
    <section id="projects" data-projects aria-labelledby="projects-title" className="section">
      <div className="container-page">
        <SectionHeading
          id="projects-title"
          title={dict.projects.title}
          subtitle={dict.projects.subtitle}
        />

        <div data-projects-viewport className="mt-16">
          <div data-projects-track className="space-y-10">
            {projectIds.map((id, i) => {
              const data = projects[id];
              const copy = dict.projects.items[id];

              return (
                <article
                  key={id}
                  aria-labelledby={`project-${id}`}
                  data-project
                  className="project-card grid gap-10 rounded-2xl border border-border bg-surface p-6 sm:p-10 lg:grid-cols-2 lg:gap-14"
                >
                  <div data-project-text className="min-w-0">
                    <div data-project-text-inner>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Badge>{copy.badge}</Badge>
                        <span
                          aria-hidden="true"
                          data-project-index
                          className="font-mono text-xs text-muted"
                        >
                          {String(i + 1).padStart(2, "0")} / {total}
                        </span>
                      </div>

                      <h3 id={`project-${id}`} className="mt-6 text-2xl font-semibold sm:text-3xl">
                        {copy.title}
                      </h3>
                      <p className="mt-4 text-lead">{copy.summary}</p>

                      <dl className="mt-8 space-y-6">
                        <div>
                          <dt className={labelClass}>{ui.problem}</dt>
                          <dd className="mt-2 text-muted">{copy.problem}</dd>
                        </div>
                        <div>
                          <dt className={labelClass}>{ui.solution}</dt>
                          <dd className="mt-2 text-muted">{copy.solution}</dd>
                        </div>
                      </dl>

                      <details className="group mt-8 rounded-xl border border-border">
                        <summary className="flex list-none items-center justify-between gap-4 px-4 py-3 font-medium">
                          {ui.lookInside}
                          <span
                            aria-hidden="true"
                            className="font-mono text-accent transition-transform group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <div className="border-t border-border px-4 py-4">
                          <h4 className={labelClass}>{ui.engineering}</h4>
                          <ul className="mt-3 space-y-2 text-sm text-muted">
                            {copy.engineering.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span
                                  aria-hidden="true"
                                  className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>

                      <h4 className={`mt-8 ${labelClass}`}>{ui.stack}</h4>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {copy.stack.map((item) => (
                          <li key={item} className="pill bg-bg">
                            {item}
                          </li>
                        ))}
                      </ul>

                      {data.link && (
                        <p className="mt-8 text-sm">
                          <span className="sr-only">{ui.links}: </span>
                          <a
                            href={data.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                          >
                            {data.link.label} ↗
                          </a>
                          {copy.linkNote && (
                            <span className="ml-2 text-muted">{copy.linkNote}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div data-project-media className="flex min-w-0 flex-col justify-center gap-6">
                    {data.image && data.link && (
                      <a
                        href={data.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor={`${ui.view} ↗`}
                        className="block overflow-hidden rounded-xl border border-border"
                      >
                        <Image
                          src={data.image.src}
                          alt={copy.mediaAlt ?? ""}
                          width={data.image.width}
                          height={data.image.height}
                          sizes="(min-width: 1024px) 540px, 92vw"
                          className="h-auto w-full"
                        />
                      </a>
                    )}
                    {data.diagram && copy.diagram && (
                      <div className="overflow-x-auto rounded-xl border border-border bg-bg p-4">
                        <ArchitectureDiagram
                          variant={data.diagram}
                          label={copy.diagram.label}
                          nodeLabels={copy.diagram.nodes}
                        />
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
