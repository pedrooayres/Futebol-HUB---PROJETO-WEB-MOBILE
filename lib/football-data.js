import {
  externalMarketReportSeeds,
  externalPlayerSeeds,
  externalSourceMeta,
  externalTeamSeeds
} from "@/lib/external-football-pipeline";

function createTeam(data) {
  return {
    source: "Base curada",
    recentForm: [],
    homeAway: {
      home: "",
      away: ""
    },
    streaks: [],
    advancedMetrics: {
      goalsPerMatch: 0,
      shotsOnTarget: 0,
      possession: 0,
      cleanSheetRate: 0
    },
    topPerformers: [],
    probableLineup: {
      formation: data.system,
      starters: [],
      bench: []
    },
    h2hFocus: {
      target: "",
      summary: ""
    },
    discipline: {
      foulsPerMatch: 0,
      yellowCards: 0,
      redCards: 0
    },
    setPieceProfile: {
      offensive: "",
      defensive: ""
    },
    ...data
  };
}

function createPlayer(data) {
  return {
    source: "Base curada",
    seasonStats: {
      matches: 0,
      starts: 0,
      goals: 0,
      assists: 0,
      minutes: 0,
      duelsWon: 0,
      keyPasses: 0
    },
    trendRatings: [],
    recentMatches: [],
    availability: {
      condition: "",
      load: "",
      note: ""
    },
    roleProfile: [],
    comparisonProfiles: [],
    shotProfile: {
      shots: 0,
      onTarget: 0,
      touchesInBox: 0
    },
    ...data
  };
}

