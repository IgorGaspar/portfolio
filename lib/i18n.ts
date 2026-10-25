export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** BCP 47 tag used in <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en" };

/** Public URL of the home page for a locale ("/" for pt, "/en" for en). */
export const localeHome = (locale: Locale) => (locale === defaultLocale ? "/" : `/${locale}`);

/**
 * Public URL of the portfolio ("about me") page for a locale. In Portuguese the root is the
 * products showcase, so the portfolio lives at /sobre; in English it is still /en.
 */
export const aboutPath = (locale: Locale) => (locale === defaultLocale ? "/sobre" : `/${locale}`);

/** hreflang of the portfolio, the page that exists in both languages. */
export const portfolioLanguages = {
  "pt-BR": aboutPath("pt"),
  en: aboutPath("en"),
  "x-default": aboutPath("pt"),
};

export const siteUrl = "https://igorgaspar.tech";

/**
 * The staging deploy (develop branch, SITE_ENV=staging) must stay out of search engines.
 * Read at build time, so it has to be set as a build variable too.
 */
export const isStaging = process.env.SITE_ENV === "staging";
