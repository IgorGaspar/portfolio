import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeScript } from "@/components/ui/ThemeScript";
import { getDictionary } from "@/content";
import { hasLocale, htmlLang, localeHome, locales, siteUrl } from "@/lib/i18n";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { meta } = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: localeHome(locale),
      languages: {
        "pt-BR": localeHome("pt"),
        en: localeHome("en"),
        "x-default": localeHome("pt"),
      },
    },
    openGraph: {
      type: "website",
      url: localeHome(locale),
      siteName: "Igor Gaspar",
      title: meta.title,
      description: meta.description,
      locale: locale === "pt" ? "pt_BR" : "en_US",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [{ color: "#07080C" }],
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={htmlLang[locale]}
      data-theme="dark"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