const curatedTeams = [
  createTeam({
    slug: "santos",
    name: "Santos",
    league: "Brasil",
    rating: 84,
    coach: "Comissao tecnica em reconstrucao",
    system: "4-2-3-1",
    phase: "Reconstrucao competitiva",
    profile: "Tradicao, base forte e alto potencial de narrativa para scouting.",
    style: "Bloco tecnico com saida curta e peso historico.",
    moment: "Reconstrucao com foco em protagonismo da base.",
    marketFocus: "Jovens ofensivos e meias de criacao.",
    reportSummary:
      "Clube com valor alto de observacao para perfil tecnico e atletas em fase de afirmacao competitiva.",
    strengths: ["Talento individual", "Conexao com a base", "Capacidade de acelerar transicoes"],
    risks: ["Oscilacao competitiva", "Dependencia de jovens", "Pressao por curto prazo"],
    squadNeeds: ["Zagueiro de imposicao", "Volante de equilibrio", "Extremo de profundidade"],
    opportunities: [
      "Monitorar atacantes de 1x1",
      "Acompanhar meias criativos da base",
      "Explorar janela de valorizacao precoce"
    ],
    metrics: {
      offensiveIndex: 81,
      defensiveIndex: 72,
      developmentIndex: 91,
      consistencyIndex: 68
    },
    recentForm: [
      { opponent: "Botafogo", score: "1-1", result: "E", venue: "Fora" },
      { opponent: "Cuiaba", score: "2-0", result: "V", venue: "Casa" },
      { opponent: "Cruzeiro", score: "0-1", result: "D", venue: "Fora" },
      { opponent: "Goias", score: "3-1", result: "V", venue: "Casa" },
      { opponent: "Bahia", score: "1-2", result: "D", venue: "Fora" }
    ],
    homeAway: {
      home: "7V 2E 2D",
      away: "3V 4E 5D"
    },
    streaks: ["2 jogos sem clean sheet", "Marcou em 4 dos ultimos 5 jogos", "Base usada em 5 titulares recentes"],
    advancedMetrics: {
      goalsPerMatch: 1.42,
      shotsOnTarget: 4.9,
      possession: 54,
      cleanSheetRate: 27
    },
    topPerformers: ["Neymar | criacao e ultimo passe", "Guilherme | ruptura curta", "Joao Schmidt | controle de ritmo"],
    probableLineup: {
      formation: "4-2-3-1",
      starters: ["Brazão", "Aderlan", "Gil", "Joaquim", "Escobar", "Schmidt", "Pituca", "Guilherme", "Neymar", "Otero", "Furch"],
      bench: ["Joao Paulo", "Hayner", "Kevyson", "Cazares", "Pedrinho"]
    },
    h2hFocus: {
      target: "Vasco",
      summary: "Confronto de pressao alta, normalmente definido por bola parada e transicao curta."
    },
    discipline: {
      foulsPerMatch: 13.1,
      yellowCards: 2.5,
      redCards: 0.2
    },
    setPieceProfile: {
      offensive: "Boa variacao entre escanteio fechado e segunda bola na entrada da area.",
      defensive: "Sofre quando a segunda bola cai entre lateral e zagueiro."
    }
  }),
  createTeam({
    slug: "palmeiras",
    name: "Palmeiras",
    league: "Brasil",
    rating: 92,
    coach: "Estrutura estabilizada de alto nivel",
    system: "4-3-3",
    phase: "Alta performance sustentada",
    profile: "Elenco equilibrado e maturidade competitiva em jogos grandes.",
    style: "Intensidade sem bola e transicao muito agressiva.",
    moment: "Clube de referencia em consistencia e vendas de alto nivel.",
    marketFocus: "Atletas com teto alto e polivalencia tatico-fisica.",
    reportSummary:
      "Ambiente ideal para identificar atletas com prontidao competitiva e alto potencial de mercado.",
    strengths: ["Competitividade", "Estrutura", "Formacao e valorizacao"],
    risks: ["Concorrencia interna elevada", "Janela curta para compra", "Preco inflacionado"],
    squadNeeds: ["Reposicao para laterais", "Meia de controle", "Opcao de profundidade ofensiva"],
    opportunities: [
      "Atletas versateis para mercados internacionais",
      "Jogadores com boa resposta sem bola",
      "Nomes prontos para salto de categoria"
    ],
    metrics: {
      offensiveIndex: 88,
      defensiveIndex: 89,
      developmentIndex: 94,
      consistencyIndex: 92
    },
    recentForm: [
      { opponent: "Gremio", score: "3-0", result: "V", venue: "Casa" },
      { opponent: "Bragantino", score: "1-0", result: "V", venue: "Fora" },
      { opponent: "Flamengo", score: "1-1", result: "E", venue: "Casa" },
      { opponent: "Athletico", score: "2-1", result: "V", venue: "Fora" },
      { opponent: "Inter", score: "2-0", result: "V", venue: "Casa" }
    ],
    homeAway: {
      home: "9V 2E 1D",
      away: "7V 3E 2D"
    },
    streaks: ["4 jogos sem perder", "3 clean sheets nos ultimos 5 jogos", "Manteve xGA baixo em sequencia"],
    advancedMetrics: {
      goalsPerMatch: 1.89,
      shotsOnTarget: 6.1,
      possession: 57,
      cleanSheetRate: 46
    },
    topPerformers: ["Estevao | desequilibrio de 1x1", "Raphael Veiga | ultimo passe", "Murilo | dominio aereo"],
    probableLineup: {
      formation: "4-3-3",
      starters: ["Weverton", "Mayke", "Gomez", "Murilo", "Piquerez", "Anibal", "Ze Rafael", "Veiga", "Estevao", "Rony", "Lazaro"],
      bench: ["Marcelo Lomba", "Rocha", "Naves", "Fabinho", "Luis Guilherme"]
    },
    h2hFocus: {
      target: "Flamengo",
      summary: "Duelo de alto nivel em que o Palmeiras cresce quando consegue atacar a segunda bola e acelerar pelos lados."
    },
    discipline: {
      foulsPerMatch: 11.4,
      yellowCards: 2.1,
      redCards: 0.1
    },
    setPieceProfile: {
      offensive: "Muito forte em escanteio na primeira trave e bola parada lateral.",
      defensive: "Boa organizacao de zona mista, raramente perde a primeira disputa."
    }
  }),
  createTeam({
    slug: "flamengo",
    name: "Flamengo",
    league: "Brasil",
    rating: 90,
    coach: "Modelo orientado a dominancia ofensiva",
    system: "4-2-3-1",
    phase: "Pressao por resultado imediato",
    profile: "Volume ofensivo, nomes conhecidos e forte atracao de audiencia.",
    style: "Dominio territorial e criacao entrelinhas.",
    moment: "Pressao por performance imediata e elenco de alta exposicao.",
    marketFocus: "Jogadores prontos para impacto tecnico imediato.",
    reportSummary:
      "Clube com alta exposicao e excelente recorte para avaliar desempenho sob pressao e exigencia ofensiva.",
    strengths: ["Criacao", "Profundidade de elenco", "Peso ofensivo"],
    risks: ["Rotacao curta para alguns setores", "Custo alto de aquisicao", "Ruido competitivo"],
    squadNeeds: ["Extremo de recomposicao", "Volante de cobertura", "Zagueiro rapido"],
    opportunities: [
      "Atletas para impacto imediato",
      "Jogadores acostumados a pressao competitiva",
      "Pecas de alto valor de vitrine"
    ],
    metrics: {
      offensiveIndex: 93,
      defensiveIndex: 78,
      developmentIndex: 82,
      consistencyIndex: 81
    },
    recentForm: [
      { opponent: "Bahia", score: "2-2", result: "E", venue: "Fora" },
      { opponent: "Corinthians", score: "3-1", result: "V", venue: "Casa" },
      { opponent: "Palmeiras", score: "1-1", result: "E", venue: "Fora" },
      { opponent: "Atletico-MG", score: "2-0", result: "V", venue: "Casa" },
      { opponent: "Criciuma", score: "1-0", result: "V", venue: "Fora" }
    ],
    homeAway: {
      home: "8V 3E 1D",
      away: "6V 4E 2D"
    },
    streaks: ["5 jogos marcando", "Media alta de finalizacoes na area", "Oscilacao defensiva em transicoes longas"],
    advancedMetrics: {
      goalsPerMatch: 1.97,
      shotsOnTarget: 6.4,
      possession: 60,
      cleanSheetRate: 32
    },
    topPerformers: ["Pedro | area e apoio", "Arrascaeta | criacao interior", "Gerson | conducoes de progressao"],
    probableLineup: {
      formation: "4-2-3-1",
      starters: ["Rossi", "Varela", "Leo Ortiz", "Fabricio Bruno", "Ayrton Lucas", "Pulgar", "Gerson", "Luiz Araujo", "Arrascaeta", "Cebolinha", "Pedro"],
      bench: ["Matheus Cunha", "Wesley", "Leo Pereira", "Allan", "Victor Hugo"]
    },
    h2hFocus: {
      target: "Palmeiras",
      summary: "Confronto de elite em que a ocupacao entrelinhas do Flamengo precisa superar o bloco medio rival."
    },
    discipline: {
      foulsPerMatch: 12.3,
      yellowCards: 2.4,
      redCards: 0.2
    },
    setPieceProfile: {
      offensive: "Boa execucao de escanteio curto e bloqueios para finalizacao frontal.",
      defensive: "Defesa da segunda bola ainda exposta em escanteios batidos abertos."
    }
  }),
  createTeam({
    slug: "fortaleza",
    name: "Fortaleza",
    league: "Brasil",
    rating: 86,
    coach: "Projeto coletivo de identidade forte",
    system: "3-4-2-1",
    phase: "Competitividade sustentada",
    profile: "Organizacao coletiva e consistencia recente em competicoes nacionais.",
    style: "Jogo vertical com boa ocupacao dos corredores.",
    moment: "Projeto competitivo com identidade e leitura coletiva forte.",
    marketFocus: "Atletas funcionais para intensidade e disciplina tatico-posicional.",
    reportSummary:
      "Contexto muito util para identificar atletas de sistema, intensidade e boa aderencia coletiva.",
    strengths: ["Coletivo", "Verticalidade", "Regularidade"],
    risks: ["Menor margem para improviso", "Dependencia de encaixe funcional", "Mercado competitivo"],
    squadNeeds: ["Lateral de profundidade", "Segundo atacante", "Volante de construcao"],
    opportunities: [
      "Jogadores de alta disciplina tatico-posicional",
      "Perfis resilientes para jogo sem bola",
      "Atletas com bom custo-beneficio"
    ],
    metrics: {
      offensiveIndex: 79,
      defensiveIndex: 84,
      developmentIndex: 76,
      consistencyIndex: 85
    },
    recentForm: [
      { opponent: "Athletico", score: "1-0", result: "V", venue: "Casa" },
      { opponent: "Ceara", score: "1-1", result: "E", venue: "Fora" },
      { opponent: "Cruzeiro", score: "2-1", result: "V", venue: "Casa" },
      { opponent: "Palmeiras", score: "0-2", result: "D", venue: "Fora" },
      { opponent: "Bragantino", score: "1-0", result: "V", venue: "Casa" }
    ],
    homeAway: {
      home: "8V 2E 2D",
      away: "4V 4E 4D"
    },
    streaks: ["Perde pouco como mandante", "Equipe muito estavel sem bola", "Melhora no corredor direito"],
    advancedMetrics: {
      goalsPerMatch: 1.38,
      shotsOnTarget: 4.3,
      possession: 49,
      cleanSheetRate: 41
    },
    topPerformers: ["Lucero | ataque a area", "Pochettino | conexao interior", "Titi | controle de area"],
    probableLineup: {
      formation: "3-4-2-1",
      starters: ["Joao Ricardo", "Britez", "Titi", "Kuscevic", "Tinga", "Hercules", "Martinez", "Bruno Pacheco", "Pochettino", "Moises", "Lucero"],
      bench: ["Santos", "Yago Pikachu", "Cardona", "Calebe", "Machuca"]
    },
    h2hFocus: {
      target: "Vasco",
      summary: "Encaixe bom para testar capacidade de ganhar corredor e controlar rebote defensivo."
    },
    discipline: {
      foulsPerMatch: 14.2,
      yellowCards: 2.8,
      redCards: 0.1
    },
    setPieceProfile: {
      offensive: "Muito perigoso em faltas laterais com atacantes entrando em diagonal.",
      defensive: "Sofre menos em zona frontal, mas concede segunda bola lateral."
    }
  })
];

