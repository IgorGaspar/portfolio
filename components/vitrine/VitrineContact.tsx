import Link from "next/link";
import { pt } from "@/content/pt";
import { vitrine } from "@/content/vitrine";
import { contact as channels } from "@/lib/contact";
import { WhatsAppLink } from "../robo/WhatsAppLink";
import { CopyButton } from "../ui/CopyButton";

const labelClass = "font-mono text-sm text-muted";

export function VitrineContact() {
  const { contact } = vitrine;

  return (
    <section id="contato" aria-labelledby="contact-title" className="section relative overflow-hidden">
      <div aria-hidden="true" className="neural-static" />
      <div className="container-page">
        <h2 id="contact-title" data-reveal="mask" className="text-hero font-bold">
          {contact.title}
        </h2>
        <p data-reveal="up" className="mt-6 max-w-2xl text-lead text-muted">
          {contact.text}
        </p>

        <WhatsAppLink draft={vitrine.draft} className="btn btn-solid mt-10">
          {contact.whatsapp}
        </WhatsAppLink>

        <dl className="mt-12 divide-y divide-border border-y border-border">
          <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:items-center">
            <dt className={labelClass}>{pt.contact.emailLabel}</dt>
            <dd className="flex flex-wrap items-center gap-3">
              <a href={`mailto:${channels.email}`} className="link break-all">
                {channels.email}
              </a>
              <CopyButton value={channels.email} label={pt.ui.copy} copiedLabel={pt.ui.copied} />
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
        </dl>

        <p className="mt-10 text-muted">
          {contact.hire}{" "}
          <Link href="/sobre" className="link">
            {contact.hireLink} →
          </Link>
        </p>
      </div>
    </section>
  );
}
