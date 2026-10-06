export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** BCP 47 tag used in <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en" };

/** Public URL of the home page for a locale ("/" for pt, "/en" for en). */
export const localeHome = (locale: Locale) =>
  locale === defaultLocale ? "/" : `/${locale}`;

export const siteUrl = "https://igorgaspar.tech";