const curatedPlayers = [
  createPlayer({
    slug: "estevao",
    name: "Estevao",
    club: "Palmeiras",
    teamSlug: "palmeiras",
    role: "Ponta",
    rating: 92,
    age: 17,
    foot: "Canhoto",
    nationality: "Brasil",
    height: "1,76m",
    status: "Prioridade alta",
    contractStatus: "Valorizacao acelerada",
    marketMoment: "Janela muito competitiva",
    profile: "Atacante de 1x1 com aceleracao e desequilibrio.",
    summary: "Explosao, drible curto e decisao acelerada no ultimo terco.",
    reportSummary:
      "Perfil premium de ataque com teto muito alto para mercados que valorizam desequilibrio individual.",
    strengths: ["Ruptura", "Conducao agressiva", "Finalizacao curta"],
    concerns: ["Fisico ainda em maturacao", "Tomada de decisao sob bloqueio baixo"],
    recommendations: [
      "Monitorar jogos de alta exigencia fisica",
      "Avaliar resposta sem bola em bloco medio",
      "Priorizar analise de decisao no ultimo passe"
    ],
    metrics: {
      technique: 93,
      physical: 79,
      tactical: 82,
      projection: 97,
      decisionMaking: 84
    },
    seasonStats: {
      matches: 29,
      starts: 22,
      goals: 11,
      assists: 8,
      minutes: 1860,
      duelsWon: 6.3,
      keyPasses: 2.1
    },
    trendRatings: [7.4, 7.8, 8.2, 8.6, 8],
    recentMatches: [
      "vs Gremio | gol e 4 dribles certos",
      "vs Flamengo | 2 passes decisivos",
      "vs Inter | 6 acoes no ultimo terco"
    ],
    availability: {
      condition: "Apto",
      load: "Carga monitorada",
      note: "Controle de minutos em sequencia de jogos de alta intensidade."
    },
    roleProfile: ["Recebe aberto e acelera para dentro", "Ameaça profundidade curta", "Impacta em posse e transicao"],
    comparisonProfiles: ["Savinho | aceleracao e conducao", "Kubo | leitura exterior-interior", "Lamine Yamal | criatividade de elite"],
    shotProfile: {
      shots: 2.9,
      onTarget: 1.3,
      touchesInBox: 5.7
    }
  }),
  createPlayer({
    slug: "neymar",
    name: "Neymar",
    club: "Santos",
    teamSlug: "santos",
    role: "Meia",
    rating: 96,
    age: 34,
    foot: "Destro",
    nationality: "Brasil",
    height: "1,75m",
    status: "Observacao premium",
    contractStatus: "Impacto imediato",
    marketMoment: "Leitura de curto prazo",
    profile: "Criador com capacidade de controlar ritmo e gerar vantagem tecnica.",
    summary: "Criatividade, passe de ruptura e alta leitura de espacos.",
    reportSummary:
      "Perfil de elite para criacao e tomada de decisao em zonas de vantagem, com forte impacto tecnico imediato.",
    strengths: ["Passe final", "Improviso", "Aceleracao mental"],
    concerns: ["Gestao fisica", "Disponibilidade competitiva", "Dependencia criativa do entorno"],
    recommendations: [
      "Avaliar controle de carga e disponibilidade",
      "Usar em cenarios de criacao orientada",
      "Monitorar consistencia entre jogos sequenciais"
    ],
    metrics: {
      technique: 97,
      physical: 72,
      tactical: 94,
      projection: 85,
      decisionMaking: 96
    },
    seasonStats: {
      matches: 17,
      starts: 13,
      goals: 6,
      assists: 7,
      minutes: 1125,
      duelsWon: 4.1,
      keyPasses: 3.4
    },
    trendRatings: [7.1, 7.9, 8.3, 7.5, 8],
    recentMatches: [
      "vs Cuiaba | 1 gol e 5 passes para finalizacao",
      "vs Vasco | 4 acoes criativas em zona 14",
      "vs Botafogo | 3 faltas sofridas no terco final"
    ],
    availability: {
      condition: "Apto com controle",
      load: "Gestao de sequencia",
      note: "Mais produtivo com janela de recuperacao entre jogos."
    },
    roleProfile: ["Flutua entre linhas", "Conecta corredor interno", "Recebe para decidir no ultimo passe"],
    comparisonProfiles: ["Paqueta | pausa e controle", "Dybala | criatividade entrelinhas"],
    shotProfile: {
      shots: 3.1,
      onTarget: 1.4,
      touchesInBox: 4.3
    }
  }),
  createPlayer({
    slug: "pedro",
    name: "Pedro",
    club: "Flamengo",
    teamSlug: "flamengo",
    role: "Centroavante",
    rating: 89,
    age: 29,
    foot: "Destro",
    nationality: "Brasil",
    height: "1,85m",
    status: "Aprovado",
    contractStatus: "Pronto para rendimento",
    marketMoment: "Alto valor competitivo",
    profile: "Referencia tecnica para area, pivo e definicao.",
    summary: "Finalizacao refinada e sustentacao ofensiva de costas.",
    reportSummary:
      "Centroavante de rendimento imediato, muito util para modelos com area forte e jogo apoiado.",
    strengths: ["Area", "Finalizacao", "Jogo apoiado"],
    concerns: ["Aceleracao longa", "Mobilidade em ataques de profundidade"],
    recommendations: [
      "Priorizar uso em ataques posicionais",
      "Cruzar desempenho com criadores de corredor interno",
      "Avaliar encaixe em modelo com cruzamento e apoio"
    ],
    metrics: {
      technique: 90,
      physical: 81,
      tactical: 87,
      projection: 80,
      decisionMaking: 88
    },
    seasonStats: {
      matches: 31,
      starts: 26,
      goals: 18,
      assists: 4,
      minutes: 2240,
      duelsWon: 5.8,
      keyPasses: 1
    },
    trendRatings: [7.6, 8.1, 7.9, 8.4, 7.7],
    recentMatches: [
      "vs Corinthians | 2 gols e 6 toques na area",
      "vs Bahia | 1 gol e 3 finalizacoes no alvo",
      "vs Atletico-MG | 7 duelos vencidos"
    ],
    availability: {
      condition: "Apto",
      load: "Estavel",
      note: "Rendimento sobe quando o time sustenta presença no terço final."
    },
    roleProfile: ["Ataca zona de penalti", "Sustenta apoios frontais", "Gera ameaca constante no primeiro poste"],
    comparisonProfiles: ["Taremi | apoio e area", "Giroud | finalizacao e referencia"],
    shotProfile: {
      shots: 3.7,
      onTarget: 1.8,
      touchesInBox: 6.8
    }
  }),
  createPlayer({
    slug: "lucero",
    name: "Lucero",
    club: "Fortaleza",
    teamSlug: "fortaleza",
    role: "Atacante",
    rating: 84,
    age: 34,
    foot: "Destro",
    nationality: "Argentina",
    height: "1,82m",
    status: "Monitorado",
    contractStatus: "Rendimento funcional",
    marketMoment: "Utilidade de sistema",
    profile: "Finalizador de zona critica com leitura boa de ocupacao.",
    summary: "Ataque a area com constancia e boa relacao com o gol.",
    reportSummary:
      "Atacante funcional para modelos verticais, com boa leitura de zona de finalizacao e regularidade.",
    strengths: ["Movimento de area", "Definicao", "Regularidade"],
    concerns: ["Menor impacto criativo fora da area", "Dependencia de servico"],
    recommendations: [
      "Avaliar em jogos de transicao",
      "Monitorar resposta contra linhas baixas",
      "Usar como referencia de area e ultimo movimento"
    ],
    metrics: {
      technique: 82,
      physical: 76,
      tactical: 85,
      projection: 74,
      decisionMaking: 84
    },
    seasonStats: {
      matches: 33,
      starts: 28,
      goals: 15,
      assists: 3,
      minutes: 2410,
      duelsWon: 4.7,
      keyPasses: 0.8
    },
    trendRatings: [7.2, 7.4, 7.8, 7.1, 7.5],
    recentMatches: [
      "vs Athletico | gol da vitoria",
      "vs Cruzeiro | 3 ataques de primeira trave",
      "vs Bragantino | 5 duelos aereos vencidos"
    ],
    availability: {
      condition: "Apto",
      load: "Estavel",
      note: "Muito funcional em modelo que ataca corredor e segunda bola."
    },
    roleProfile: ["Ultimo movimento na area", "Ataque de primeira trave", "Finaliza com poucos toques"],
    comparisonProfiles: ["German Cano | area e tempo", "Mastriani | profundidade curta"],
    shotProfile: {
      shots: 3,
      onTarget: 1.4,
      touchesInBox: 6.1
    }
  })
];

