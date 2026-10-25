import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioPage } from "@/components/pages/PortfolioPage";
import { ShowcasePage } from "@/components/pages/ShowcasePage";
import { vitrine } from "@/content/vitrine";
import { hasLocale } from "@/lib/i18n";

// A child segment that sets its own openGraph loses the image generated for the parent
// segment, so the card is named explicitly until the showcase has an image of its own.
const ogImage = {
  url: "/pt/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Igor Gaspar · igorgaspar.tech",
};

// "/" is the products showcase (Portuguese only); "/en" is still the English portfolio,
// whose metadata comes from the layout.
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "pt") return {};
  return {
    title: vitrine.meta.title,
    description: vitrine.meta.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Igor Gaspar",
      title: vitrine.meta.title,
      description: vitrine.meta.description,
      locale: "pt_BR",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: vitrine.meta.title,
      description: vitrine.meta.description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return locale === "pt" ? <ShowcasePage /> : <PortfolioPage locale={locale} />;
}
