// Copy and plans of the offers-bot landing page (/robo-de-ofertas). Portuguese only:
// the product is sold to Brazilian affiliates.

type TitledText = { title: string; body: string };

export type PlanFeature = { label: string; included: boolean };

export type Plan = {
  id: "essencial" | "plus" | "pro";
  name: string;
  /** Monthly price, or the launch note while the plan is not on sale. */
  price: string;
  priceNote?: string;
  firstMonth?: string;
  setup?: string;
  badge?: string;
  summary: string;
  features: PlanFeature[];
  extra: string;
  cta: string;
  /** Prefilled WhatsApp message for this plan. */
  draft: string;
};

const featureLabels = [
  "Shopee pelo seu link",
  "Mercado Livre pelo seu link",
  "Shein pelo seu link*",
  "O robô busca sozinho as ofertas da Shopee que mais pagam",
  "Qualquer link da Shopee ou do Mercado Livre vira o seu link*",
  "Mercado Livre no automático*",
  "Amazon, AliExpress e mais",
  "Resumo semanal no WhatsApp",
] as const;

/** The first `count` features are included, the rest are not. */
const features = (count: number): PlanFeature[] =>
  featureLabels.map((label, i) => ({ label, included: i < count }));

export const robo = {
  meta: {
    title: "Robô de ofertas para WhatsApp · Igor Gaspar",
    description:
      "Seu grupo de ofertas no piloto automático: ofertas da Shopee, Mercado Livre e Shein com o seu link de afiliado, postadas sozinhas nos seus horários e controladas pelo celular.",
  },
  nav: [
    { href: "#como-funciona", label: "Como funciona" },
    { href: "#planos", label: "Planos" },
    { href: "#implantacao", label: "Implantação" },
    { href: "#duvidas", label: "Dúvidas" },
  ],
  cta: "Falar no WhatsApp",
  hero: {
    eyebrow: "Robô de ofertas para WhatsApp",
    title: "Seu grupo de ofertas no piloto automático.",
    subtitle:
      "Ofertas com o seu link de afiliado, postadas sozinhas nos horários que você escolher. Cada venda vira comissão para você, e tudo se controla pelo celular.",
    cta: "Quero meu robô",
    secondary: "Ver planos",
    highlights: ["Postagens ilimitadas", "Sem fidelidade", "Controle pelo WhatsApp"],
    mediaAlt:
      "Conversa com o robô: link de afiliado enviado e a mensagem pronta com preço de e por",
  },
  howItWorks: {
    title: "Como funciona.",
    subtitle:
      "Você manda o link ou deixa o robô escolher. Ele monta a mensagem e posta na hora certa.",
    steps: [
      {
        title: "As ofertas chegam.",
        body: "No Plus, o robô busca na Shopee os produtos que pagam mais comissão. Você também pode mandar links no privado dele.",
      },
      {
        title: "A mensagem fica pronta.",
        body: "Foto, nome, preço “de” e “por”, desconto, cupom e o seu link de afiliado, no padrão dos grupos que vendem.",
      },
      {
        title: "Posta sozinho.",
        body: "Nos horários que você escolher, o dia todo, sem repetir produto e alternando as categorias.",
      },
    ] satisfies TitledText[],
  },
  inPractice: {
    title: "Na prática.",
    subtitle: "Prints reais do robô funcionando num grupo de ofertas.",
    shots: [
      {
        src: "/media/robo/link-ml.webp",
        width: 640,
        height: 1252,
        caption: "Link comum do Mercado Livre vira oferta com o seu link de afiliado.",
        alt: "Conversa com o robô: um link comum do Mercado Livre vira uma oferta pronta com link de afiliado",
      },
      {
        src: "/media/robo/mensagem.webp",
        width: 640,
        height: 1125,
        caption: "Mensagem pronta, com preço “de” e “por”, no padrão do grupo.",
        alt: "Conversa com o robô: link de afiliado enviado e a mensagem pronta com preço de e por",
      },
      {
        src: "/media/robo/fila.webp",
        width: 640,
        height: 931,
        caption: "A fila mostra quanto cada oferta rende de comissão.",
        alt: "Comando fila: próximas ofertas com preço, desconto e quanto rende de comissão por venda",
      },
    ],
  },
  benefits: {
    title: "Mais ofertas no ar, mais comissão no bolso.",
    items: [
      {
        title: "Seu link em cada post",
        body: "Toda venda que sai pelo grupo gera comissão direto na sua conta de afiliado.",
      },
      {
        title: "Ofertas que pagam mais",
        body: "No Plus, o robô escolhe sozinho os produtos com maior comissão da Shopee, no nicho do seu grupo.",
      },
      {
        title: "Vendendo o dia todo",
        body: "Dezenas de ofertas por dia, nos seus horários, sem você parar o que está fazendo.",
      },
      {
        title: "Cupons que também rendem",
        body: "Quem resgata os cupons da Shopee pelo seu link também gera comissão para você.",
      },
    ] satisfies TitledText[],
    includedTitle: "Incluso em todos os planos",
    included: [
      "Controle total pelo WhatsApp, com comandos simples",
      "Horários de postagem do seu jeito",
      "Fila de ofertas: ver, remover ou enviar na hora",
      "Cupons com o seu link e a sua arte, que você manda uma vez só",
      "Títulos automáticos nas datas promocionais",
      "Avisos e mensagens livres para o grupo",
      "Atualizações e manutenção sem custo extra",
      "Suporte pelo WhatsApp",
    ],
  },
  plans: {
    title: "Planos.",
    subtitle: "Postagens ilimitadas em todos os planos, no ritmo seguro para o WhatsApp.",
    perMonth: "/mês",
    included: "Incluso",
    notIncluded: "Não incluso",
    items: [
      {
        id: "essencial",
        name: "Essencial",
        price: "R$ 99",
        firstMonth: "1º mês por R$ 79",
        setup: "Implantação: R$ 200",
        summary:
          "Você manda os links da Shopee e do Mercado Livre, o robô cria a mensagem, agenda e posta.",
        features: features(2),
        extra: "Grupo extra por R$ 29/mês",
        cta: "Quero o Essencial",
        draft: "Oi Igor! Vi a página do robô de ofertas e quero o plano Essencial.",
      },
      {
        id: "plus",
        name: "Plus",
        price: "R$ 119",
        firstMonth: "1º mês por R$ 99",
        setup: "Implantação: R$ 300",
        badge: "Recomendado",
        summary:
          "O robô busca sozinho as ofertas da Shopee que mais pagam, no seu nicho. E qualquer link vira o seu link de afiliado.",
        features: features(5),
        extra: "Grupo extra por R$ 29/mês",
        cta: "Quero o Plus",
        draft: "Oi Igor! Vi a página do robô de ofertas e quero o plano Plus.",
      },
      {
        id: "pro",
        name: "Pro",
        price: "Em breve",
        priceNote: "Valores a definir",
        badge: "Lançamento futuro",
        summary: "Tudo do Plus, com o Mercado Livre no automático e mais lojas.",
        features: features(8),
        extra: "2 grupos extras inclusos",
        cta: "Me avise do lançamento",
        draft: "Oi Igor! Vi a página do robô de ofertas e quero saber quando o plano Pro sair.",
      },
    ] satisfies Plan[],
    footnote:
      "* Usa o login da sua conta de afiliado, que precisa ser renovado de tempos em tempos. O robô avisa quando for a hora.",
  },
  setup: {
    title: "Implantação.",
    subtitle:
      "Pagamento único. Você recebe o grupo funcionando. A do Pro sai junto com o lançamento.",
    prices: [
      { plan: "Plano Essencial", price: "R$ 200" },
      { plan: "Plano Plus", price: "R$ 300" },
    ],
    includedTitle: "O que está incluso",
    included: [
      "Ligar o número do robô ao sistema, pelo QR Code",
      "Suporte para criar e conectar as suas contas de afiliado",
      "Definir os horários de postagem",
      "Cadastrar o seu link de cupons e a arte do cupom, se tiver",
      "Treinamento dos comandos pelo celular",
      "Acompanhamento das primeiras postagens",
      "No Plus: o nicho do seu grupo na Shopee (ex.: casa, cozinha) e o mínimo de desconto, comissão, avaliação e vendas",
      "No Plus: ativar a sua sessão de afiliado nas lojas parceiras",
    ],
    yoursTitle: "O que você providencia",
    yours: [
      {
        title: "Um chip novo só para o robô",
        body: "No seu CPF, com WhatsApp Business num celular. Ele aquece por 1 a 2 semanas antes de postar no ritmo cheio.",
      },
      {
        title: "O grupo no seu número pessoal",
        body: "O robô entra como administrador. Assim o grupo é sempre seu, aconteça o que acontecer com o chip.",
      },
      {
        title: "Contas de afiliado no seu nome",
        body: "Shopee, Mercado Livre e Shein, conforme o plano. A comissão cai direto para você.",
      },
      {
        title: "Celular do robô ligado",
        body: "Entrar na internet pelo menos a cada 10 dias e manter a linha com recarga, para o WhatsApp não desconectar.",
      },
    ] satisfies TitledText[],
  },
  faq: {
    title: "Dúvidas.",
    items: [
      {
        title: "Preciso de computador?",
        body: "Não. Você controla tudo pelo WhatsApp do celular, mandando comandos simples no privado do robô: ver a fila, mudar horários, mandar um link na hora, pausar.",
      },
      {
        title: "Preciso já ser afiliado?",
        body: "Não. Na implantação eu ajudo você a criar e conectar as contas de afiliado da Shopee, do Mercado Livre e da Shein, conforme o plano.",
      },
      {
        title: "Para onde vai a comissão?",
        body: "Direto para a sua conta de afiliado. Eu cobro só a implantação e a mensalidade, nunca uma porcentagem das suas vendas.",
      },
      {
        title: "Meu número corre risco de bloqueio?",
        body: "O robô usa um chip só dele, aquecido antes de postar no ritmo cheio, e segue um limite de postagens por hora pensado para o WhatsApp. O grupo fica no seu número pessoal, então ele continua seu aconteça o que acontecer com o chip.",
      },
      {
        title: "Tem fidelidade?",
        body: "Não. Cancele quando quiser, avisando antes do próximo vencimento.",
      },
      {
        title: "Como eu pago?",
        body: "Por Pix, pelo próprio robô. Perto do vencimento ele avisa e manda a chave. Pagou, a assinatura é renovada. Com 3 dias de atraso ele pausa as postagens e volta na hora em que o pagamento cai.",
      },
      {
        title: "Quanto tempo leva para começar?",
        body: "A implantação leva poucos dias. O chip novo aquece por 1 a 2 semanas, postando aos poucos, antes de entrar no ritmo cheio.",
      },
      {
        title: "Posso ter mais de um grupo?",
        body: "Pode. No Essencial e no Plus, cada grupo extra custa R$ 29 por mês. O Pro já vai incluir 2 grupos extras.",
      },
    ] satisfies TitledText[],
  },
  about: {
    title: "Quem cuida do seu robô.",
    name: "Igor Gaspar",
    role: "Implantação e suporte",
    body: "Sou engenheiro de IA e coloco agentes em produção. Construí esse robô do zero e ele já roda todos os dias num grupo de ofertas de verdade. Você fala direto comigo, do primeiro contato ao suporte.",
    link: "Conheça meu trabalho",
    photoAlt: "Monograma IG",
  },
  closing: {
    title: "Bora colocar seu grupo para rodar?",
    text: "Escolha o plano, separe o chip e em poucos dias as ofertas com o seu link começam a sair sozinhas.",
    cta: "Fala comigo no WhatsApp",
    note: "Resultado que cresce com o grupo: quanto mais gente ativa, mais vendas.",
  },
  draft: "Oi Igor! Vi a página do robô de ofertas e quero saber mais.",
  footer: "© 2026 Igor Gaspar",
  backHome: "igorgaspar.tech",
};
