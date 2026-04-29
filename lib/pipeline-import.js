import { externalMarketReportSeeds, externalPlayerSeeds, externalTeamSeeds } from "@/lib/external-football-pipeline";
import { toSlug } from "@/lib/report-utils";

function asArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function asNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function asString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function normalizeRecentForm(form = []) {
  return asArray(form).map((item) => ({
    opponent: asString(item?.opponent, "Adversario"),
    score: asString(item?.score, "0-0"),
    result: asString(item?.result, "E"),
    venue: asString(item?.venue, "Casa")
  }));
}

function normalizeTeam(item = {}) {
  const name = asString(item.name, "Clube sem nome");

  return {
    slug: asString(item.slug, toSlug(name)),
    name,
    league: asString(item.league, "Liga nao informada"),
    rating: asNumber(item.rating, 70),
    coach: asString(item.coach, "Comissao nao informada"),
    system: asString(item.system, "4-3-3"),
    phase: asString(item.phase, "Contexto competitivo em observacao"),
    profile: asString(item.profile, "Perfil geral ainda nao detalhado."),
    style: asString(item.style, "Estilo de jogo nao informado."),
    moment: asString(item.moment, "Momento competitivo nao informado."),
    marketFocus: asString(item.marketFocus, "Foco de mercado nao informado."),
    reportSummary: asString(item.reportSummary, `Perfil operacional de ${name} para uso em scouting e mercado.`),
    strengths: asArray(item.strengths),
    risks: asArray(item.risks),
    squadNeeds: asArray(item.squadNeeds),
    opportunities: asArray(item.opportunities),
    metrics: {
      offensiveIndex: asNumber(item.metrics?.offensiveIndex, 70),
      defensiveIndex: asNumber(item.metrics?.defensiveIndex, 70),
      developmentIndex: asNumber(item.metrics?.developmentIndex, 70),
      consistencyIndex: asNumber(item.metrics?.consistencyIndex, 70)
    },
    recentForm: normalizeRecentForm(item.recentForm),
    homeAway: {
      home: asString(item.homeAway?.home, "Sem dado"),
      away: asString(item.homeAway?.away, "Sem dado")
    },
    streaks: asArray(item.streaks),
    advancedMetrics: {
      goalsPerMatch: asNumber(item.advancedMetrics?.goalsPerMatch),
      shotsOnTarget: asNumber(item.advancedMetrics?.shotsOnTarget),
      possession: asNumber(item.advancedMetrics?.possession),
      cleanSheetRate: asNumber(item.advancedMetrics?.cleanSheetRate)
    },
    topPerformers: asArray(item.topPerformers),
    probableLineup: {
      formation: asString(item.probableLineup?.formation, asString(item.system, "4-3-3")),
      starters: asArray(item.probableLineup?.starters),
      bench: asArray(item.probableLineup?.bench)
    },
    h2hFocus: {
      target: asString(item.h2hFocus?.target, "Sem alvo definido"),
      summary: asString(item.h2hFocus?.summary, "Sem leitura de H2H disponivel.")
    },
    discipline: {
      foulsPerMatch: asNumber(item.discipline?.foulsPerMatch),
      yellowCards: asNumber(item.discipline?.yellowCards),
      redCards: asNumber(item.discipline?.redCards)
    },
    setPieceProfile: {
      offensive: asString(item.setPieceProfile?.offensive, "Sem leitura ofensiva de bola parada."),
      defensive: asString(item.setPieceProfile?.defensive, "Sem leitura defensiva de bola parada.")
    },
    source: asString(item.source, "Importado via pipeline")
  };
}

