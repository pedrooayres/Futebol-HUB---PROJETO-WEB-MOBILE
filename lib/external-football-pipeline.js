export const externalSourceMeta = {
  provider: "SofaScore-style dataset pipeline",
  repository: "tunjayoff/sofascore_scraper",
  slices: ["statistics", "team_streaks", "pregame_form", "h2h", "lineups"],
  status: "seeded-import-ready",
  lastSyncLabel: "April 28, 2026"
};

export const externalTeamSeeds = [
  {
    slug: "vasco",
    name: "Vasco",
    league: "Brasil",
    rating: 82,
    coach: "Projeto em consolidacao com pressao competitiva alta",
    system: "4-3-3",
    phase: "Reestruturacao com urgencia de resultado",
    profile: "Clube de massa, ambiente de pressao e bom potencial para leitura de atletas resilientes.",
    style: "Alterna controle com transicoes mais diretas dependendo do contexto de jogo.",
    moment: "Busca estabilidade esportiva e aumento de consistencia competitiva.",
    marketFocus: "Atletas com maturidade emocional, intensidade e capacidade de resposta imediata.",
    reportSummary:
      "Ambiente relevante para scouting por expor o atleta a pressao, exigencia emocional e necessidade de adaptacao rapida.",
    strengths: ["Peso institucional", "Ambiente competitivo intenso", "Visibilidade nacional"],
    risks: ["Oscilacao de contexto", "Pressao externa alta", "Tomada de decisao sob ruido"],
    squadNeeds: ["Volante de sustentacao", "Extremo de aceleracao", "Zagueiro de cobertura"],
    opportunities: [
      "Monitorar atletas com resposta emocional forte",
      "Observar jovens em contexto de pressao",
      "Mapear nomes prontos para rendimento rapido"
    ],
    metrics: {
      offensiveIndex: 76,
      defensiveIndex: 74,
      developmentIndex: 79,
      consistencyIndex: 69
    },
    recentForm: [
      { opponent: "Santos", score: "1-1", result: "E", venue: "Casa" },
      { opponent: "Juventude", score: "2-0", result: "V", venue: "Casa" },
      { opponent: "Fortaleza", score: "0-1", result: "D", venue: "Fora" },
      { opponent: "Goias", score: "2-2", result: "E", venue: "Fora" },
      { opponent: "Criciuma", score: "1-0", result: "V", venue: "Casa" }
    ],
    homeAway: {
      home: "7V 3E 2D",
      away: "3V 3E 6D"
    },
    streaks: ["Pontua melhor em Sao Januario", "Volume defensivo cresce em bloco medio", "Sofre quando precisa rodar a posse longa"],
    advancedMetrics: {
      goalsPerMatch: 1.24,
      shotsOnTarget: 4.1,
      possession: 47,
      cleanSheetRate: 29
    },
    topPerformers: ["Vegetti | referencia de area", "Coutinho | ultimo passe", "Leo Jardim | protecao de pontos"],
    probableLineup: {
      formation: "4-3-3",
      starters: ["Leo Jardim", "Paulo Henrique", "Medel", "Leo", "Lucas Piton", "Zucarello", "Paulinho", "Coutinho", "Adson", "Vegetti", "David"],
      bench: ["Keiller", "Rojas", "Maicon", "Sforza", "Payet"]
    },
    h2hFocus: {
      target: "Santos",
      summary: "Jogo emocional, com tendencia de momentos longos de disputa por segunda bola e definicao em cruzamentos."
    },
    discipline: {
      foulsPerMatch: 15.1,
      yellowCards: 2.9,
      redCards: 0.2
    },
    setPieceProfile: {
      offensive: "Usa bastante o corredor esquerdo para gerar cruzamento no segundo poste.",
      defensive: "Protege a primeira trave, mas ainda cede rebote no limite da area."
    }
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    league: "Espanha",
    rating: 95,
    coach: "Modelo com heranca posicional e alta exigencia tecnica",
    system: "4-3-3",
    phase: "Competicao por elite com renovacao gradual",
    profile: "Clube de altissimo nivel para leitura de talentos sob exigencia tecnica e cognitiva elevada.",
    style: "Jogo posicional, relacao forte com bola e ocupacao refinada de espacos.",
    moment: "Renovacao parcial do elenco com manutencao de identidade de elite.",
    marketFocus: "Jovens de elite, versatilidade ofensiva e inteligencia posicional.",
    reportSummary:
      "Um dos melhores contextos para monitorar atletas com teto global, leitura de jogo e capacidade de atuar sob grande exigencia tecnica.",
    strengths: ["Formacao de elite", "Contexto tecnico extremo", "Peso internacional"],
    risks: ["Custo altissimo", "Concorrencia interna intensa", "Pouca margem para erro"],
    squadNeeds: ["Extremo de profundidade", "Volante de controle", "Lateral de apoio interno"],
    opportunities: [
      "Observar atletas de elite em jogos grandes",
      "Comparar rendimento sob alta demanda cognitiva",
      "Acompanhar transicao base-profissional"
    ],
    metrics: {
      offensiveIndex: 91,
      defensiveIndex: 85,
      developmentIndex: 96,
      consistencyIndex: 88
    },
    recentForm: [
      { opponent: "Sevilla", score: "2-0", result: "V", venue: "Casa" },
      { opponent: "Atletico", score: "1-1", result: "E", venue: "Fora" },
      { opponent: "Girona", score: "3-1", result: "V", venue: "Casa" },
      { opponent: "Villarreal", score: "2-1", result: "V", venue: "Fora" },
      { opponent: "Real Madrid", score: "1-2", result: "D", venue: "Casa" }
    ],
    homeAway: {
      home: "10V 1E 1D",
      away: "7V 3E 2D"
    },
    streaks: ["Mantem posse alta", "Gera muita recepcao entrelinhas", "Oscila quando o rival pressiona o primeiro passe"],
    advancedMetrics: {
      goalsPerMatch: 2.03,
      shotsOnTarget: 6.7,
      possession: 63,
      cleanSheetRate: 37
    },
    topPerformers: ["Lamine Yamal | criacao exterior", "Pedri | pausa e controle", "Araujo | cobertura longa"],
    probableLineup: {
      formation: "4-3-3",
      starters: ["Ter Stegen", "Kounde", "Araujo", "Cubarsi", "Balde", "De Jong", "Pedri", "Gavi", "Lamine Yamal", "Lewandowski", "Raphinha"],
      bench: ["Inaki Pena", "Christensen", "Fermin Lopez", "Joao Felix", "Ferran Torres"]
    },
    h2hFocus: {
      target: "Real Madrid",
      summary: "O classico testa se a equipe consegue manter superioridade posicional sem perder profundidade defensiva."
    },
    discipline: {
      foulsPerMatch: 10.2,
      yellowCards: 1.8,
      redCards: 0.1
    },
    setPieceProfile: {
      offensive: "Procura jogada ensaiada curta para gerar cruzamento atrasado.",
      defensive: "Defende bem a primeira disputa, mas pode sofrer com bloqueios no segundo poste."
    }
  }
];

