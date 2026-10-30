import { AgentDockLazy } from "@/components/agent/AgentDockLazy";
import { buildChatLabels } from "@/components/agent/chat-labels";
import { Footer } from "@/components/layout/Footer";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { AgentInline } from "@/components/sections/AgentInline";
import { NeuralBackdrop } from "@/components/three/NeuralBackdrop";
import { WorkWithMe } from "@/components/sections/WorkWithMe";
import { VitrineContact } from "@/components/vitrine/VitrineContact";
import { VitrineFeatured } from "@/components/vitrine/VitrineFeatured";
import { VitrineHero } from "@/components/vitrine/VitrineHero";
import { VitrineNav } from "@/components/vitrine/VitrineNav";
import { VitrineProducts } from "@/components/vitrine/VitrineProducts";
import { pt } from "@/content/pt";
import { vitrine } from "@/content/vitrine";
import { siteUrl } from "@/lib/i18n";

/** Products showcase, the Portuguese home ("/"). Shares the agent and the work steps with /sobre. */
export function ShowcasePage() {
  const dict = { ...pt, agent: { ...pt.agent, ...vitrine.agent } };
  const { chat: chatLabels, dock: dockLabels } = buildChatLabels(dict);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Igor Gaspar",
    url: siteUrl,
    description: vitrine.meta.description,
    inLanguage: "pt-BR",
    sameAs: ["https://linkedin.com/in/igorfgaspar", "https://github.com/IgorGaspar"],
    makesOffer: [vitrine.featured.title, ...vitrine.products.items.map((item) => item.title)].map(
      (name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } }),
    ),
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
      <VitrineNav />
      <main id="main">
        <VitrineHero />
        <VitrineFeatured />
        <VitrineProducts />
        <AgentInline locale="pt" dict={dict} chatLabels={chatLabels} />
        <WorkWithMe dict={dict} />
        <VitrineContact />
      </main>
      <Footer locale="pt" dict={dict} localeHrefs={{ pt: "/" }} />
      <MotionRoot />
      <NeuralBackdrop />
      <AgentDockLazy locale="pt" labels={dockLabels} />
    </>
  );
}
