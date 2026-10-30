import type { MetadataRoute } from "next";
import { isStaging, siteUrl } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  if (isStaging) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
