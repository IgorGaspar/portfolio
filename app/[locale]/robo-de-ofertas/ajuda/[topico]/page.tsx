import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaBlocks } from "@/components/ajuda/AjudaBlocks";
import { AjudaCommands } from "@/components/ajuda/AjudaCommands";
import { AjudaNav } from "@/components/ajuda/AjudaNav";
import { RoboFooter } from "@/components/robo/RoboFooter";
import { WhatsAppLink } from "@/components/robo/WhatsAppLink";
import { ajuda } from "@/content/ajuda";
import { siteUrl } from "@/lib/i18n";

// One page per help topic. Portuguese only: /en/... is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return ajuda.topics.map((topic) => ({ locale: "pt", topico: topic.slug }));
}

const find = (slug: string) => ajuda.topics.find((topic) => topic.slug === slug);

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/robo-de-ofertas/ajuda/[topico]">): Promise<Metadata> {
  const { topico } = await params;
  const topic = find(topico);
  if (!topic) return {};
  const path = `${ajuda.basePath}/${topic.slug}`;
  const title = `${topic.title} · Ajuda do robô de ofertas`;
  return {
    title,
    description: topic.lead,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: "Igor Gaspar",
      title,
      description: topic.lead,
      locale: "pt_BR",
      images: [
        { url: "/pt/opengraph-image", width: 1200, height: 630, alt: "Igor Gaspar · igorgaspar.tech" },
      ],
    },
  };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/robo-de-ofertas/ajuda/[topico]">) {
  const { locale, topico } = await params;
  const topic = find(topico);
  if (locale !== "pt" || !topic) notFound();

  const related = topic.related.map(find).filter((t) => t !== undefined);
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Robô de ofertas", item: `${siteUrl}/robo-de-ofertas` },
      { "@type": "ListItem", position: 2, name: ajuda.index.eyebrow, item: `${siteUrl}${ajuda.basePath}` },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: `${siteUrl}${ajuda.basePath}/${topic.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="btn btn-solid sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <AjudaNav />
      <main id="main" className="container-page pb-16 pt-10 sm:pt-16">
        <nav aria-label="Você está em" className="text-sm text-muted">
          <Link href={ajuda.basePath} className="py-2 transition-colors hover:text-text">
            ← {ajuda.topicPage.back}
          </Link>
        </nav>

        <article className="mt-6 max-w-3xl">
          <header>
            <span className="pill">{topic.scope}</span>
            <h1 className="mt-4 text-section font-semibold">{topic.title}</h1>
            <p className="mt-5 text-lead text-muted">{topic.lead}</p>
          </header>

          {topic.sections.length > 1 && (
            <nav aria-labelledby="toc" className="mt-8 rounded-xl border border-border bg-surface p-5">
              <h2 id="toc" className="text-sm font-medium text-muted">
                {ajuda.topicPage.onThisPage}
              </h2>
              <ol className="mt-3 space-y-1">
                {topic.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block py-1 transition-colors hover:text-accent"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {topic.slug === "comandos" ? (
            <div className="mt-10">
              <AjudaCommands />
            </div>
          ) : (
            topic.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="mt-12 scroll-mt-24"
              >
                <h2 id={`${section.id}-title`} className="mb-5 text-2xl font-semibold">
                  {section.title}
                </h2>
                <AjudaBlocks blocks={section.blocks} />
              </section>
            ))
          )}

          {related.length > 0 && (
            <section aria-labelledby="veja-tambem" className="mt-16">
              <h2 id="veja-tambem" className="text-xl font-semibold">
                {ajuda.topicPage.related}
              </h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`${ajuda.basePath}/${item.slug}`}
                      className="project-card block h-full p-5"
                    >
                      <span className="block font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm text-muted">{item.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <aside aria-labelledby="duvida" className="mt-16 rounded-xl border border-border bg-surface p-6">
            <h2 id="duvida" className="text-xl font-semibold">
              {ajuda.topicPage.stuck}
            </h2>
            <p className="mt-2 text-muted">{ajuda.topicPage.stuckBody}</p>
            <WhatsAppLink
              draft={`${ajuda.topicPage.stuckDraft}${topic.title}`}
              className="btn btn-solid mt-5"
            >
              {ajuda.topicPage.stuckCta}
            </WhatsAppLink>
          </aside>
        </article>
      </main>
      <RoboFooter />
    </>
  );
}
