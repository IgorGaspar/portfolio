import type { MetadataRoute } from "next";
import { ajuda } from "@/content/ajuda";
import { aboutPath, htmlLang, locales, siteUrl } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  // The portfolio is the page that exists in both languages: /sobre <-> /en.
  const languages = Object.fromEntries(
    locales.map((locale) => [htmlLang[locale], `${siteUrl}${aboutPath(locale)}`]),
  );
  return [
    // Products showcase, Portuguese only.
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...locales.map((locale) => ({
      url: `${siteUrl}${aboutPath(locale)}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: { languages },
    })),
    // Offers-bot sales page, Portuguese only.
    { url: `${siteUrl}/robo-de-ofertas`, changeFrequency: "monthly", priority: 0.8 },
    // Offers-bot help center: the index and one page per topic, Portuguese only.
    { url: `${siteUrl}${ajuda.basePath}`, changeFrequency: "monthly", priority: 0.6 },
    ...ajuda.topics.map((topic) => ({
      url: `${siteUrl}${ajuda.basePath}/${topic.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
