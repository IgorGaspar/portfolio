import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AjudaNav } from "@/components/ajuda/AjudaNav";
import { RoboFooter } from "@/components/robo/RoboFooter";
import { ajuda } from "@/content/ajuda";

// Help center of the offers bot. Portuguese only: /en/robo-de-ofertas/ajuda is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "pt" }];
}

export const metadata: Metadata = {
  title: ajuda.meta.title,
  description: ajuda.meta.description,
  alternates: { canonical: ajuda.basePath },
  openGraph: {
    type: "website",
    url: ajuda.basePath,
    siteName: "Igor Gaspar",
    title: ajuda.meta.title,
    description: ajuda.meta.description,
    locale: "pt_BR",
    images: [{ url: "/pt/opengraph-image", width: 1200, height: 630, alt: "Igor Gaspar · igorgaspar.tech" }],
  },
};

export default async function Page({ params }: PageProps<"/[locale]/robo-de-ofertas/ajuda">) {
  const { locale } = await params;
  if (locale !== "pt") notFound();

  return (
    <>
      <a
        href="#main"
        className="btn btn-solid sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <AjudaNav />
      <main id="main" className="container-page pb-16 pt-12 sm:pt-20">
        <header className="max-w-3xl">
          <p className="font-mono text-sm text-accent">{ajuda.index.eyebrow}</p>
          <h1 className="mt-3 text-section font-semibold">{ajuda.index.title}</h1>
          <p className="mt-5 text-lead text-muted">{ajuda.index.subtitle}</p>
        </header>

        <section aria-labelledby="todos" className="mt-12 max-w-3xl">
          <h2 id="todos" className="sr-only">
            {ajuda.index.all}
          </h2>
          <ol className="divide-y divide-border rounded-xl border border-border bg-surface">
            {ajuda.topics.map((topic, i) => (
              <li key={topic.slug}>
                <Link
                  href={`${ajuda.basePath}/${topic.slug}`}
                  className="group flex items-start gap-4 px-5 py-5 transition-colors hover:bg-bg sm:gap-5"
                >
                  <span aria-hidden="true" className="pt-0.5 font-mono text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold">{topic.title}</span>
                    <span className="mt-1 block text-muted">{topic.summary}</span>
                    <span className="pill mt-3">{topic.scope}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="pt-0.5 text-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <RoboFooter />
    </>
  );
}
