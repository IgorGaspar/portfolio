import { afterEach, describe, expect, it, vi } from "vitest";
import { ajuda } from "@/content/ajuda";

// isStaging is read when lib/i18n loads, so each case imports the modules fresh.
async function load(siteEnv?: string) {
  vi.resetModules();
  if (siteEnv !== undefined) vi.stubEnv("SITE_ENV", siteEnv);
  const [{ default: robots }, { default: sitemap }] = await Promise.all([
    import("@/app/robots"),
    import("@/app/sitemap"),
  ]);
  return { robots, sitemap };
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("robots", () => {
  it("lets crawlers in on production, except the API", async () => {
    const { robots } = await load();
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: "https://igorgaspar.tech/sitemap.xml",
    });
  });

  it("keeps the whole staging site out of search engines", async () => {
    const { robots } = await load("staging");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});

describe("sitemap", () => {
  it("lists the showcase, both portfolio pages as a language pair and the offers bot", async () => {
    const { sitemap } = await load();
    const entries = sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://igorgaspar.tech/",
      "https://igorgaspar.tech/sobre",
      "https://igorgaspar.tech/en",
      "https://igorgaspar.tech/robo-de-ofertas",
      "https://igorgaspar.tech/robo-de-ofertas/ajuda",
      ...ajuda.topics.map((topic) => `https://igorgaspar.tech/robo-de-ofertas/ajuda/${topic.slug}`),
    ]);
    const languages = { "pt-BR": "https://igorgaspar.tech/sobre", en: "https://igorgaspar.tech/en" };
    expect(entries[1].alternates?.languages).toEqual(languages);
    expect(entries[2].alternates?.languages).toEqual(languages);
    expect(entries[0].alternates).toBeUndefined();
  });
});
