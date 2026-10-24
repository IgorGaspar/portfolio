import Image from "next/image";
import { robo } from "@/content/robo";
import { SectionHeading } from "../ui/SectionHeading";

export function RoboInPractice() {
  const { inPractice } = robo;

  return (
    <section aria-labelledby="na-pratica-title" className="section">
      <div className="container-page">
        <SectionHeading
          id="na-pratica-title"
          title={inPractice.title}
          subtitle={inPractice.subtitle}
        />

        <ul className="mt-16 grid gap-8 md:grid-cols-3">
          {inPractice.shots.map((shot) => (
            <li key={shot.src} data-reveal="up">
              <figure className="project-card flex h-full flex-col gap-5 rounded-2xl border border-border bg-surface p-4 sm:p-5">
                <div className="overflow-hidden rounded-xl border border-border">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={shot.width}
                    height={shot.height}
                    sizes="(min-width: 768px) 360px, 92vw"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-auto text-muted">{shot.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