function normalizePlayer(item = {}) {
  const name = asString(item.name, "Jogador sem nome");
  const club = asString(item.club, "Clube nao informado");

  return {
    slug: asString(item.slug, toSlug(name)),
    name,
    club,
    teamSlug: asString(item.teamSlug, toSlug(club)),
    role: asString(item.role, "Funcao nao informada"),
    rating: asNumber(item.rating, 70),
    age: asNumber(item.age, 20),
    foot: asString(item.foot, "Nao informado"),
    nationality: asString(item.nationality, "Nao informada"),
    height: asString(item.height, "Nao informada"),
    status: asString(item.status, "Em monitoramento"),
    contractStatus: asString(item.contractStatus, "Sem leitura contratual"),
    marketMoment: asString(item.marketMoment, "Sem leitura de mercado"),
    profile: asString(item.profile, "Perfil geral ainda nao detalhado."),
    summary: asString(item.summary, "Resumo de jogo nao informado."),
    reportSummary: asString(item.reportSummary, `Perfil operacional de ${name} para acompanhamento profissional.`),
    strengths: asArray(item.strengths),
    concerns: asArray(item.concerns),
    recommendations: asArray(item.recommendations),
    metrics: {
      technique: asNumber(item.metrics?.technique, 70),
      physical: asNumber(item.metrics?.physical, 70),
      tactical: asNumber(item.metrics?.tactical, 70),
      projection: asNumber(item.metrics?.projection, 70),
      decisionMaking: asNumber(item.metrics?.decisionMaking, 70)
    },
    seasonStats: {
      matches: asNumber(item.seasonStats?.matches),
      starts: asNumber(item.seasonStats?.starts),
      goals: asNumber(item.seasonStats?.goals),
      assists: asNumber(item.seasonStats?.assists),
      minutes: asNumber(item.seasonStats?.minutes),
      duelsWon: asNumber(item.seasonStats?.duelsWon),
      keyPasses: asNumber(item.seasonStats?.keyPasses)
    },
    trendRatings: asArray(item.trendRatings).map((entry) => asNumber(entry)),
    recentMatches: asArray(item.recentMatches),
    availability: {
      condition: asString(item.availability?.condition, "Nao informado"),
      load: asString(item.availability?.load, "Nao informado"),
      note: asString(item.availability?.note, "Sem observacao de carga.")
    },
    roleProfile: asArray(item.roleProfile),
    comparisonProfiles: asArray(item.comparisonProfiles),
    shotProfile: {
      shots: asNumber(item.shotProfile?.shots),
      onTarget: asNumber(item.shotProfile?.onTarget),
      touchesInBox: asNumber(item.shotProfile?.touchesInBox)
    },
    source: asString(item.source, "Importado via pipeline")
  };
}

function normalizeReport(item = {}) {
  const subject = asString(item.subject, "Relatorio sem assunto");

  return {
    slug: asString(item.slug, toSlug(subject)),
    title: asString(item.title, `Relatorio | ${subject}`),
    subject,
    club: asString(item.club, "Clube nao informado"),
    type: asString(item.type, "relatorio"),
    status: asString(item.status, "Em avaliacao"),
    rating: asNumber(item.rating, 70),
    profileType: asString(item.profileType, "Perfil nao informado"),
    horizon: asString(item.horizon, "Curto prazo"),
    marketWindow: asString(item.marketWindow, "Janela nao informada"),
    executiveSummary: asString(item.executiveSummary, `Resumo executivo de ${subject}.`),
    strengths: asArray(item.strengths),
    risks: asArray(item.risks),
    recommendations: asArray(item.recommendations),
    reportBody: asArray(item.reportBody),
    relatedProfiles: asArray(item.relatedProfiles),
    source: asString(item.source, "Importado via pipeline")
  };
}

export function getImportTemplate() {
  return {
    meta: {
      provider: "custom-dump",
      generatedAt: "2026-04-29",
      notes: "Preencha teams, players e reports seguindo a estrutura abaixo."
    },
    teams: [normalizeTeam(externalTeamSeeds[0])],
    players: [normalizePlayer(externalPlayerSeeds[0])],
    reports: [normalizeReport(externalMarketReportSeeds[0])]
  };
}

export function normalizeImportPayload(payload = {}) {
  return {
    meta: payload.meta || {},
    teams: asArray(payload.teams).map(normalizeTeam),
    players: asArray(payload.players).map(normalizePlayer),
    reports: asArray(payload.reports).map(normalizeReport)
  };
}

export function buildImportPreview(payload = {}) {
  const normalized = normalizeImportPayload(payload);

  return {
    summary: {
      teams: normalized.teams.length,
      players: normalized.players.length,
      reports: normalized.reports.length
    },
    sample: {
      team: normalized.teams[0] || null,
      player: normalized.players[0] || null,
      report: normalized.reports[0] || null
    },
    normalized
  };
}
