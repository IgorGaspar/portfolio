import type { MetadataRoute } from "next";
import { htmlLang, localeHome, locales, siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [htmlLang[locale], `${siteUrl}${localeHome(locale)}`]),
  );
  return [
    ...locales.map((locale) => ({
      url: `${siteUrl}${localeHome(locale)}`,
      changeFrequency: "monthly" as const,
      priority: locale === "pt" ? 1 : 0.9,
      alternates: { languages },
    })),
    // Offers-bot sales page, Portuguese only.
    { url: `${siteUrl}/robo-de-ofertas`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
