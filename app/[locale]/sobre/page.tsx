import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/pages/PortfolioPage";
import { pt } from "@/content/pt";
import { portfolioLanguages } from "@/lib/i18n";

// Portfolio in Portuguese. Its English version is /en, so /en/sobre is a 404.
const path = "/sobre";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "pt" }];
}

// A child segment that sets its own openGraph loses the image generated for the parent
// segment, so the portfolio card is named explicitly.
const ogImage = {
  url: "/pt/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Igor Gaspar · igorgaspar.tech",
};

export const metadata: Metadata = {
  title: pt.meta.title,
  description: pt.meta.description,
  alternates: { canonical: path, languages: portfolioLanguages },
  openGraph: {
    type: "profile",
    url: path,
    siteName: "Igor Gaspar",
    title: pt.meta.title,
    description: pt.meta.description,
    locale: "pt_BR",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: pt.meta.title,
    description: pt.meta.description,
    images: [ogImage],
  },
};

export default async function Page({ params }: PageProps<"/[locale]/sobre">) {
  const { locale } = await params;
  if (locale !== "pt") notFound();
  return <PortfolioPage locale="pt" />;
}
