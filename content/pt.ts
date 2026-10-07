import type { Dictionary } from "./types";

// Textos da seção 2A do pacote (docs/PACOTE-PARA-O-CODE.md). Não editar sem atualizar o pacote.
export const pt: Dictionary = {
  meta: {
    title: "Igor Gaspar · Engenheiro de IA e Desenvolvedor Fullstack",
    description:
      "Construo produtos com agentes de IA que funcionam em produção: do prompt ao banco de dados. Veja projetos, stack e converse com meu agente.",
  },
  nav: {
    projects: "Projetos",
    howIBuild: "Como construo",
    journey: "Trajetória",
    contact: "Contato",
    cta: "Fale comigo",
  },
  hero: {
    eyebrow: "Igor Gaspar · Engenheiro de IA & Desenvolvedor Fullstack",
    title: "Coloco agentes de IA em produção.",
    subtitle:
      "Do prompt ao banco de dados. Construo produtos com LLMs que funcionam fora da demo: com testes, segurança de dados e deploy.",
    ctaHire: "Contratar para o time",
    ctaProject: "Tenho um projeto",
    agentLink: "Ou pergunte ao meu agente ↓",
  },
  agent: {
    title: "Pergunte qualquer coisa sobre mim.",
    support:
      "Este agente conhece minha trajetória, meus projetos e como eu trabalho. Ele mesmo é um exemplo do que eu construo.",
    chips: [
      "Quais projetos você já colocou em produção?",
      "Como seria trabalhar comigo num projeto?",
      "Qual sua experiência com .NET e Angular?",
    ],
    placeholder: "Escreva sua pergunta…",
    notice:
      "Respostas geradas por IA com base em informações fornecidas por mim. Para algo importante, fale comigo direto.",
  },
  whatIDo: {
    title: "Três coisas que eu entrego.",
    pillars: [
      {
        title: "Agentes e LLMs em produção",
        body: "Agentes com Tool Use, saídas estruturadas e avaliação automatizada. Rate limit, fallback e confirmação antes de qualquer ação que mexa em dados. Não é protótipo: é sistema rodando.",
      },
      {
        title: "Produto de ponta a ponta",
        body: "Front, back, banco e deploy. Next.js, React, Angular, .NET, Node.js, Python, PostgreSQL, Docker e CI/CD. Conduzo da POC à produção.",
      },
      {
        title: "IA aplicada ao negócio",
        body: "Curso Mestrado em Negócios e IA e MBA em Transformação de Negócios com IA Generativa. Começo pelo problema, não pela ferramenta.",
      },
    ],
  },
  projects: {
    title: "Projetos em produção.",
    subtitle: "Três sistemas reais, três formas diferentes de usar Claude.",
    items: {
      monai: {
        badge: "Produto próprio · em produção",
        title: "MonAI: finanças pessoais em linguagem natural",
        summary:
          "Você escreve o gasto como falaria. Um agente de IA interpreta, mostra uma prévia e só registra depois da sua confirmação.",
        problem:
          "Apps de finanças pedem um formulário para cada gasto. Quem desiste de registrar perde o controle do mês.",
        solution:
          'Basta escrever "gastei 45 no mercado no débito do Itaú". Um agente com Claude Haiku 4.5 extrai valor, conta, categoria, data e forma de pagamento, mostra a prévia e só grava depois da confirmação. O app também cuida de contas, despesas e rendas recorrentes, e projeta o fluxo de caixa dos próximos meses.',
        engineering: [
          "Isolamento entre usuários com Row-Level Security no PostgreSQL, além da checagem de posse em cada serviço",
          "Dinheiro em decimal de precisão fixa; saldo e transação gravados na mesma transação de banco",
          "Saída estruturada do modelo, eval automatizado do agente e parser heurístico de fallback",
          "Consentimento opt-in para uso de IA, exportação e exclusão de dados (LGPD)",
          "Mais de 50 arquivos de teste e CI com lint, testes e build a cada mudança",
        ],
        stack: [
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind CSS",
          "Prisma",
          "PostgreSQL",
          "NextAuth",
          "Claude Haiku 4.5",
          "Docker",
          "VPS com Coolify",
          "GitHub Actions",
        ],
        mediaAlt: "Tela do MonAI com o campo do agente e as contas bancárias",
      },
      b2b: {
        badge: "Case de engenharia · em produção",
        title: "Agente autônomo de vendas para eventos B2B",
        summary:
          "Do primeiro contato à reunião comercial: um agente no Telegram que capta, enriquece e acompanha cada lead de um evento.",
        problem: "Um evento B2B gera leads que esfriam entre a inscrição e o follow-up comercial.",
        solution:
          "Um agente autônomo no Telegram para o Aegis Summit. Ele capta o lead com consentimento, enriquece os dados da empresa a partir de fontes públicas e conduz réguas de comunicação de 14 dias antes até 3 dias depois do evento. No fim, leva o lead até o agendamento da reunião com o time comercial.",
        engineering: [
          "Loop de Tool Use nativo da Anthropic com Claude Sonnet 4.6 e 8 ferramentas, sem LangChain",
          "Réguas proativas num scheduler, desacopladas do modelo: o LLM conversa, o scheduler garante o timing",
          "Enriquecimento plugável: heurística sobre o domínio do e-mail + busca web com Tavily",
          "Dashboard com os KPIs do funil, consentimento LGPD e comando de exclusão de dados",
          "Testes automatizados com pytest e deploy contínuo no Railway",
        ],
        stack: [
          "Python",
          "FastAPI",
          "python-telegram-bot",
          "Claude Sonnet 4.6 (Tool Use)",
          "Supabase (PostgreSQL)",
          "APScheduler",
          "Tavily",
          "Railway",
        ],
        diagram: {
          label:
            "Diagrama de arquitetura: Telegram → Agente (Claude + 8 tools) → Supabase · Scheduler de réguas → Telegram · Enriquecimento → Agente",
          nodes: {
            telegram: ["Telegram"],
            agent: ["Agente", "Claude + 8 tools"],
            supabase: ["Supabase"],
            scheduler: ["Scheduler de réguas"],
            enrichment: ["Enriquecimento"],
          },
        },
      },
      esteticaah: {
        badge: "Cliente real · em produção",
        title: "EstetiCaah: site e assistente de atendimento com IA",
        summary:
          "Site de clínica de estética em que o visitante escolhe um procedimento, tira dúvidas com uma IA e chega pronto ao WhatsApp para agendar.",
        problem:
          "A clínica precisava transformar visitas ao site em agendamentos, sem deixar dúvidas sobre os procedimentos sem resposta.",
        solution:
          "O visitante escolhe um procedimento e o chat já abre sabendo do que se trata. Um fluxo no n8n usa Claude Sonnet 4.6 para responder as dúvidas e, quando o cliente está pronto, encaminha para o WhatsApp da clínica.",
        engineering: [
          "Chat contextualizado: o procedimento escolhido chega ao assistente como variável pré-preenchida",
          "Orquestração no n8n, com o modelo formulando as respostas",
          "Handoff direto para o WhatsApp da clínica, onde o agendamento é fechado",
          "Renderização no servidor com TanStack Start, deploy na Vercel",
        ],
        stack: [
          "TanStack Start",
          "React 19",
          "TypeScript",
          "Tailwind CSS",
          "shadcn/ui",
          "Typebot",
          "n8n",
          "Claude Sonnet 4.6",
          "Vercel",
        ],
        mediaAlt: "Página inicial do site da EstetiCaah",
        diagram: {
          label:
            "Diagrama de arquitetura: Site (procedimento) → Typebot → n8n → Claude Sonnet 4.6 → WhatsApp da clínica",
          nodes: {
            site: ["Site", "procedimento"],
            typebot: ["Typebot"],
            n8n: ["n8n"],
            claude: ["Claude Sonnet 4.6"],
            whatsapp: ["WhatsApp da clínica"],
          },
        },
      },
    },
  },
  howIBuild: {
    title: "Como eu construo.",
    subtitle: "IA acelera o trabalho, mas o critério de qualidade continua sendo meu.",
    steps: [
      {
        title: "Entender o problema.",
        body: "Antes do código, o que precisa mudar no negócio e como vamos saber que mudou.",
      },
      {
        title: "Provar rápido.",
        body: "Uma POC curta para validar a abordagem antes de investir na versão completa.",
      },
      {
        title: "Testar o que importa.",
        body: "Testes automatizados nas regras de negócio e evals no comportamento do agente.",
      },
      {
        title: "Proteger os dados.",
        body: "Isolamento entre usuários, consentimento, chaves de API só no servidor.",
      },
      {
        title: "Entregar e acompanhar.",
        body: "Deploy com CI, ambiente de ensaio antes da produção e ajustes a partir do uso real.",
      },
    ],
    terminal: [
      "# entender: o que precisa mudar?",
      "$ git checkout -b poc/agente",
      "$ npm test && npm run eval:agent",
      "✓ RLS ativo · consentimento opt-in · chave só no servidor",
      "$ git push → CI: lint ✓ test ✓ build ✓ → deploy",
    ],
  },
  stack: {
    title: "Ferramentas que uso em produção.",
    groups: [
      {
        label: "IA e agentes",
        items: [
          "Claude (Anthropic SDK)",
          "Tool Use",
          "structured outputs",
          "evals",
          "MCP",
          "n8n",
          "Typebot",
          "Claude Code",
          "Cursor",
          "GitHub Copilot",
        ],
      },
      {
        label: "Front-end",
        items: ["React", "Next.js", "Angular", "TypeScript", "Tailwind CSS", "TanStack Start"],
      },
      {
        label: "Back-end",
        items: ["C# / .NET", "Node.js", "Python", "FastAPI", "APIs REST"],
      },
      {
        label: "Dados",
        items: ["PostgreSQL", "SQL Server", "MySQL", "MongoDB", "Prisma", "Supabase"],
      },
      {
        label: "Infra",
        items: ["Docker", "GitHub Actions", "Vercel", "Railway", "VPS com Coolify"],
      },
      { label: "Mobile", items: ["Flutter"] },
    ],
  },
  journey: {
    title: "Da engenharia mecânica à IA.",
    subtitle:
      "Um caminho pouco linear, que me ensinou a resolver problemas antes de escolher a ferramenta.",
    items: [
      { period: "2014–2019", heading: "**Engenharia Mecânica**, UniABC" },
      {
        period: "2020–2021",
        heading: "**Conferente em logística**, Paulo Vieira Transportes.",
        body: "Operação, planejamento de carregamento e atendimento.",
      },
      {
        period: "2021–2023",
        heading: "**Técnico de TI**, Santa Casa de Misericórdia de Mauá.",
        body: "Suporte a um hospital inteiro: rede, Active Directory e sistema hospitalar.",
      },
      {
        period: "2022–2023",
        heading: "**Análise e Desenvolvimento de Sistemas**, Universidade Cruzeiro do Sul",
      },
      {
        period: "2023–hoje",
        heading: "**Desenvolvedor Fullstack**, Farmarcas.",
        body: ".NET e Angular no dia a dia. Conduzo frentes de ponta a ponta, do estudo e da POC à produção. Refatorei um fluxo que disparava várias requisições simultâneas para uma única chamada: de 40 s para 8 s. Levei assistentes e agentes de IA para o fluxo de desenvolvimento da equipe.",
        stat: "40 s → 8 s",
      },
      {
        period: "2025–hoje",
        heading:
          "**Mestrado em Negócios e IA** (AGTU) e **MBA em Transformação de Negócios com IA Generativa** (Faculdade Hub)",
      },
      {
        period: "2026",
        heading:
          "**Projetos próprios e primeiro cliente:** MonAI, EstetiCaah e o agente de vendas B2B",
      },
    ],
  },
  workWithMe: {
    title: "Tem um projeto? Funciona assim.",
    steps: [
      {
        title: "Conversa inicial.",
        body: "Presencial ou por Meet/Zoom. Entendo o problema, o público e o que seria sucesso.",
      },
      {
        title: "Proposta com demonstração.",
        body: "Escopo, prazo e um protótipo para você ver a ideia funcionando antes de decidir.",
      },
      {
        title: "Construção com alinhamentos.",
        body: "Entregas em etapas e reuniões curtas para ajustar o rumo.",
      },
      {
        title: "Entrega e acompanhamento.",
        body: "Em produção, com documentação, e ajustes a partir do uso real.",
      },
    ],
    cta: "Agendar uma conversa",
  },
  contact: {
    title: "Vamos conversar.",
    text: "Seja para uma vaga ou para um projeto, respondo pessoalmente.",
    emailLabel: "E-mail",
    location: "Mauá, SP · trabalho remoto ou presencial na Grande São Paulo",
    ctaHire: "Contratar para o time",
    ctaProject: "Tenho um projeto",
    closing: "Ou pergunte ao meu agente.",
  },
  footer: { text: "© 2026 Igor Gaspar · Feito com Next.js e Claude" },
  ui: {
    skipToContent: "Pular para o conteúdo",
    mainNav: "Navegação principal",
    menu: "Menu",
    language: "Idioma",
    themeToggle: "Alternar tema claro/escuro",
    problem: "O problema",
    solution: "A solução",
    engineering: "Engenharia que não aparece na tela",
    lookInside: "Ver por dentro",
    view: "ver",
    stack: "Stack",
    links: "Links",
    copy: "Copiar",
    copied: "Copiado ✓",
    send: "Enviar",
    stop: "Parar",
    openAgent: "Abrir o agente",
    close: "Fechar",
    you: "Você",
    agentName: "Agente",
    draftHire: "Estou contratando para o meu time. O que devo saber sobre o Igor?",
    draftProject: "Tenho um projeto em mente. Como o Igor pode ajudar?",
    subjectHire: "Vaga",
    subjectProject: "Projeto",
    photoAlt: "Monograma IG",
    notFoundTitle: "Página não encontrada.",
    notFoundText: "O endereço que você abriu não existe neste site.",
    notFoundBack: "Voltar ao início",
  },
};
