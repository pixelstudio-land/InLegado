import { QuizForm, LeadSubmission } from "@/types/quiz"

export const mockForms: QuizForm[] = [
  {
    id: "legado-comercial",
    title: "Diagnóstico de Implementação Comercial",
    clientSlug: "legado",
    clientName: "Assessoria Legado",
    description: "Qualifique o perfil da sua empresa e receba um diagnóstico exclusivo para acelerar suas vendas.",
    theme: {
      primaryColor: "#c58e41", // Dourado Legado
      backgroundColor: "#0b0e14",
      cardBackground: "#131822",
      textColor: "#ffffff",
      accentColor: "#f5eedb",
      borderRadius: "rounded-2xl",
      buttonStyle: "modern",
      showProgressBar: true,
      socialProofBadge: "⭐ + de 250 Empresas Estruturadas comercialmente",
      logoUrl: ""
    },
    questions: [
      {
        id: "q1",
        title: "Qual é o nicho principal da sua empresa?",
        subtitle: "Selecione o segmento que melhor descreve o seu modelo de negócio:",
        type: "multiple_choice",
        options: [
          { id: "opt_varejo", label: "Comércio & Varejo", subtitle: "Lojas físicas, e-commerce, distribuição", icon: "🛍️", nextQuestionId: "q2" },
          { id: "opt_servicos", label: "Prestação de Serviços", subtitle: "Consultorias, agências, B2B", icon: "💼", nextQuestionId: "q2" },
          { id: "opt_construcao", label: "Construção & Reformas", subtitle: "Arquitetura, acabamentos, empreiteiras", icon: "🏗️", nextQuestionId: "q2" },
          { id: "opt_saude", label: "Saúde & Estética", subtitle: "Clínicas, consultórios, estética avançada", icon: "🩺", nextQuestionId: "q2" },
        ]
      },
      {
        id: "q2",
        title: "Qual é o faturamento mensal médio atual do negócio?",
        subtitle: "Essa informação é confidencial e serve para definir o tamanho da equipe comercial ideal:",
        type: "multiple_choice",
        options: [
          { id: "fat_ate20k", label: "Até R$ 20.000 / mês", subtitle: "Fase inicial de estruturação", icon: "🌱", nextQuestionId: "q3_inicial" },
          { id: "fat_20_50k", label: "R$ 20.000 a R$ 50.000 / mês", subtitle: "Em crescimento com vendas recorrentes", icon: "📈", nextQuestionId: "q3_escala" },
          { id: "fat_50_150k", label: "R$ 50.000 a R$ 150.000 / mês", subtitle: "Operação consolidada buscando escala", icon: "🚀", nextQuestionId: "q3_escala" },
          { id: "fat_150k_plus", label: "Acima de R$ 150.000 / mês", subtitle: "Foco em automação e time comercial ativo", icon: "👑", nextQuestionId: "q3_escala" },
        ]
      },
      {
        id: "q3_inicial",
        title: "Qual é o seu maior gargalo hoje para vender mais?",
        subtitle: "Onde o seu tempo mais fica travado?",
        type: "multiple_choice",
        options: [
          { id: "garg_leads", label: "Falta de clientes qualificados chegando", icon: "🎯", nextQuestionId: "q4" },
          { id: "garg_vendas", label: "Recebo mensagens, mas poucos compram", icon: "💬", nextQuestionId: "q4" },
          { id: "garg_tempo", label: "Não tenho tempo para atender e vender", icon: "⏰", nextQuestionId: "q4" },
        ]
      },
      {
        id: "q3_escala",
        title: "Sua empresa já investe em tráfego pago (Meta / Google Ads)?",
        subtitle: "Conte-nos como está o cenário de anúncios hoje:",
        type: "multiple_choice",
        options: [
          { id: "ads_sim_escala", label: "Sim, e quero escalar com processos comerciais", icon: "🔥", nextQuestionId: "q4" },
          { id: "ads_sim_ruim", label: "Sim, mas chega muito curioso desqualificado", icon: "📉", nextQuestionId: "q4" },
          { id: "ads_nao", label: "Não invisto ainda, queremos começar certo", icon: "💡", nextQuestionId: "q4" },
        ]
      },
      {
        id: "q4",
        title: "Perfeito! Quem é a pessoa responsável pelo comercial?",
        subtitle: "Digite o seu nome completo:",
        type: "text",
        placeholder: "Seu nome ou da sua empresa",
        nextQuestionId: "q5"
      },
      {
        id: "q5",
        title: "Qual o seu melhor WhatsApp com DDD?",
        subtitle: "Nosso consultor vai enviar a análise e o plano comercial diretamente no seu WhatsApp:",
        type: "phone",
        placeholder: "(11) 99999-9999",
      }
    ],
    thankYouScreen: {
      title: "Diagnóstico Comercial Liberado! 🎉",
      subtitle: "Analisamos as suas respostas e identificamos uma oportunidade de ouro para estruturar seu funil e triplicar o volume de fechamentos.",
      ctaText: "Falar com Consultor no WhatsApp",
      whatsappNumber: "5511999999999",
      whatsappMessageTemplate: "Olá! Acabei de preencher o diagnóstico comercial no InLegado para a empresa {nome} e gostaria de agendar a sessão estratégica.",
      showSummary: true
    },
    createdAt: "2026-09-01",
    stats: {
      views: 1420,
      completions: 384,
      leads: 384
    }
  },
  {
    id: "real-pisos-orcamento",
    title: "Calculadora de Orçamento & Piso Ideal",
    clientSlug: "real-pisos",
    clientName: "Real Pisos Laminados",
    description: "Descubra em 1 minuto o piso vinílico ou laminado perfeito para o seu ambiente com preço de fábrica.",
    theme: {
      primaryColor: "#f97316", // Laranja Real Pisos
      backgroundColor: "#0f172a",
      cardBackground: "#1e293b",
      textColor: "#f8fafc",
      accentColor: "#fdba74",
      borderRadius: "rounded-xl",
      buttonStyle: "modern",
      showProgressBar: true,
      socialProofBadge: "🛡️ Garantia de 10 Anos | Instalação em 24h",
      logoUrl: ""
    },
    questions: [
      {
        id: "piso_tipo",
        title: "Qual modelo de piso você deseja para o seu espaço?",
        subtitle: "Selecione o acabamento desejado:",
        type: "multiple_choice",
        options: [
          { id: "vinilico", label: "Piso Vinílico (Resistente à água)", subtitle: "Ideal para sala, quartos, cozinhas e pets", icon: "💧", nextQuestionId: "piso_metragem" },
          { id: "laminado", label: "Piso Laminado (Conforto térmico)", subtitle: "Elegância clássica com ótimo custo-benefício", icon: "🪵", nextQuestionId: "piso_metragem" },
          { id: "boiserie", label: "Boiserie & Rodapés", subtitle: "Acabamentos de parede de alto padrão", icon: "🖼️", nextQuestionId: "piso_metragem" },
          { id: "ambos", label: "Quero ajuda de um especialista", subtitle: "Não sei qual o melhor pro meu caso", icon: "📐", nextQuestionId: "piso_metragem" },
        ]
      },
      {
        id: "piso_metragem",
        title: "Aproximadamente quantos metros quadrados (m²)?",
        subtitle: "Se não souber exatamente, escolha a estimativa mais próxima:",
        type: "multiple_choice",
        options: [
          { id: "m_ate30", label: "Até 30 m²", subtitle: "1 a 2 cômodos pequenos", icon: "🛋️", nextQuestionId: "piso_urgencia" },
          { id: "m_30_60", label: "De 30 a 60 m²", subtitle: "Apartamento padrão ou vários cômodos", icon: "🏡", nextQuestionId: "piso_urgencia" },
          { id: "m_60_100", label: "De 60 a 100 m²", subtitle: "Casa completa ou reforma ampla", icon: "🏢", nextQuestionId: "piso_urgencia" },
          { id: "m_mais100", label: "Mais de 100 m²", subtitle: "Grandes imóveis ou comercial", icon: "🏰", nextQuestionId: "piso_urgencia" },
        ]
      },
      {
        id: "piso_urgencia",
        title: "Para quando você planeja a instalação?",
        type: "multiple_choice",
        options: [
          { id: "urg_imediato", label: "O quanto antes (Imediato)", icon: "⚡", nextQuestionId: "piso_contato_nome" },
          { id: "urg_1_3_meses", label: "Dentro de 1 a 3 meses", icon: "🗓️", nextQuestionId: "piso_contato_nome" },
          { id: "urg_cotando", label: "Apenas pesquisando valores", icon: "🔎", nextQuestionId: "piso_contato_nome" },
        ]
      },
      {
        id: "piso_contato_nome",
        title: "Como podemos te chamar?",
        subtitle: "Informe seu primeiro nome:",
        type: "text",
        placeholder: "Seu nome",
        nextQuestionId: "piso_contato_tel"
      },
      {
        id: "piso_contato_tel",
        title: "WhatsApp para envio do orçamento oficial com desconto:",
        subtitle: "Enviaremos o catálogo em PDF com as fotos dos padrões de cores:",
        type: "phone",
        placeholder: "(11) 99999-9999",
      }
    ],
    thankYouScreen: {
      title: "Orçamento Calculado com Sucesso! 🎁",
      subtitle: "Separamos uma condição especial de fábrica com rodapé cortesia para o seu projeto.",
      ctaText: "Receber Orçamento no WhatsApp",
      whatsappNumber: "5531989583849",
      whatsappMessageTemplate: "Olá! Acabei de simular meu orçamento na Real Pisos no InLegado ({nome}). Gostaria de receber o catálogo e o valor com desconto!",
      showSummary: true
    },
    createdAt: "2026-08-15",
    stats: {
      views: 2890,
      completions: 742,
      leads: 742
    }
  }
]

