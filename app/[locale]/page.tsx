import { notFound } from "next/navigation";
import { AgentDockLazy } from "@/components/agent/AgentDockLazy";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { NeuralBackdrop } from "@/components/three/NeuralBackdrop";
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
import { hasLocale, htmlLang, siteUrl } from "@/lib/i18n";

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const chatLabels = {
    chips: dict.agent.chips,
    placeholder: dict.agent.placeholder,
    notice: dict.agent.notice,
    send: dict.ui.send,
    stop: dict.ui.stop,
    you: dict.ui.you,
    agentName: dict.ui.agentName,
  };

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Igor Gaspar",
    url: siteUrl,
    jobTitle: locale === "pt" ? "Engenheiro de IA e Desenvolvedor Fullstack" : "AI Engineer & Fullstack Developer",
    description: dict.meta.description,
    inLanguage: htmlLang[locale],
    sameAs: ["https://linkedin.com/in/igorfgaspar", "https://github.com/IgorGaspar"],
    knowsAbout: ["AI agents", "LLM applications", "TypeScript", "Next.js"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="btn btn-solid sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        {dict.ui.skipToContent}
      </a>
      <div aria-hidden="true" id="scroll-progress" />
      <Nav locale={locale} dict={dict} />
      <main id="main">
        <Hero dict={dict} />
        <AgentInline locale={locale} dict={dict} chatLabels={chatLabels} />
        <WhatIDo dict={dict} />
        <Projects dict={dict} />
        <HowIBuild dict={dict} />
        <Stack locale={locale} dict={dict} />
        <Journey dict={dict} />
        <WorkWithMe dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
      <NeuralBackdrop />
      <MotionRoot />
      <AgentDockLazy
        locale={locale}
        labels={{
          ...chatLabels,
          title: dict.agent.title,
          openAgent: dict.ui.openAgent,
          close: dict.ui.close,
          email: dict.contact.emailLabel,
        }}
      />
    </>
  );
}
