import type { Dictionary } from "@/content";
import { contact as channels, mailto } from "@/lib/contact";
import { AgentCta } from "../agent/AgentCta";
import { CopyButton } from "../ui/CopyButton";

const labelClass = "font-mono text-sm text-muted";

export function Contact({ dict }: { dict: Dictionary }) {
  const { contact, ui } = dict;

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <div className="container-page">
        <h2 id="contact-title" data-reveal="mask" className="text-hero font-bold">
          {contact.title}
        </h2>
        <p data-reveal="up" className="mt-6 max-w-2xl text-lead text-muted">
          {contact.text}
        </p>

        <dl className="mt-12 divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:items-center">
            <dt className={labelClass}>{contact.emailLabel}</dt>
            <dd className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${channels.email}`} className="link break-all">
                {channels.email}
              </a>
              <CopyButton value={channels.email} label={ui.copy} copiedLabel={ui.copied} />
            </dd>
          </div>
          <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
            <dt className={labelClass}>LinkedIn</dt>
            <dd>
              <a
                href={channels.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {channels.linkedin.label}
              </a>
            </dd>
          </div>
          <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
            <dt className={labelClass}>GitHub</dt>
            <dd>
              <a
                href={channels.github.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                {channels.github.label}
              </a>
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-muted">{contact.location}</p>
        {contact.languages && <p className="mt-2 text-muted">{contact.languages}</p>}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <AgentCta href={mailto(ui.subjectHire)} draft={ui.draftHire} className="btn">
            {contact.ctaHire}
          </AgentCta>
          <AgentCta href={mailto(ui.subjectProject)} draft={ui.draftProject} className="btn">
            {contact.ctaProject}
          </AgentCta>
        </div>

        <AgentCta
          href="#agent"
          className="mt-8 inline-block py-2 text-sm text-muted underline-offset-4 transition-colors hover:text-accent-2 hover:underline"
        >
          {contact.closing}
        </AgentCta>
      </div>
    </section>
  );
}
