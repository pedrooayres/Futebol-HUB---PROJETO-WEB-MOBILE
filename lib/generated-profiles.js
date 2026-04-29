import { toSlug } from "@/lib/report-utils";

function toTitle(value = "") {
  return String(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inferPlayerRole(name) {
  const normalized = name.toLowerCase();

  if (normalized.includes("keeper") || normalized.includes("goleiro")) {
    return "Goleiro";
  }

  return "Atleta em monitoramento";
}

export function buildGeneratedTeamProfile(input) {
  const slug = toSlug(input);
  const name = toTitle(slug || input);

  return {
    slug,
    name,
    source: "Perfil inicial gerado",
    league: "Radar global",
    rating: 74,
    coach: "Comissao nao confirmada",
    system: "4-3-3",
    phase: "Mapeamento inicial",
    profile: `Perfil base gerado automaticamente para ${name}, ainda sem dump estatistico consolidado no pipeline.`,
    style: "Leitura inicial aberta, aguardando recorte de jogos, forma recente e contexto competitivo.",
    moment: "Clube detectado pela busca, em fase de entrada no radar do produto.",
    marketFocus: "Mapeamento inicial de elenco, forma e oportunidades de monitoramento.",
    reportSummary: `Perfil inicial de ${name} gerado pela busca para garantir cobertura imediata antes da importacao completa de dados.`,
    strengths: ["Cobertura imediata de busca", "Entrada automatica no radar", "Pronto para enriquecimento posterior"],
    risks: ["Dados ainda nao confirmados", "Sem estatistica de fonte externa consolidada", "Leitura ainda introdutoria"],
    squadNeeds: ["Validar elenco atual", "Importar forma recente", "Conectar lineup e H2H"],
    opportunities: [
      "Gerar ficha base instantanea",
      "Permitir navegacao antes da importacao final",
      "Priorizar futura ingestao por interesse do usuario"
    ],
    metrics: {
      offensiveIndex: 68,
      defensiveIndex: 68,
      developmentIndex: 72,
      consistencyIndex: 64
    },
    recentForm: [
      { opponent: "A definir", score: "0-0", result: "E", venue: "Radar" },
      { opponent: "A definir", score: "0-0", result: "E", venue: "Radar" },
      { opponent: "A definir", score: "0-0", result: "E", venue: "Radar" }
    ],
    homeAway: {
      home: "Sem amostra",
      away: "Sem amostra"
    },
    streaks: [
      "Perfil gerado automaticamente a partir da busca",
      "Aguardando ingestao externa para enriquecer forma e sequencias",
      "Clube adicionado ao radar do produto"
    ],
    advancedMetrics: {
      goalsPerMatch: 0,
      shotsOnTarget: 0,
      possession: 0,
      cleanSheetRate: 0
    },
    topPerformers: ["Sem destaques confirmados ainda", "Pipeline externo pendente", "Scouting manual recomendado"],
    probableLineup: {
      formation: "4-3-3",
      starters: ["A definir", "A definir", "A definir", "A definir", "A definir", "A definir", "A definir", "A definir", "A definir", "A definir", "A definir"],
      bench: ["Sem banco mapeado"]
    },
    h2hFocus: {
      target: "Sem alvo definido",
      summary: "H2H sera preenchido quando o pipeline externo trouxer adversarios, confrontos e contexto de partida."
    },
    discipline: {
      foulsPerMatch: 0,
      yellowCards: 0,
      redCards: 0
    },
    setPieceProfile: {
      offensive: "Sem leitura de bola parada ainda.",
      defensive: "Sem leitura defensiva de bola parada ainda."
    }
  };
}

export function buildGeneratedPlayerProfile(input) {
  const slug = toSlug(input);
  const name = toTitle(slug || input);

  return {
    slug,
    name,
    source: "Perfil inicial gerado",
    club: "Clube nao confirmado",
    teamSlug: "clube-nao-confirmado",
    role: inferPlayerRole(name),
    rating: 73,
    age: 23,
    foot: "Nao informado",
    nationality: "Nao informada",
    height: "Nao informada",
    status: "Radar inicial",
    contractStatus: "Sem leitura contratual",
    marketMoment: "Aguardando importacao externa",
    profile: `Perfil inicial gerado automaticamente para ${name}, com foco em cobertura imediata da busca.`,
    summary: "Ainda sem dump estatistico consolidado, mas ja disponivel para navegacao e futura ampliacao automatica.",
    reportSummary: `Ficha inicial de ${name} gerada pela busca para nao depender apenas da base previamente salva.`,
    strengths: ["Cobertura automatica de busca", "Pronto para enriquecimento posterior", "Entrada imediata no radar"],
    concerns: ["Sem estatistica consolidada", "Clube e contexto ainda nao confirmados", "Leitura apenas introdutoria"],
    recommendations: [
      "Importar estatisticas por fonte externa",
      "Validar clube, posicao e forma recente",
      "Gerar relatorio automatico quando o pipeline completar os dados"
    ],
    metrics: {
      technique: 70,
      physical: 70,
      tactical: 70,
      projection: 74,
      decisionMaking: 69
    },
    seasonStats: {
      matches: 0,
      starts: 0,
      goals: 0,
      assists: 0,
      minutes: 0,
      duelsWon: 0,
      keyPasses: 0
    },
    trendRatings: [0, 0, 0],
    recentMatches: [
      "Sem jogos importados ainda",
      "Aguardando pipeline externo",
      "Pode ser enriquecido por scouting manual"
    ],
    availability: {
      condition: "Nao informada",
      load: "Nao informada",
      note: "Status fisico e carga competitiva serao atualizados apos ingestao de dados."
    },
    roleProfile: [
      "Perfil inicial gerado pela busca",
      "Funcao tatico-tecnica ainda nao confirmada",
      "Aguardando enriquecimento por dados externos"
    ],
    comparisonProfiles: ["Sem comparacoes validadas"],
    shotProfile: {
      shots: 0,
      onTarget: 0,
      touchesInBox: 0
    }
  };
}