export const featuredTeams = [
  ...curatedTeams,
  ...externalTeamSeeds.map((item) => createTeam({ ...item, source: "Pipeline externo" }))
];

export const spotlightPlayers = [
  ...curatedPlayers,
  ...externalPlayerSeeds.map((item) => createPlayer({ ...item, source: "Pipeline externo" }))
];

export const marketReports = externalMarketReportSeeds.map((item) => ({
  source: "Pipeline externo",
  ...item
}));

export const favoriteCollections = [
  {
    slug: "observacoes-premium",
    title: "Observacoes premium",
    text: "Selecao de atletas com perfil para aprovacao imediata e abordagem futura.",
    priority: "Alta",
    objective: "Separar nomes com potencial de decisao tecnica e retorno de mercado.",
    owner: "Scout lider",
    nextAction: "Transformar em relatorio executivo e shortlist",
    items: ["Jogadores acima de 90", "Criadores e atacantes de ruptura", "Nomes para relatorio executivo"],
    relatedProfiles: ["/jogadores/estevao", "/jogadores/neymar"]
  },
  {
    slug: "jogos-para-rever",
    title: "Jogos para rever",
    text: "Partidas ideais para coletar mais leitura tatica e comportamento sem bola.",
    priority: "Media",
    objective: "Aprofundar a observacao em cenarios de pressao e variacao tatico-posicional.",
    owner: "Analise de desempenho",
    nextAction: "Selecionar novos recortes em video e revisao tatico-posicional",
    items: ["Confrontos diretos", "Jogos fora de casa", "Partidas contra bloco baixo"],
    relatedProfiles: ["/times/fortaleza", "/times/palmeiras"]
  },
  {
    slug: "clubs-radar",
    title: "Clubs radar",
    text: "Equipes com tendencia de revelar talentos e gerar oportunidades de mercado.",
    priority: "Alta",
    objective: "Manter atencao continua em contextos que produzem atletas negociaveis.",
    owner: "Coordenacao de scouting",
    nextAction: "Atualizar clube-alvo por janela de mercado",
    items: ["Clubes de base forte", "Elencos em renovacao", "Projetos com valorizacao rapida"],
    relatedProfiles: ["/times/santos", "/times/flamengo"]
  }
];