export const externalPlayerSeeds = [
  {
    slug: "lamine-yamal",
    name: "Lamine Yamal",
    club: "Barcelona",
    teamSlug: "barcelona",
    role: "Ponta direita",
    rating: 95,
    age: 18,
    foot: "Canhoto",
    nationality: "Espanha",
    height: "1,80m",
    status: "Elite global",
    contractStatus: "Ativo estrategico",
    marketMoment: "Quase inatingivel para mercado comum",
    profile: "Extremo criativo com elite de gesto tecnico, improviso e leitura de ultimo terco.",
    summary: "Controle fino, pausa, agressividade criativa e altissimo potencial de decisao.",
    reportSummary:
      "Atleta de referencia global para perfis de um contra um, criacao exterior-interior e teto de elite internacional.",
    strengths: ["Drible curto", "Ultimo passe", "Criacao sob pressao"],
    concerns: ["Gestao de carga", "Protecao de desenvolvimento em calendario intenso"],
    recommendations: [
      "Monitorar evolucao de volume defensivo",
      "Cruzar impacto com adversarios de bloco baixo",
      "Usar como benchmark de extremo elite"
    ],
    metrics: {
      technique: 96,
      physical: 80,
      tactical: 89,
      projection: 98,
      decisionMaking: 92
    },
    seasonStats: {
      matches: 38,
      starts: 29,
      goals: 13,
      assists: 15,
      minutes: 2570,
      duelsWon: 7.1,
      keyPasses: 2.6
    },
    trendRatings: [8.1, 8.4, 8.6, 8.8, 8.3],
    recentMatches: [
      "vs Sevilla | gol e 5 conducoes progressivas",
      "vs Atletico | 1 assistencia e 4 dribles certos",
      "vs Girona | 3 chances criadas"
    ],
    availability: {
      condition: "Apto",
      load: "Gestao de elite",
      note: "Volume controlado em sequencias curtas para proteger explosao competitiva."
    },
    roleProfile: ["Parte largo e pisa dentro", "Cria em recepcao orientada", "Ataca fundo e meia-lua com naturalidade"],
    comparisonProfiles: ["Saka | decisao e volume", "Messi jovem | pausa e invenção", "Kubo | leveza exterior-interior"],
    shotProfile: {
      shots: 3.4,
      onTarget: 1.6,
      touchesInBox: 6
    }
  },
  {
    slug: "philippe-coutinho",
    name: "Philippe Coutinho",
    club: "Vasco",
    teamSlug: "vasco",
    role: "Meia ofensivo",
    rating: 83,
    age: 34,
    foot: "Destro",
    nationality: "Brasil",
    height: "1,72m",
    status: "Monitorado",
    contractStatus: "Gestao de minutos e contexto",
    marketMoment: "Leitura de recuperacao competitiva",
    profile: "Meia de refinamento tecnico e criacao curta, dependente de encaixe fisico e ritmo competitivo.",
    summary: "Ultimo passe, articulacao interior e impacto maior quando recebe em zonas de criacao.",
    reportSummary:
      "Nome relevante para entender adaptacao de talento tecnico a contexto de alta pressao e exigencia de retomada competitiva.",
    strengths: ["Passe de ruptura", "Refino tecnico", "Bola parada"],
    concerns: ["Disponibilidade fisica", "Ritmo competitivo", "Volume sem bola"],
    recommendations: [
      "Analisar minutos efetivos de alta intensidade",
      "Cruzar impacto com blocos medios e baixos",
      "Observar encaixe ao lado de extremos de profundidade"
    ],
    metrics: {
      technique: 88,
      physical: 65,
      tactical: 82,
      projection: 72,
      decisionMaking: 87
    },
    seasonStats: {
      matches: 21,
      starts: 14,
      goals: 4,
      assists: 5,
      minutes: 1180,
      duelsWon: 2.7,
      keyPasses: 2.4
    },
    trendRatings: [6.9, 7.1, 7.5, 7, 7.4],
    recentMatches: [
      "vs Juventude | 1 gol de fora da area",
      "vs Santos | 3 passes para finalizacao",
      "vs Goias | 4 acoes em bola parada"
    ],
    availability: {
      condition: "Apto com monitoramento",
      load: "Gestao de sequencia",
      note: "Valor maior quando recebe descanso entre partidas de alta carga."
    },
    roleProfile: ["Flutua em corredor interior", "Cria de frente para a linha", "Melhora o time em jogadas de bola parada"],
    comparisonProfiles: ["Ever Banega | pausa e passe", "Oscar | controle interior"],
    shotProfile: {
      shots: 1.8,
      onTarget: 0.8,
      touchesInBox: 2.1
    }
  },
  {
    slug: "gabriel-barbosa",
    name: "Gabriel Barbosa",
    club: "Flamengo",
    teamSlug: "flamengo",
    role: "Atacante",
    rating: 86,
    age: 29,
    foot: "Canhoto",
    nationality: "Brasil",
    height: "1,78m",
    status: "Contexto seletivo",
    contractStatus: "Janela de reavaliacao",
    marketMoment: "Oportunidade dependente de encaixe",
    profile: "Atacante de area e meia-lua, perigoso quando recebe volume e confiança competitiva.",
    summary: "Historico forte de decisao em jogos grandes, mas com demanda maior por contexto ofensivo favoravel.",
    reportSummary:
      "Nome de alto peso competitivo cuja leitura precisa separar repertorio comprovado, momento atual e aderencia tatico-comportamental.",
    strengths: ["Instinto de area", "Ataque a segunda bola", "Mentalidade de definicao"],
    concerns: ["Oscilacao recente", "Dependencia de ecossistema ofensivo", "Volume sem bola"],
    recommendations: [
      "Revisar jogos em modelo de area forte",
      "Checar resposta emocional fora de casa",
      "Evitar leitura isolada apenas por historico"
    ],
    metrics: {
      technique: 87,
      physical: 74,
      tactical: 82,
      projection: 78,
      decisionMaking: 84
    },
    seasonStats: {
      matches: 24,
      starts: 14,
      goals: 8,
      assists: 3,
      minutes: 1310,
      duelsWon: 3.9,
      keyPasses: 1.2
    },
    trendRatings: [6.8, 7.2, 7, 7.5, 6.9],
    recentMatches: [
      "vs Bahia | 1 gol e 2 finalizacoes na area",
      "vs Palmeiras | 1 assistencia curta",
      "vs Criciuma | 4 acoes no corredor interior"
    ],
    availability: {
      condition: "Apto",
      load: "Uso seletivo",
      note: "Melhor impacto quando entra em contexto de volume ofensivo sustentado."
    },
    roleProfile: ["Ataca rebote de area", "Busca diagonal curta para finalizacao", "Pode partir de fora para dentro"],
    comparisonProfiles: ["Calleri | area e duelo", "Pedro Raul | finalizacao frontal"],
    shotProfile: {
      shots: 2.8,
      onTarget: 1.1,
      touchesInBox: 5.4
    }
  }
];

