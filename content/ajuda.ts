// Help center of the offers bot (/robo-de-ofertas/ajuda). Portuguese only, like the sales page.
// Every topic is a page of its own (/robo-de-ofertas/ajuda/<slug>) so the bot can send the link of
// the right one; each section has an id, so a deep link such as .../shopee-api#pedir-acesso works too.
// The bot's texts live in the affiliates-bot repository (app/commands/help.py and friends): when a
// command changes there, change it here.

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; body?: string; code?: string }[] }
  | { type: "code"; text: string }
  | { type: "note"; tone: "info" | "warn"; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      caption: string;
    }
  | { type: "links"; items: { label: string; href: string }[] };

export type Section = { id: string; title: string; blocks: Block[] };

export type Topic = {
  slug: string;
  title: string;
  /** One line shown on the index cards. */
  summary: string;
  /** Who needs it: "Todos os planos", "Plus", ... */
  scope: string;
  /** Page description (meta + lead paragraph). */
  lead: string;
  sections: Section[];
  /** Slugs of the topics suggested at the end of the page. */
  related: string[];
};

const shopeeHelp = "https://help.shopee.com.br/portal";

export const ajuda = {
  basePath: "/robo-de-ofertas/ajuda",
  meta: {
    title: "Central de ajuda do robô de ofertas · Igor Gaspar",
    description:
      "Passo a passo para usar 100% do robô de ofertas: liberar a API da Shopee, conectar Mercado Livre, Shein e Amazon, postar links, horários, cupons e problemas comuns.",
  },
  index: {
    eyebrow: "Central de ajuda",
    title: "Tudo para usar o robô de ofertas, por assunto.",
    subtitle:
      "Escolha o assunto. Cada página tem o passo a passo e o comando para mandar no privado do robô. Se travar em algum ponto, fale comigo pelo WhatsApp.",
    all: "Todos os assuntos",
  },
  topicPage: {
    back: "Todos os assuntos",
    onThisPage: "Nesta página",
    related: "Veja também",
    stuck: "Ainda com dúvida?",
    stuckBody:
      "Me chame no WhatsApp contando em qual passo parou. Se puder, mande um print (apague dados pessoais antes).",
    stuckCta: "Falar no WhatsApp",
    stuckDraft: "Oi, Igor! Preciso de ajuda com o robô de ofertas: ",
    copy: "Copiar",
    copied: "Copiado",
  },
  commands: {
    search: "Buscar comando",
    searchPlaceholder: "Ex.: horarios, fila, cupom",
    empty: "Nenhum comando encontrado.",
    count: (n: number) => (n === 1 ? "1 comando" : `${n} comandos`),
  },
  topics: [
    {
      slug: "primeiros-passos",
      title: "Primeiros passos",
      summary: "O que o robô faz, como conectar o número e o primeiro teste.",
      scope: "Todos os planos",
      lead: "O robô posta ofertas no seu grupo de WhatsApp, nos horários que você escolher, sempre com o seu link de afiliado. Você manda os comandos por mensagem, do seu número pessoal para o número do robô.",
      related: ["postar-links", "fila-e-horarios", "comandos"],
      sections: [
        {
          id: "o-que-voce-providencia",
          title: "O que você providencia",
          blocks: [
            {
              type: "list",
              items: [
                "Um chip só para o robô, no seu CPF, com WhatsApp Business num celular que fique com você.",
                "O seu número pessoal, de onde você manda os comandos.",
                "O grupo de ofertas, criado pelo seu número pessoal.",
                "Conta de afiliado nas lojas do seu plano.",
              ],
            },
            {
              type: "note",
              tone: "info",
              text: "Use o chip normalmente por 1 a 2 semanas antes de começar (conversas, contatos salvos, nome e foto no perfil). Chip recém-ativado é mais fácil de ser bloqueado.",
            },
          ],
        },
        {
          id: "conectar",
          title: "Conectar o chip e ligar o grupo",
          blocks: [
            {
              type: "steps",
              items: [
                {
                  title: "Conectar o chip",
                  body: "No dia combinado, com o celular do chip na mão, abra o WhatsApp > Aparelhos conectados > Conectar aparelho e leia o QR que eu enviar. O QR precisa aparecer em outro aparelho (computador ou outro celular).",
                },
                {
                  title: "Colocar o robô no grupo",
                  body: "Adicione o número do robô ao grupo e torne-o admin.",
                },
                {
                  title: "Escolher o grupo",
                  body: "No privado do robô, peça a lista de grupos e escolha o seu pelo número.",
                  code: "grupos\ngrupo 1",
                },
                {
                  title: "Cadastrar as lojas",
                  body: "Siga os assuntos de cada loja (Shopee, Mercado Livre, Shein e Amazon). No robô, o comando ajuda links mostra o passo a passo.",
                },
                {
                  title: "Testar",
                  body: "Mande um link de oferta, veja a fila e poste o primeiro item no grupo.",
                  code: "fila\nenviar 1",
                },
              ],
            },
            {
              type: "note",
              tone: "warn",
              text: "Escreva sempre do seu WhatsApp pessoal para o número do robô. Mensagem do próprio número do robô para ele mesmo não é lida.",
            },
          ],
        },
        {
          id: "proteger-o-numero",
          title: "Regras para proteger o número",
          blocks: [
            {
              type: "p",
              text: "O robô usa uma conexão não oficial do WhatsApp, então sempre existe algum risco de bloqueio do número. Estas regras diminuem o risco:",
            },
            {
              type: "list",
              items: [
                "Comece leve: um post por hora nas primeiras semanas e aumente aos poucos. O robô posta no máximo 4 por hora; se passar disso, ele pula o horário e avisa você.",
                "O chip é só do robô: não use para conversar, não mande oferta no privado de ninguém e não adicione pessoas ao grupo. Entrada só por link de convite.",
                "Mantenha o celular do chip ligado: conecte à internet pelo menos uma vez por semana (com 14 dias sem internet o WhatsApp desconecta o robô) e mantenha a recarga em dia.",
                "O grupo é seu: ele pertence ao seu número pessoal. Se o número do robô cair, o grupo e os membros continuam, e conectamos um chip novo.",
              ],
            },
          ],
        },
        {
          id: "avisos",
          title: "Avisos que o robô manda",
          blocks: [
            {
              type: "list",
              items: [
                "Um horário não saiu (fila vazia, limite por hora ou grupo não escolhido).",
                "A fila está baixa: mande mais links.",
                "O acesso de uma loja venceu.",
                "O vencimento da mensalidade está perto.",
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "shopee-api",
      title: "Shopee: virar afiliado e liberar a API",
      summary: "Do cadastro de afiliado ao AppID e à Senha da Open API.",
      scope: "Plus (no Essencial, só a Parte 1)",
      lead: "A Open API deixa o robô buscar sozinho as ofertas de maior comissão e transformar qualquer link da Shopee no seu link de afiliado. Sem ela o robô continua funcionando, mas só posta os links de afiliado que você manda.",
      related: ["postar-links", "problemas", "comandos"],
      sections: [
        {
          id: "o-que-precisa",
          title: "O que você precisa",
          blocks: [
            {
              type: "list",
              items: [
                "Uma conta na Shopee (a mesma em que você compra serve).",
                "Ter 18 anos ou mais e CPF.",
                "Uma rede social para cadastrar (a própria conta da Shopee é aceita).",
                "Celular com o navegador Chrome: o cadastro e a Open API ficam no site, não no app.",
                "Acesso ao seu e-mail, para confirmar o cadastro.",
              ],
            },
            {
              type: "note",
              tone: "info",
              text: "Já é afiliado aprovado? Pule para a Parte 2.",
            },
            {
              type: "table",
              head: ["Assunto", "Guia oficial da Shopee"],
              rows: [
                ["Cadastro no programa", "https://shopee.com.br/blog/programa-de-afiliados-shopee/"],
                [
                  "Termos do programa",
                  `${shopeeHelp}/article/76443-Programa-de-Afiliados-da-Shopee---Termos-e-Condi%c3%a7%c3%b5es`,
                ],
                [
                  "Pagamento (pessoa física)",
                  `${shopeeHelp}/10/article/125654-Pessoa-F%C3%ADsica%3A-saiba-como-cadastrar-suas-informa%C3%A7%C3%B5es-de-pagamento`,
                ],
                ["Pagamento (pessoa jurídica)", `${shopeeHelp}/10/article/162025`],
                ["Conta digital Maree", `${shopeeHelp}/10/article/142201-Como-ativar-a-Maree`],
                ["Comissões e pagamentos", "https://shopee.com.br/blog/afiliado-shopee-comissao-pagamentos/"],
              ],
            },
          ],
        },
        {
          id: "parte-1",
          title: "Parte 1: virar afiliado da Shopee",
          blocks: [
            {
              type: "note",
              tone: "warn",
              text: "O Chrome vai tentar abrir o app da Shopee (por exemplo, logo depois do login). Não siga no app: volte para o Chrome e abra de novo affiliate.shopee.com.br. O cadastro continua de onde parou.",
            },
            {
              type: "steps",
              items: [
                {
                  title: "Abrir a página de afiliados",
                  body: "No Chrome do celular, entre em affiliate.shopee.com.br e toque em Entrar.",
                },
                {
                  title: "Entrar com a sua conta da Shopee",
                  body: "Use o mesmo login que você usa para comprar. Se o Chrome mandar para o app, volte para affiliate.shopee.com.br.",
                },
                {
                  title: "Tipo de conta e rede social",
                  body: "Escolha Individual (com CPF); Empresarial é só para quem tem CNPJ e emite nota fiscal. Cadastre um canal seu como rede social; se não tiver outro, pode cadastrar a sua própria conta da Shopee, que é aceita.",
                },
                {
                  title: "Confirmar o e-mail",
                  body: "A Shopee manda um código ou link para o seu e-mail. Abra o e-mail e confirme.",
                },
                {
                  title: "Conferir o cadastro",
                  body: "Confira os dados que aparecem na tela de confirmação do cadastro e continue.",
                },
                {
                  title: "Aceitar os termos",
                  body: "Leia e aceite os termos do programa. Normalmente a conta é aprovada na hora e o painel de afiliado já abre.",
                },
              ],
            },
          ],
        },
        {
          id: "pagamento",
          title: "Dados para receber as comissões",
          blocks: [
            {
              type: "p",
              text: "Esta etapa é feita no app da Shopee e pede documentos. Complete assim que puder: sem esses dados a Shopee não paga as comissões.",
            },
            {
              type: "steps",
              items: [
                {
                  title: "Ative a conta digital Maree",
                  body: "É a conta digital da Shopee; o guia oficial pede que ela seja ativada antes do cadastro de pagamento. No app: Eu > Maree.",
                },
                {
                  title: "Cadastre o pagamento",
                  body: "No app: Eu > Mais atividades > Criadores & Afiliados > Conta > Configurações > Configurações de pagamento, tipo Individual Local.",
                },
                {
                  title: "Tenha os documentos em mãos",
                  body: "RG e CPF (com foto/comprovante), comprovante de endereço, nome completo da mãe e o PIS. Os dados têm que ser iguais aos da Maree, sem abreviações nem acentos. A Shopee responde em até 7 dias úteis.",
                },
              ],
            },
          ],
        },
        {
          id: "parte-2",
          title: "Parte 2: liberar a Open API",
          blocks: [
            {
              type: "steps",
              items: [
                {
                  title: "Abrir a tela Open API",
                  body: "Em affiliate.shopee.com.br, já logado como afiliado, abra o menu e toque em Open API (em algumas contas aparece como Abrir API).",
                },
                {
                  title: "Copiar o AppID e a Senha",
                  body: "Se a tela mostrar o AppID (um número comprido) e a Senha (um código com letras e números, que a Shopee também chama de Secret ou App Password), a sua conta já tem acesso. A Senha não é a senha do seu login.",
                },
              ],
            },
          ],
        },
        {
          id: "cadastrar-no-robo",
          title: "Mandar o AppID e a Senha para o robô",
          blocks: [
            {
              type: "p",
              text: "No privado do robô, mande os dois na mesma mensagem:",
            },
            { type: "code", text: "shopee 18123456789 ABCDEFGHIJKLMNOP" },
            {
              type: "p",
              text: "Pode colar do jeito que copiar, até com “AppID:” e “Senha:” junto: o robô entende. Ele testa na hora com a Shopee e responde ✅ quando der certo. Depois, apague a mensagem com a Senha.",
            },
          ],
        },
        {
          id: "pedir-acesso",
          title: "Se a tela não mostrar AppID nem Senha",
          blocks: [
            {
              type: "p",
              text: "A Shopee ainda não liberou a Open API para a sua conta. A tela Abrir API não tem botão de pedido: o acesso é pedido pelo app da Shopee, na Central de Ajuda dos afiliados.",
            },
            {
              type: "steps",
              items: [
                {
                  title: "Copie o seu ID de afiliado",
                  body: "No app: Eu > Mais atividades > Criadores & Afiliados > Conta > Configurações > Configurações da Conta > ID de Afiliado > Copiar.",
                },
                {
                  title: "Abra a Central de Ajuda",
                  body: "No app: Eu > Mais atividades > Criadores & Afiliados > Conta > Central de Ajuda > E-mail. Responda Sim e depois Não.",
                },
                {
                  title: "Preencha o formulário",
                  body: "Cole o ID de afiliado e informe o telefone cadastrado no programa. Em “tema”, escolha Tenho dúvidas / dificuldades com meu cadastro / conta e, em “cenário”, escolha Quero ativar a API.",
                },
                { title: "Toque em Enviar", body: "A análise é manual." },
                {
                  title: "Aguarde a resposta por e-mail",
                  body: "O suporte costuma falar em até 5 dias úteis. Quando aprovarem, o AppID e a Senha aparecem na tela Abrir API (affiliate.shopee.com.br/open_api).",
                },
              ],
            },
            {
              type: "image",
              src: "/media/ajuda/shopee-formulario.webp",
              alt: "Formulário do app da Shopee com os campos ID de Afiliado, telefone, tema e o cenário “Quero ativar a API” selecionado.",
              width: 480,
              height: 1209,
              caption:
                "O formulário no app da Shopee, com o cenário “Quero ativar a API” (ID e telefone borrados).",
            },
            {
              type: "image",
              src: "/media/ajuda/shopee-enviado.webp",
              alt: "Tela “Enviado com sucesso” do app da Shopee.",
              width: 480,
              height: 1067,
              caption: "Ao enviar, a Shopee mostra esta confirmação.",
            },
            {
              type: "note",
              tone: "info",
              text: "Se passar do prazo, abra um novo pedido pelo mesmo caminho ou fale no chat do app (Eu > Chat Shopee). Há relatos de quem precisou pedir mais de uma vez.",
            },
            {
              type: "note",
              tone: "warn",
              text: "Não confunda com a Shopee Open Platform (open.shopee.com), que é a API para vendedores integrarem a loja. Ela pede outro cadastro e as chaves dela não servem para o robô.",
            },
          ],
        },
        {
          id: "enquanto-isso",
          title: "Enquanto a Shopee não libera",
          blocks: [
            {
              type: "p",
              text: "O robô funciona no modo manual. No app da Shopee, abra o produto, toque em Compartilhar > Obter link e mande o link para o robô com o preço:",
            },
            {
              type: "code",
              text: "https://s.shopee.com.br/xxxx Tênis feminino de R$ 129,90 por R$ 59,90",
            },
            {
              type: "p",
              text: "O robô manda um lembrete de vez em quando até o acesso ser cadastrado.",
            },
          ],
        },
        {
          id: "problemas",
          title: "Problemas comuns",
          blocks: [
            {
              type: "table",
              head: ["O que aconteceu", "O que fazer"],
              rows: [
                [
                  "O Chrome abriu o app da Shopee",
                  "Volte para o Chrome e abra de novo affiliate.shopee.com.br.",
                ],
                [
                  "Cadastro de afiliado recusado",
                  "Confira se o canal está ativo e o link abre, e tente de novo.",
                ],
                [
                  "“A Shopee recusou esse AppID/Senha”",
                  "Confira se copiou os dois inteiros. O erro mais comum é trocar um pelo outro: o AppID é só números.",
                ],
                [
                  "“Faltou a Senha” ou “Faltou o AppID”",
                  "Mande os dois na mesma mensagem.",
                ],
                [
                  "Não acho “Open API” no menu, ou a tela não mostra AppID",
                  "A conta ainda não tem acesso: peça pelo formulário acima.",
                ],
                [
                  "Desconfio que a Senha vazou",
                  "Gere uma nova na tela Open API e mande shopee AppID NovaSenha.",
                ],
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "mercado-livre",
      title: "Mercado Livre",
      summary: "Etiqueta de afiliado, link meli.la e cookie da sessão.",
      scope: "Todos os planos (cookie só no Plus)",
      lead: "No Mercado Livre o robô precisa da sua etiqueta de afiliado. No Plus, a sessão (cookie) da sua conta também deixa um link comum do Mercado Livre virar link seu.",
      related: ["postar-links", "problemas", "comandos"],
      sections: [
        {
          id: "etiqueta",
          title: "A sua etiqueta de afiliado",
          blocks: [
            {
              type: "p",
              text: "Não precisa cadastrar: mande um link meli.la seu (do botão Compartilhar da área de afiliados) e o robô guarda a etiqueta sozinho. Ela aparece no fim do endereço quando você abre um link meli.la seu (mercadolivre.com.br/social/suaetiqueta).",
            },
            { type: "code", text: "mercadolivre" },
            {
              type: "p",
              text: "mostra a etiqueta guardada. Para trocar:",
            },
            { type: "code", text: "mercadolivre suaetiqueta" },
          ],
        },
        {
          id: "link-afiliado",
          title: "Mandar um link de afiliado",
          blocks: [
            {
              type: "p",
              text: "Mande o link meli.la/... do botão Compartilhar da área de afiliados. Ele entra na frente da fila.",
            },
          ],
        },
        {
          id: "renovar",
          title: "Cookie da sessão (Plus)",
          blocks: [
            {
              type: "p",
              text: "Com o cookie, qualquer link do Mercado Livre (do app ou do site) vira o seu link de afiliado. O acesso vence de tempos em tempos: o robô avisa e você repete o comando cookie. Para ver o estado da sessão, mande só cookie.",
            },
            {
              type: "steps",
              items: [
                {
                  title: "Instale a extensão no Firefox",
                  body: "No Firefox do celular (Android), instale a extensão Cookie-Editor.",
                },
                {
                  title: "Entre na sua conta de afiliado",
                  body: "Abra mercadolivre.com.br/afiliados/linkbuilder, logado na sua conta.",
                },
                {
                  title: "Exporte o cookie",
                  body: "Abra o Cookie-Editor, toque em Exportar e escolha Header String.",
                },
                {
                  title: "Mande para o robô",
                  body: "No privado do robô, escreva cookie, um espaço e cole o texto copiado.",
                  code: "cookie <cole aqui>",
                },
              ],
            },
            {
              type: "p",
              text: "O robô testa na hora e responde ✅. Depois, apague a mensagem com o cookie.",
            },
          ],
        },
      ],
    },
    {
      slug: "shein",
      title: "Shein",
      summary: "Cookie e navegador da Shein para o preço vir sozinho.",
      scope: "Plus",
      lead: "Com a sessão da Shein o preço e o nome vêm sozinhos. Sem ela, funciona do mesmo jeito: você manda o link de afiliado com o preço.",
      related: ["postar-links", "problemas", "comandos"],
      sections: [
        {
          id: "sem-sessao",
          title: "Sem a sessão",
          blocks: [
            {
              type: "p",
              text: "Mande o link de afiliado da Shein (um ou vários, um por linha) com o preço de cada um:",
            },
            {
              type: "code",
              text: "link por R$ 59,90\nlink de R$ 129,90 por R$ 59,90",
            },
          ],
        },
        {
          id: "renovar",
          title: "Configurar ou renovar a sessão",
          blocks: [
            {
              type: "p",
              text: "Use o Firefox do celular (Android) com a extensão Cookie-Editor. Para ver o passo a passo no próprio robô, mande cookie shein.",
            },
            {
              type: "steps",
              items: [
                {
                  title: "Ligue “Site para computador”",
                  body: "No menu ⋮ do Firefox, ligue Site para computador e deixe ligado até o fim. Sem isso a Shein pede captcha e o preço não vem.",
                },
                {
                  title: "Copie o navegador (User-Agent)",
                  body: "Abra o site whatmyuseragent.com, copie o texto que começa com Mozilla/5.0 (não pode ter “Mobile”) e mande para o robô.",
                  code: "cookie shein <cole o Mozilla/5.0...>",
                },
                {
                  title: "Exporte o cookie",
                  body: "Entre na sua conta da Shein em br.shein.com, abra um produto e, no Cookie-Editor, toque em Exportar > Header String. Mande para o robô.",
                  code: "cookie shein <cole o cookie>",
                },
              ],
            },
            {
              type: "note",
              tone: "info",
              text: "O passo 2 só precisa ser repetido se você trocar de celular ou o Firefox atualizar. O cookie vence de tempos em tempos: o robô avisa e você repete o passo 3.",
            },
          ],
        },
      ],
    },
    {
      slug: "amazon",
      title: "Amazon",
      summary: "A sua tag de associado e como postar links da Amazon.",
      scope: "Todos os planos",
      lead: "O robô aprende a sua tag de associado sozinho ou você cadastra com um comando. Depois, qualquer link da Amazon sai com a sua tag.",
      related: ["postar-links", "problemas", "comandos"],
      sections: [
        {
          id: "tag",
          title: "A sua tag de associado",
          blocks: [
            {
              type: "p",
              text: "A tag é algo como seunome-20 e aparece no SiteStripe (a barra no alto da página da Amazon), em ID de rastreamento. Mande no privado do robô:",
            },
            { type: "code", text: "amazon seunome-20" },
            {
              type: "p",
              text: "Se preferir, mande um link gerado no SiteStripe (link.amazon/... ou amzn.to/...): ele já vem com a tag e o robô guarda sozinho. Mande só amazon para ver a tag guardada.",
            },
          ],
        },
        {
          id: "postar",
          title: "Postar links da Amazon",
          blocks: [
            {
              type: "p",
              text: "Mande o link da Amazon (do Compartilhar do app ou do site; um ou vários, um por linha) e o robô coloca a sua tag. Se a Amazon não mostrar o preço para o robô, mande junto:",
            },
            {
              type: "code",
              text: "link por R$ 199\nlink de R$ 299 por R$ 199",
            },
            {
              type: "p",
              text: "Se faltar o nome do produto, mande também: link Headset gamer HyperX de R$ 299 por R$ 199.",
            },
          ],
        },
      ],
    },
    {
      slug: "postar-links",
      title: "Postar links e preços",
      summary: "Mandar links de todas as lojas, com preço e título.",
      scope: "Todos os planos",
      lead: "Todo link que você manda no privado do robô entra na frente da fila. O robô posta no horário; para postar na hora, use enviar.",
      related: ["fila-e-horarios", "cupons-e-avisos", "problemas"],
      sections: [
        {
          id: "como-mandar",
          title: "Como mandar",
          blocks: [
            {
              type: "p",
              text: "Mande o link da oferta no privado do robô. Pode mandar vários links, um por linha. Links de lojas diferentes vão em mensagens separadas.",
            },
            {
              type: "table",
              head: ["Loja", "O que mandar"],
              rows: [
                [
                  "Shopee",
                  "Link de afiliado (de Obter link) com o preço. No Plus com a API liberada, qualquer link da Shopee serve.",
                ],
                [
                  "Mercado Livre",
                  "Link meli.la/... do botão Compartilhar. No Plus com cookie, qualquer link do Mercado Livre.",
                ],
                ["Shein", "Link de afiliado, com o preço se não houver sessão."],
                ["Amazon", "Link da Amazon (do app ou do site) ou do SiteStripe."],
              ],
            },
          ],
        },
        {
          id: "preco",
          title: "Preço e nome do produto",
          blocks: [
            {
              type: "p",
              text: "Se o robô não conseguir ler o preço, mande o preço depois do link:",
            },
            {
              type: "code",
              text: "link 59,90\nlink de 129,90 por 59,90",
            },
            {
              type: "p",
              text: "Se a prévia não trouxer o nome do produto, mande também:",
            },
            { type: "code", text: "link Tênis feminino de 129,90 por 59,90" },
          ],
        },
        {
          id: "titulo",
          title: "Título das ofertas",
          blocks: [
            {
              type: "code",
              text: "titulo\ntitulo 🔥 ESQUENTA 11.11 {loja} 🔥\ntitulo auto",
            },
            {
              type: "p",
              text: "titulo mostra o título de cada loja; o segundo exemplo troca o título de todas as lojas ({loja} vira SHOPEE, MERCADO LIVRE...); titulo auto volta ao automático (MELHORES OFERTAS {loja}, e ESQUENTA ou É HOJE nas datas duplas).",
            },
          ],
        },
        {
          id: "texto-livre",
          title: "Texto livre no grupo",
          blocks: [
            {
              type: "p",
              text: "postar texto posta no grupo exatamente o texto que vier depois do comando.",
            },
          ],
        },
      ],
    },
    {
      slug: "fila-e-horarios",
      title: "Fila e horários",
      summary: "Ver, enviar, pular e remover ofertas; trocar a grade de envios.",
      scope: "Todos os planos",
      lead: "A fila é a lista de ofertas esperando o próximo horário. Aqui estão os comandos para ver, mexer na fila e escolher quando o robô posta.",
      related: ["postar-links", "cupons-e-avisos", "problemas"],
      sections: [
        {
          id: "fila",
          title: "Fila de ofertas",
          blocks: [
            {
              type: "table",
              head: ["Comando", "O que faz"],
              rows: [
                ["status", "Resumo e próximos horários."],
                ["fila / fila 20", "Mostra as próximas ofertas (ou mais)."],
                ["enviar", "Posta já a próxima oferta."],
                ["enviar 3", "Posta já o item 3 da fila."],
                ["pular", "Descarta a próxima oferta."],
                ["remover 4", "Tira o item 4 da fila (vários: remover 2 4 7)."],
              ],
            },
            {
              type: "note",
              tone: "info",
              text: "Quando a fila fica baixa o robô avisa: é hora de mandar mais links.",
            },
          ],
        },
        {
          id: "horarios",
          title: "Horários",
          blocks: [
            {
              type: "table",
              head: ["Comando", "O que faz"],
              rows: [
                ["horarios", "Mostra a grade."],
                ["horarios 9h 12h 18:30 21h", "Troca a grade."],
                ["horarios 8h-23h a cada 30min", "Um envio a cada 30 minutos."],
                ["pausar / voltar", "Para e retoma os envios."],
              ],
            },
            {
              type: "note",
              tone: "warn",
              text: "Comece com um post por hora nas primeiras semanas e aumente aos poucos. O limite é de 4 por hora.",
            },
          ],
        },
        {
          id: "busca-shopee",
          title: "Busca automática da Shopee (Plus)",
          blocks: [
            {
              type: "table",
              head: ["Comando", "O que faz"],
              rows: [
                ["temas", "Mostra o que o robô procura."],
                ["temas natal, brinquedos", "Temas extras além das maiores comissões."],
                ["temas off", "Busca só pelas maiores comissões."],
                ["nicho casa, cozinha", "O robô só busca produtos desse nicho."],
                ["nicho off", "Volta a buscar em todas as categorias."],
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "cupons-e-avisos",
      title: "Cupons e avisos",
      summary: "Cupom nas ofertas, avisos de cupom no grupo e arte do cupom.",
      scope: "Todos os planos",
      lead: "Cupons chamam atenção no grupo. Estes comandos colocam o cupom nas ofertas ou postam um aviso só de cupom.",
      related: ["postar-links", "fila-e-horarios", "comandos"],
      sections: [
        {
          id: "shopee",
          title: "Cupom da Shopee nas ofertas",
          blocks: [
            {
              type: "table",
              head: ["Comando", "O que faz"],
              rows: [
                ["cupom <link>", "Coloca o link do cupom da Shopee nas ofertas."],
                ["cupom off", "Tira o cupom das ofertas."],
                ["cupons", "Posta “CUPONS ATUALIZADOS” com o link do cupom."],
              ],
            },
          ],
        },
        {
          id: "avisos",
          title: "Avisos de cupom no grupo",
          blocks: [
            {
              type: "table",
              head: ["Comando", "O que faz"],
              rows: [
                ["aviso CÓDIGO descrição", "Posta “CUPOM NOVINHO” no grupo."],
                [
                  "exclusivo 10.10 CÓDIGO descrição",
                  "Posta “CUPOM EXCLUSIVO 10.10”.",
                ],
              ],
            },
          ],
        },
        {
          id: "arte",
          title: "Arte do cupom",
          blocks: [
            {
              type: "p",
              text: "Mande uma imagem com a legenda arte cupom para o robô guardá-la: ela sai junto dos avisos, do exclusivo e dos cupons. O comando arte mostra se há uma arte guardada e arte off tira.",
            },
          ],
        },
      ],
    },
    {
      slug: "comandos",
      title: "Todos os comandos",
      summary: "Lista completa para consultar e buscar.",
      scope: "Todos os planos (alguns só no Plus)",
      lead: "Todos os comandos do robô. No privado dele, ajuda mostra os do seu plano, ajuda tudo mostra todos de uma vez e ajuda fila (ou horarios, cupom, grupo, links) mostra um assunto.",
      related: ["primeiros-passos", "problemas"],
      sections: [], // rendered by AjudaCommands from `commandList`
    },
    {
      slug: "assinatura",
      title: "Assinatura e pagamento",
      summary: "Plano, vencimento e Pix da mensalidade.",
      scope: "Todos os planos",
      lead: "A mensalidade é paga por Pix, direto pelo robô. Nada é apagado se o pagamento atrasar: o robô só pausa as postagens.",
      related: ["primeiros-passos", "problemas"],
      sections: [
        {
          id: "comandos",
          title: "Ver o plano e pagar",
          blocks: [
            {
              type: "table",
              head: ["Comando", "O que faz"],
              rows: [
                ["assinatura", "Mostra o plano, o valor e o vencimento."],
                ["pagar", "Recebe o Pix da mensalidade a qualquer momento."],
              ],
            },
          ],
        },
        {
          id: "regras",
          title: "Como funciona",
          blocks: [
            {
              type: "list",
              items: [
                "O robô avisa 3 dias antes do vencimento, com a chave Pix.",
                "Com mais de 3 dias de atraso, as postagens pausam até o pagamento ser confirmado.",
                "A fila e as configurações continuam como estavam.",
              ],
            },
          ],
        },
      ],
    },
    {
      slug: "problemas",
      title: "Problemas comuns",
      summary: "Robô parado, sessão vencida, link que não converteu, número caído.",
      scope: "Todos os planos",
      lead: "O que fazer quando algo não sai como esperado. Se nada aqui resolver, fale comigo pelo WhatsApp.",
      related: ["fila-e-horarios", "shopee-api", "mercado-livre"],
      sections: [
        {
          id: "nao-posta",
          title: "O robô não postou no horário",
          blocks: [
            {
              type: "list",
              items: [
                "Fila vazia: mande mais links. O robô avisa quando um horário não sai.",
                "Limite por hora: o robô posta no máximo 4 por hora e pula o horário se passar disso.",
                "Grupo não escolhido: mande grupos e depois grupo 1 (o número do seu grupo).",
                "Pausado: mande voltar. Para ver o estado, mande status.",
                "Mensalidade atrasada: com mais de 3 dias de atraso as postagens pausam. Mande pagar.",
              ],
            },
          ],
        },
        {
          id: "robo-nao-responde",
          title: "O robô não responde",
          blocks: [
            {
              type: "list",
              items: [
                "Escreva do seu WhatsApp pessoal para o número do robô. Mensagem do próprio número do robô para ele mesmo não é lida.",
                "O celular do chip precisa estar ligado e com internet. Com 14 dias sem internet o WhatsApp desconecta o robô.",
                "Se o número do robô caiu, me avise: reconecto o chip (ou conectamos um novo). O grupo e os membros continuam.",
              ],
            },
          ],
        },
        {
          id: "sessao",
          title: "“A sessão do Mercado Livre / Shein venceu”",
          blocks: [
            {
              type: "p",
              text: "É normal: o acesso vence de tempos em tempos. Enquanto isso, mande o link de afiliado (meli.la/...) do Mercado Livre ou o link da Shein com o preço. Para renovar, siga o passo a passo da loja:",
            },
            {
              type: "links",
              items: [
                { label: "Renovar o Mercado Livre", href: "/robo-de-ofertas/ajuda/mercado-livre#renovar" },
                { label: "Renovar a Shein", href: "/robo-de-ofertas/ajuda/shein#renovar" },
              ],
            },
          ],
        },
        {
          id: "link-nao-converteu",
          title: "O link não virou o meu link de afiliado",
          blocks: [
            {
              type: "list",
              items: [
                "Shopee: sem a API liberada, mande o link de afiliado (de Obter link) com o preço.",
                "Mercado Livre: link comum só vira seu com o cookie (Plus). Sem ele, mande o link meli.la.",
                "Shein: o robô não converte; mande o link de afiliado.",
                "Amazon: se faltar a tag, mande amazon seunome-20.",
              ],
            },
          ],
        },
        {
          id: "sem-preco",
          title: "O robô pediu o preço ou o nome do produto",
          blocks: [
            {
              type: "p",
              text: "Algumas lojas não mostram o preço para o robô. Mande o link de novo com o preço (ou com o nome e o preço):",
            },
            {
              type: "code",
              text: "link 199\nlink de 299 por 199\nlink Headset gamer HyperX de R$ 299 por R$ 199",
            },
          ],
        },
      ],
    },
  ] satisfies Topic[],
};

/** Commands listed on /ajuda/comandos, with the topic where each one is explained. */
export const commandList: { command: string; does: string; topic: string; plan: string }[] = [
  { command: "ajuda", does: "Menu de ajuda; ajuda tudo mostra todos os comandos.", topic: "comandos", plan: "Todos" },
  { command: "status", does: "Resumo e próximos horários.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "fila / fila 20", does: "Mostra as próximas ofertas.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "enviar / enviar 3", does: "Posta já a próxima oferta, ou a 3 da fila.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "pular", does: "Descarta a próxima oferta.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "remover 4", does: "Tira o item 4 da fila (vários: remover 2 4 7).", topic: "fila-e-horarios", plan: "Todos" },
  { command: "horarios", does: "Mostra a grade de horários.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "horarios 9h 12h 18:30", does: "Troca a grade de postagens.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "horarios 8h-23h a cada 30min", does: "Um post a cada 30 minutos.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "pausar / voltar", does: "Para e retoma as postagens.", topic: "fila-e-horarios", plan: "Todos" },
  { command: "grupos / grupo 2", does: "Lista os grupos e escolhe o grupo de envio.", topic: "primeiros-passos", plan: "Todos" },
  { command: "titulo / titulo auto", does: "Mostra ou troca o título das ofertas (auto volta ao padrão).", topic: "postar-links", plan: "Todos" },
  { command: "postar texto", does: "Posta no grupo exatamente o texto que vier depois.", topic: "postar-links", plan: "Todos" },
  { command: "cupom <link> / cupom off", does: "Coloca ou tira o cupom da Shopee nas ofertas.", topic: "cupons-e-avisos", plan: "Todos" },
  { command: "cupons", does: "Posta “CUPONS ATUALIZADOS” com o link do cupom.", topic: "cupons-e-avisos", plan: "Todos" },
  { command: "aviso CÓDIGO descrição", does: "Posta “CUPOM NOVINHO” no grupo.", topic: "cupons-e-avisos", plan: "Todos" },
  { command: "exclusivo 10.10 CÓDIGO descrição", does: "Posta “CUPOM EXCLUSIVO 10.10”.", topic: "cupons-e-avisos", plan: "Todos" },
  { command: "arte / arte off", does: "Mostra ou tira a arte do cupom (imagem com a legenda arte cupom guarda).", topic: "cupons-e-avisos", plan: "Todos" },
  { command: "temas / temas off", does: "Mostra ou troca os temas da busca da Shopee.", topic: "fila-e-horarios", plan: "Plus" },
  { command: "nicho casa, cozinha / nicho off", does: "Limita a busca a um nicho, ou volta a todas as categorias.", topic: "fila-e-horarios", plan: "Plus" },
  { command: "shopee", does: "Passo a passo para liberar a API da Shopee.", topic: "shopee-api", plan: "Plus" },
  { command: "shopee AppId Senha", does: "Cadastra o acesso à API da Shopee.", topic: "shopee-api", plan: "Plus" },
  { command: "mercadolivre / mercadolivre etiqueta", does: "Mostra ou troca a sua etiqueta de afiliado do Mercado Livre.", topic: "mercado-livre", plan: "Todos" },
  { command: "cookie / cookie <texto>", does: "Estado e renovação da sessão do Mercado Livre.", topic: "mercado-livre", plan: "Plus" },
  { command: "cookie shein / cookie shein <texto>", does: "Estado e renovação da sessão da Shein.", topic: "shein", plan: "Plus" },
  { command: "amazon / amazon seunome-20", does: "Mostra ou cadastra a sua tag de associado da Amazon.", topic: "amazon", plan: "Todos" },
  { command: "assinatura", does: "Plano, valor e vencimento.", topic: "assinatura", plan: "Todos" },
  { command: "pagar", does: "Recebe o Pix da mensalidade.", topic: "assinatura", plan: "Todos" },
];
