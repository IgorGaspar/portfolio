import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { RoboAbout } from "@/components/robo/RoboAbout";
import { RoboBenefits } from "@/components/robo/RoboBenefits";
import { RoboClosing } from "@/components/robo/RoboClosing";
import { RoboFaq } from "@/components/robo/RoboFaq";
import { RoboFooter } from "@/components/robo/RoboFooter";
import { RoboHero } from "@/components/robo/RoboHero";
import { RoboHowItWorks } from "@/components/robo/RoboHowItWorks";
import { RoboInPractice } from "@/components/robo/RoboInPractice";
import { RoboNav } from "@/components/robo/RoboNav";
import { RoboPlans } from "@/components/robo/RoboPlans";
import { RoboSetup } from "@/components/robo/RoboSetup";
import { pt } from "@/content/pt";
import { robo } from "@/content/robo";
import { siteUrl } from "@/lib/i18n";

// Sales page of the offers bot. Portuguese only: /en/robo-de-ofertas is a 404.
const path = "/robo-de-ofertas";

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "pt" }];
}

// A child segment that sets its own openGraph loses the image generated for the parent
// segment, so the portfolio card is named explicitly until the page has an image of its own.
const ogImage = {
  url: "/pt/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Igor Gaspar · igorgaspar.tech",
};

export const metadata: Metadata = {
  title: robo.meta.title,
  description: robo.meta.description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    url: path,
    siteName: "Igor Gaspar",
    title: robo.meta.title,
    description: robo.meta.description,
    locale: "pt_BR",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: robo.meta.title,
    description: robo.meta.description,
    images: [ogImage],
  },
};

export default async function Page({ params }: PageProps<"/[locale]/robo-de-ofertas">) {
  const { locale } = await params;
  if (locale !== "pt") notFound();

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: robo.hero.eyebrow,
    description: robo.meta.description,
    url: `${siteUrl}${path}`,
    inLanguage: "pt-BR",
    areaServed: "BR",
    provider: { "@type": "Person", name: "Igor Gaspar", url: siteUrl },
    offers: robo.plans.items
      .filter((plan) => plan.id !== "pro")
      .map((plan) => {
        // "R$ 99" -> 99, "R$ 99,90" -> 99.9
        const price = Number(plan.price.replace(/[^\d,]/g, "").replace(",", "."));
        return {
          "@type": "Offer",
          name: plan.name,
          price,
          priceCurrency: "BRL",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price,
            priceCurrency: "BRL",
            unitCode: "MON",
          },
        };
      }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="btn btn-solid sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        {pt.ui.skipToContent}
      </a>
      <div aria-hidden="true" id="scroll-progress" />
      <RoboNav />
      <main id="main">
        <RoboHero />
        <RoboHowItWorks />
        <RoboInPractice />
        <RoboBenefits />
        <RoboPlans />
        <RoboSetup />
        <RoboFaq />
        <RoboAbout />
        <RoboClosing />
      </main>
      <RoboFooter />
      <MotionRoot />
    </>
  );
}