export const mockSubmissions: LeadSubmission[] = [
  {
    id: "lead_1",
    formId: "real-pisos-orcamento",
    formTitle: "Calculadora de Orçamento & Piso Ideal",
    clientName: "Real Pisos Laminados",
    name: "Viviane Teixeira",
    phone: "(31) 97585-6668",
    answers: {
      "piso_tipo": "Piso Vinílico (Resistente à água)",
      "piso_metragem": "De 30 a 60 m²",
      "piso_urgencia": "O quanto antes (Imediato)"
    },
    utmParams: { "utm_source": "meta_ads", "utm_campaign": "vinilico_reforma" },
    createdAt: "Hoje às 15:40",
    status: "Novo"
  },
  {
    id: "lead_2",
    formId: "legado-comercial",
    formTitle: "Diagnóstico de Implementação Comercial",
    clientName: "Assessoria Legado",
    name: "Marcos Vinicius",
    phone: "(11) 98844-1234",
    answers: {
      "q1": "Construção & Reformas",
      "q2": "R$ 50.000 a R$ 150.000 / mês",
      "q3_escala": "Sim, e quero escalar com processos comerciais"
    },
    utmParams: { "utm_source": "google_ads", "utm_campaign": "escala_comercial" },
    createdAt: "Hoje às 14:15",
    status: "Em Atendimento"
  },
  {
    id: "lead_3",
    formId: "real-pisos-orcamento",
    formTitle: "Calculadora de Orçamento & Piso Ideal",
    clientName: "Real Pisos Laminados",
    name: "Wellington Teodoro",
    phone: "(31) 98811-5522",
    answers: {
      "piso_tipo": "Piso Laminado (Conforto térmico)",
      "piso_metragem": "Mais de 100 m²",
      "piso_urgencia": "O quanto antes (Imediato)"
    },
    utmParams: { "utm_source": "meta_ads", "utm_campaign": "laminado_luxo" },
    createdAt: "Ontem às 18:22",
    status: "Convertido"
  }
]
