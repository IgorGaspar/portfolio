// Copy of the products showcase (/), the home page in Portuguese. Portuguese only: the
// products and services are sold in Brazil. The portfolio moved to /sobre.

export type Product = {
  id: "site" | "agente-b2b";
  badge: string;
  title: string;
  body: string;
  /** Real work that shows the product, with its own label. */
  example?: { label: string; text: string };
  image?: { src: string; width: number; height: number; alt: string };
  cta: { label: string; draft: string };
  /** Link to the technical case in the portfolio. */
  howItWasMade: string;
};

export const vitrine = {
  meta: {
    title: "Igor Gaspar · Automação, sites e agentes de IA para o seu negócio",
    description:
      "Robô de ofertas para WhatsApp, sites com assistente de atendimento, automações e agentes de IA. Feitos e mantidos por mim.",
  },
  nav: [
    { href: "#produtos", label: "Produtos" },
    { href: "/robo-de-ofertas", label: "Robô de ofertas", highlight: true },
    { href: "#work-with-me", label: "Como trabalho" },
    { href: "/sobre", label: "Sobre" },
    { href: "#contato", label: "Contato" },
  ],
  cta: "Fale comigo",
  /** Prefilled WhatsApp message of the general contact buttons. */
  draft: "Oi, Igor! Vim pelo site e quero conversar sobre um projeto.",
  englishHint: "About me in English",
  hero: {
    eyebrow: "Igor Gaspar · Automação e IA para negócios",
    title: "Automação e IA que trabalham pelo seu negócio.",
    subtitle:
      "Crio robôs, sites com atendimento inteligente e sistemas sob medida. Tudo rodando em produção, sem complicações técnicas para você.",
    cta: "Falar sobre um projeto customizado",
    secondary: "Ver produtos e robôs",
    /** Availability line under the CTAs. Only count what is running today. */
    status: "Operação online · 3 sistemas rodando 24/7",
  },
  own: {
    title: "Produtos próprios, prontos para usar.",
    subtitle: "Dois produtos que eu criei, mantenho e uso todos os dias.",
  },
  featured: {
    badge: "Produto próprio · em produção",
    title: "Robô de ofertas para WhatsApp",
    body: "Seu grupo de ofertas no piloto automático. O robô posta ofertas da Shopee, do Mercado Livre e da Shein com o seu link de afiliado, todos os dias, e eu cuido da implantação e da manutenção.",
    points: [
      "Postagens ilimitadas, no ritmo seguro para o WhatsApp",
      "Sem fidelidade",
      "Implantação e manutenção feitas por mim",
    ],
    cta: "Conhecer o robô",
    mediaAlt:
      "O robô em ação num grupo de ofertas real: mensagens com foto, preço de e por, cupom e link de compra chegando uma após a outra",
  },
  monai: {
    badge: "Produto próprio · disponível",
    title: "MonAI",
    body: "App de finanças pessoais em que você registra os gastos escrevendo como falaria. A IA entende, mostra uma prévia e só grava com a sua confirmação. Também cuida de contas, recorrentes e da previsão do mês.",
    image: {
      src: "/media/monai.webp",
      width: 1274,
      height: 903,
      alt: "Tela do MonAI com o campo do agente e as contas bancárias",
    },
    cta: "Criar minha conta",
    href: "https://monai.page",
    howItWasMade: "/sobre#projects",
  },
  products: {
    title: "Aplicações de IA sob medida.",
    subtitle: "Cases feitos para clientes e para operações reais. Você pode ver como foram feitos antes de conversar comigo.",
    exampleLabel: "Exemplo",
    items: [
      {
        id: "site",
        badge: "Cliente real · em produção",
        title: "Site com assistente de atendimento",
        body: "Um site que não só mostra o seu serviço, mas responde dúvidas na hora e leva o cliente pronto para o seu WhatsApp.",
        example: {
          label: "EstetiCaah, clínica de estética",
          text: "O visitante escolhe um procedimento, tira dúvidas com um assistente de IA e chega ao WhatsApp da clínica para agendar.",
        },
        image: {
          src: "/media/esteticaah.webp",
          width: 1207,
          height: 903,
          alt: "Página inicial do site da EstetiCaah",
        },
        cta: {
          label: "Quero um site assim",
          draft: "Oi, Igor! Vim pelo site e quero um site com assistente de atendimento.",
        },
        howItWasMade: "/sobre#projects",
      },
      {
        id: "agente-b2b",
        badge: "Case real · sob medida",
        title: "Agente de vendas B2B",
        body: "Um agente de IA que capta, qualifica e acompanha cada contato até marcar a reunião comercial. Tarefas repetitivas viram fluxo automático, com confirmação humana onde importa.",
        cta: {
          label: "Quero algo assim",
          draft: "Oi, Igor! Vim pelo site e quero automatizar uma parte do meu negócio.",
        },
        howItWasMade: "/sobre#projects",
      },
    ] satisfies Product[],
    howItWasMade: "Ver como foi feito",
  },
  agent: {
    title: "Ficou com alguma dúvida? Pergunte.",
    support:
      "Este assistente conhece meus produtos e meu jeito de trabalhar. Ele também é um exemplo do que eu construo.",
    chips: [
      "Como funciona o robô de ofertas?",
      "Você faz site com assistente para o meu negócio?",
      "Como é um projeto com você, do começo ao fim?",
    ],
  },
  contact: {
    title: "Vamos conversar sobre o seu negócio.",
    text: "Me conte o que você precisa. Eu respondo pessoalmente.",
    whatsapp: "Chamar no WhatsApp",
    hire: "Quer me contratar para a sua empresa ou para um freela?",
    hireLink: "Veja meu perfil",
  },
};