export const fallbackStandingsByLeague = {
  "eng.1": {
    name: "English Premier League",
    abbreviation: "Prem",
    teams: [
      ["Liverpool", "LIV", 84, 38, 25, 9, 4, 86, 41],
      ["Arsenal", "ARS", 82, 38, 24, 10, 4, 81, 39],
      ["Manchester City", "MCI", 79, 38, 24, 7, 7, 87, 43],
      ["Aston Villa", "AVL", 68, 38, 20, 8, 10, 71, 58],
      ["Tottenham", "TOT", 66, 38, 19, 9, 10, 74, 61],
      ["Chelsea", "CHE", 63, 38, 18, 9, 11, 69, 57],
      ["Newcastle", "NEW", 60, 38, 17, 9, 12, 72, 62],
      ["Manchester United", "MUN", 58, 38, 17, 7, 14, 57, 58]
    ]
  },
  "esp.1": {
    name: "La Liga",
    abbreviation: "LL",
    teams: [
      ["Real Madrid", "RMA", 90, 38, 28, 6, 4, 83, 28],
      ["Barcelona", "BAR", 82, 38, 25, 7, 6, 79, 35],
      ["Girona", "GIR", 74, 38, 22, 8, 8, 77, 46],
      ["Atletico de Madrid", "ATM", 72, 38, 22, 6, 10, 70, 43],
      ["Athletic Club", "ATH", 68, 38, 19, 11, 8, 61, 37],
      ["Real Sociedad", "RSO", 63, 38, 17, 12, 9, 54, 39]
    ]
  },
  "ita.1": {
    name: "Serie A",
    abbreviation: "Serie A",
    teams: [
      ["Internazionale", "INT", 94, 38, 29, 7, 2, 89, 25],
      ["Milan", "MIL", 79, 38, 24, 7, 7, 76, 42],
      ["Juventus", "JUV", 75, 38, 22, 9, 7, 58, 31],
      ["Atalanta", "ATA", 69, 38, 20, 9, 9, 71, 44],
      ["Bologna", "BOL", 67, 38, 18, 13, 7, 54, 32],
      ["Roma", "ROM", 64, 38, 18, 10, 10, 65, 46]
    ]
  },
  "ger.1": {
    name: "Bundesliga",
    abbreviation: "Bund",
    teams: [
      ["Bayer Leverkusen", "B04", 90, 34, 28, 6, 0, 89, 24],
      ["Bayern Munich", "FCB", 78, 34, 24, 6, 4, 91, 39],
      ["Stuttgart", "VFB", 73, 34, 23, 4, 7, 78, 39],
      ["RB Leipzig", "RBL", 65, 34, 19, 8, 7, 69, 39],
      ["Borussia Dortmund", "BVB", 63, 34, 18, 9, 7, 68, 43],
      ["Eintracht Frankfurt", "SGE", 52, 34, 13, 13, 8, 52, 44]
    ]
  },
  "fra.1": {
    name: "Ligue 1",
    abbreviation: "L1",
    teams: [
      ["Paris Saint-Germain", "PSG", 82, 34, 24, 10, 0, 81, 28],
      ["Monaco", "MON", 67, 34, 20, 7, 7, 68, 42],
      ["Brest", "BRE", 61, 34, 17, 10, 7, 52, 34],
      ["Lille", "LIL", 59, 34, 16, 11, 7, 50, 35],
      ["Nice", "NIC", 55, 34, 15, 10, 9, 40, 29],
      ["Lyon", "LYO", 53, 34, 15, 8, 11, 49, 39]
    ]
  },
  "bra.1": {
    name: "Brasileirao",
    abbreviation: "BRA",
    teams: [
      ["Palmeiras", "PAL", 74, 38, 22, 8, 8, 64, 33],
      ["Flamengo", "FLA", 70, 38, 21, 7, 10, 61, 37],
      ["Fortaleza", "FOR", 66, 38, 19, 9, 10, 52, 35],
      ["Sao Paulo", "SAO", 63, 38, 18, 9, 11, 48, 36],
      ["Botafogo", "BOT", 62, 38, 18, 8, 12, 55, 41],
      ["Santos", "SAN", 58, 38, 16, 10, 12, 46, 39],
      ["Vasco", "VAS", 53, 38, 15, 8, 15, 45, 49]
    ]
  }
};

export const dataSourceSummary = {
  provider: externalSourceMeta.provider,
  repository: externalSourceMeta.repository,
  status: externalSourceMeta.status,
  lastSyncLabel: externalSourceMeta.lastSyncLabel,
  slices: externalSourceMeta.slices
};

export function getTeamBySlug(slug) {
  return featuredTeams.find((team) => team.slug === slug) || null;
}

export function getPlayerBySlug(slug) {
  return spotlightPlayers.find((player) => player.slug === slug) || null;
}

export function getMarketReportBySlug(slug) {
  return marketReports.find((report) => report.slug === slug) || null;
}
