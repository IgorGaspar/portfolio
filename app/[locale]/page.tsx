import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { AgentInline } from "@/components/sections/AgentInline";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { WorkWithMe } from "@/components/sections/WorkWithMe";
import { getDictionary } from "@/content";
import { hasLocale } from "@/lib/i18n";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <a
        href="#main"
        className="btn btn-solid sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        {dict.ui.skipToContent}
      </a>
      <Nav locale={locale} dict={dict} />
      <main id="main">
        <Hero dict={dict} />
        <AgentInline dict={dict} />
        <WhatIDo dict={dict} />
        <Projects dict={dict} />
        <HowIBuild dict={dict} />
        <Stack dict={dict} />
        <Journey dict={dict} />
        <WorkWithMe dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  );
}