export const externalMarketReportSeeds = [
  {
    slug: "gabriel-barbosa",
    title: "Relatorio de mercado | Gabriel Barbosa",
    subject: "Gabriel Barbosa",
    club: "Flamengo",
    type: "relatorio",
    status: "Oportunidade de contexto",
    rating: 86,
    profileType: "Atacante de area e apoio curto",
    horizon: "Curto prazo",
    marketWindow: "Janela de reavaliacao competitiva",
    executiveSummary:
      "Atleta com historico de decisao em alto nivel, mas em momento que exige leitura rigorosa de encaixe, contexto emocional e custo total da operacao.",
    strengths: ["Presenca de area", "Mentalidade de definicao", "Historico de jogos grandes"],
    risks: ["Oscilacao recente", "Ruido de ambiente", "Aderencia dependente de contexto ofensivo"],
    recommendations: [
      "Mapear cenarios em que o time gere volume de area",
      "Cruzar comportamento sem bola com exigencia do modelo",
      "Tratar como oportunidade de contexto, nao como resposta universal"
    ],
    reportBody: [
      "Gabriel Barbosa segue sendo um nome de alto peso competitivo quando o modelo sustenta area, cruzamento e presenca de criadores por dentro.",
      "A analise precisa separar historico de pico e fotografia atual. O valor do atleta cresce em ambientes que controlam bem a circulacao final e entregam bolas de decisao com frequencia.",
      "O risco principal esta em encaixe de modelo e ruido externo. O relatorio indica abordagem seletiva, com leitura forte de custo-beneficio e do ecossistema ofensivo ao redor."
    ],
    relatedProfiles: ["/jogadores/gabriel-barbosa", "/times/flamengo"]
  },
  {
    slug: "lamine-yamal-benchmark",
    title: "Relatorio benchmark | Lamine Yamal",
    subject: "Lamine Yamal",
    club: "Barcelona",
    type: "relatorio",
    status: "Benchmark elite",
    rating: 95,
    profileType: "Extremo criativo",
    horizon: "Medio prazo",
    marketWindow: "Ativo estrutural de altissimo valor",
    executiveSummary:
      "Relatorio de referencia para comparar extremos jovens de elite em criterios de tecnica, criatividade sob pressao e decisao no ultimo terco.",
    strengths: ["Controle em alta velocidade", "Inventividade", "Leitura de vantagem"],
    risks: ["Carga competitiva precoce", "Exposicao extrema"],
    recommendations: [
      "Usar como referencia de benchmark e nao como alvo realista",
      "Comparar extremos jovens por impacto e nao por nome",
      "Traduzir o perfil em criterios mensuraveis de scouting"
    ],
    reportBody: [
      "Mais do que alvo de mercado, o nome funciona como benchmark para calibrar leitura de extremos jovens.",
      "O relatorio ajuda a converter impressao visual em criterios de avaliacao repetiveis: recepcao orientada, criatividade sob pressao e capacidade de decidir por fora e por dentro.",
      "Para o produto, esse tipo de ficha externa amplia o uso profissional da busca e da biblioteca de referencia."
    ],
    relatedProfiles: ["/jogadores/lamine-yamal", "/times/barcelona"]
  }
];

export function buildPipelineSummary() {
  return {
    provider: externalSourceMeta.provider,
    repository: externalSourceMeta.repository,
    status: externalSourceMeta.status,
    lastSyncLabel: externalSourceMeta.lastSyncLabel,
    slices: externalSourceMeta.slices,
    totals: {
      teams: externalTeamSeeds.length,
      players: externalPlayerSeeds.length,
      reports: externalMarketReportSeeds.length
    }
  };
}
