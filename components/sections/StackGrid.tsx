"use client";

import { useState } from "react";
import { projectIds, stackPills, type ProjectId } from "@/content/projects";

type Props = {
  groups: { label: string; items: string[] }[];
  projects: { id: ProjectId; name: string }[];
};

const usedBy = (project: ProjectId, pill: string) => {
  const name = pill.toLowerCase();
  return stackPills[project].some((key) => name === key || name.startsWith(`${key} `));
};

/** Stack pills with project chips: pick a project to highlight what it uses (spec 3.3.6). */
export function StackGrid({ groups, projects }: Props) {
  const [pinned, setPinned] = useState<ProjectId | null>(null);
  const [hovered, setHovered] = useState<ProjectId | null>(null);
  const active = hovered ?? pinned;

  return (
    <div className="mt-12">
      <ul className="flex flex-wrap gap-2" onMouseLeave={() => setHovered(null)}>
        {projectIds.map((id) => (
          <li key={id}>
            <button
              type="button"
              aria-pressed={pinned === id}
              onClick={() => setPinned(pinned === id ? null : id)}
              onMouseEnter={() => setHovered(id)}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
              className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-on-accent"
            >
              {projects.find((project) => project.id === id)?.name}
            </button>
          </li>
        ))}
      </ul>

      <dl className="mt-8 divide-y divide-border border-y border-border">
        {groups.map((group) => (
          <div key={group.label} className="grid gap-4 py-6 md:grid-cols-[12rem_1fr] md:gap-8">
            <dt className="font-mono text-sm text-muted">{group.label}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const dimmed = active !== null && !usedBy(active, item);
                  const lit = active !== null && !dimmed;
                  return (
                    <li
                      key={item}
                      data-pill
                      className={`pill transition-[opacity,border-color] duration-200 ${dimmed ? "opacity-20" : ""} ${lit ? "border-accent" : ""}`}
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
