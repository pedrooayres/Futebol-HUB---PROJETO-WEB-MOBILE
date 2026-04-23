export const featuredTeams = [
  {
    name: "Santos",
    league: "Brasil",
    rating: 84,
    profile: "Tradicao, base forte e alto potencial de narrativa para scouting.",
    style: "Bloco tecnico com saida curta e peso historico.",
    moment: "Reconstrucao com foco em protagonismo da base.",
    marketFocus: "Jovens ofensivos e meias de criacao.",
    strengths: ["Talento individual", "Conexao com a base", "Capacidade de acelerar transicoes"],
    metrics: {
      offensiveIndex: 81,
      defensiveIndex: 72,
      developmentIndex: 91
    }
  },
  {
    name: "Palmeiras",
    league: "Brasil",
    rating: 92,
    profile: "Elenco equilibrado e maturidade competitiva em jogos grandes.",
    style: "Intensidade sem bola e transicao muito agressiva.",
    moment: "Clube de referencia em consistencia e vendas de alto nivel.",
    marketFocus: "Atletas com teto alto e polivalencia tatico-fisica.",
    strengths: ["Competitividade", "Estrutura", "Formacao e valorizacao"],
    metrics: {
      offensiveIndex: 88,
      defensiveIndex: 89,
      developmentIndex: 94
    }
  },
  {
    name: "Flamengo",
    league: "Brasil",
    rating: 90,
    profile: "Volume ofensivo, nomes conhecidos e forte atracao de audiencia.",
    style: "Dominio territorial e criacao entrelinhas.",
    moment: "Pressao por performance imediata e elenco de alta exposicao.",
    marketFocus: "Jogadores prontos para impacto tecnico imediato.",
    strengths: ["Criacao", "Profundidade de elenco", "Peso ofensivo"],
    metrics: {
      offensiveIndex: 93,
      defensiveIndex: 78,
      developmentIndex: 82
    }
  },
  {
    name: "Fortaleza",
    league: "Brasil",
    rating: 86,
    profile: "Organizacao coletiva e consistencia recente em competicoes nacionais.",
    style: "Jogo vertical com boa ocupacao dos corredores.",
    moment: "Projeto competitivo com identidade e leitura coletiva forte.",
    marketFocus: "Atletas funcionais para intensidade e disciplina tatico-posicional.",
    strengths: ["Coletivo", "Verticalidade", "Regularidade"],
    metrics: {
      offensiveIndex: 79,
      defensiveIndex: 84,
      developmentIndex: 76
    }
  }
];

export const spotlightPlayers = [
  {
    name: "Estevao",
    club: "Palmeiras",
    role: "Ponta",
    rating: 92,
    age: 17,
    foot: "Canhoto",
    status: "Prioridade alta",
    summary: "Explosao, drible curto e decisao acelerada no ultimo terco.",
    profile: "Atacante de 1x1 com aceleração e desequilibrio.",
    strengths: ["Ruptura", "Conducao agressiva", "Finalizacao curta"],
    metrics: {
      technique: 93,
      physical: 79,
      tactical: 82,
      projection: 97
    }
  },
  {
    name: "Neymar",
    club: "Santos",
    role: "Meia",
    rating: 96,
    age: 34,
    foot: "Destro",
    status: "Observacao premium",
    summary: "Criatividade, passe de ruptura e alta leitura de espacos.",
    profile: "Criador com capacidade de controlar ritmo e gerar vantagem tecnica.",
    strengths: ["Passe final", "Improviso", "Aceleracao mental"],
    metrics: {
      technique: 97,
      physical: 72,
      tactical: 94,
      projection: 85
    }
  },
  {
    name: "Pedro",
    club: "Flamengo",
    role: "Centroavante",
    rating: 89,
    age: 29,
    foot: "Destro",
    status: "Aprovado",
    summary: "Finalizacao refinada e sustentacao ofensiva de costas.",
    profile: "Referencia tecnica para area, pivô e definicao.",
    strengths: ["Area", "Finalizacao", "Jogo apoiado"],
    metrics: {
      technique: 90,
      physical: 81,
      tactical: 87,
      projection: 80
    }
  },
  {
    name: "Lucero",
    club: "Fortaleza",
    role: "Atacante",
    rating: 84,
    age: 34,
    foot: "Destro",
    status: "Monitorado",
    summary: "Ataque a area com constancia e boa relacao com o gol.",
    profile: "Finalizador de zona critica com leitura boa de ocupacao.",
    strengths: ["Movimento de area", "Definicao", "Regularidade"],
    metrics: {
      technique: 82,
      physical: 76,
      tactical: 85,
      projection: 74
    }
  }
];

export const favoriteCollections = [
  {
    title: "Observacoes premium",
    text: "Selecao de atletas com perfil para aprovacao imediata e abordagem futura.",
    priority: "Alta",
    objective: "Separar nomes com potencial de decisao tecnica e retorno de mercado.",
    items: ["Jogadores acima de 90", "Criadores e atacantes de ruptura", "Nomes para relatorio executivo"]
  },
  {
    title: "Jogos para rever",
    text: "Partidas ideais para coletar mais leitura tatica e comportamento sem bola.",
    priority: "Media",
    objective: "Aprofundar a observacao em cenarios de pressao e variacao tatico-posicional.",
    items: ["Confrontos diretos", "Jogos fora de casa", "Partidas contra bloco baixo"]
  },
  {
    title: "Clubs radar",
    text: "Equipes com tendencia de revelar talentos e gerar oportunidades de mercado.",
    priority: "Alta",
    objective: "Manter atencao continua em contextos que produzem atletas negociaveis.",
    items: ["Clubes de base forte", "Elencos em renovacao", "Projetos com valorizacao rapida"]
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
      ["Santos", "SAN", 58, 38, 16, 10, 12, 46, 39]
    ]
  }
};
