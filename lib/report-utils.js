import { featuredTeams, spotlightPlayers } from "@/lib/football-data";
import { buildGeneratedPlayerProfile, buildGeneratedTeamProfile } from "@/lib/generated-profiles";
import { buildCompetitionSearchEntries } from "@/lib/monitoring-data";

export const SEARCH_TYPE_ORDER = ["Time", "Jogador", "Competicao"];

function normalizeSearchSource(source) {
  if (["API-Football", "football-data.org", "TheSportsDB", "LiveScore opcional"].includes(source)) {
    return source;
  }

  return "Base local";
}

export function toSlug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseListField(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function matchTeamProfileByName(clubName) {
  const slug = toSlug(clubName);
  return featuredTeams.find((team) => team.slug === slug || toSlug(team.name) === slug) || null;
}

export function matchPlayerProfileByName(playerName) {
  const slug = toSlug(playerName);
  return spotlightPlayers.find((player) => player.slug === slug || toSlug(player.name) === slug) || null;
}

function buildRelatedProfiles(item, playerProfile, teamProfile) {
  const links = [];

  if (playerProfile?.slug) {
    links.push(`/jogadores/${playerProfile.slug}`);
  }

  if (teamProfile?.slug) {
    links.push(`/times/${teamProfile.slug}`);
  }

  if (item.objectId) {
    links.push(`/scouting?report=${item.objectId}`);
  }

  return [...new Set(links)];
}

export function buildScoutingReport(item) {
  const playerProfile = matchPlayerProfileByName(item.playerName);
  const teamProfile = matchTeamProfileByName(item.club);
  const strengths = parseListField(item.strengths);
  const risks = parseListField(item.risks);

  return {
    id: item.objectId,
    objectId: item.objectId,
    updatedAt: item.updatedAt,
    playerName: item.playerName,
    club: item.club,
    position: item.position,
    rating: Number(item.rating || 0),
    status: item.status || "Em observacao",
    priority: item.priority || (Number(item.rating || 0) >= 88 ? "Alta" : "Media"),
    recommendation:
      item.recommendation || (Number(item.rating || 0) >= 85 ? "Avancar para shortlist" : "Manter em observacao"),
    nextAction:
      item.nextAction || "Atualizar recorte em video, validar contexto competitivo e revisar com coordenacao.",
    isFavorite: Boolean(item.isFavorite),
    summary:
      item.reportSummary ||
      playerProfile?.reportSummary ||
      `Observacao profissional de ${item.playerName} para tomada de decisao tecnica e acompanhamento de mercado.`,
    strengths: strengths.length > 0 ? strengths : playerProfile?.strengths || ["Sem pontos fortes detalhados."],
    risks: risks.length > 0 ? risks : playerProfile?.concerns || ["Sem riscos registrados."],
    notes: item.notes || "Sem observacoes complementares.",
    playerProfile,
    teamProfile,
    relatedProfiles: buildRelatedProfiles(item, playerProfile, teamProfile)
  };
}

export function buildFavoriteCollectionsFromScouting(items = []) {
  const reports = items.map(buildScoutingReport);
  const shortlist = reports
    .filter((item) => item.isFavorite || item.status === "Aprovado" || item.rating >= 88)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const observationQueue = reports
    .filter((item) => item.status === "Em observacao")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const clubMap = new Map();

  reports.forEach((item) => {
    const current = clubMap.get(item.club) || { club: item.club, count: 0, topRating: 0, teamProfile: item.teamProfile };
    current.count += 1;
    current.topRating = Math.max(current.topRating, item.rating);
    clubMap.set(item.club, current);
  });

  const clubRadar = [...clubMap.values()]
    .sort((a, b) => b.count - a.count || b.topRating - a.topRating)
    .slice(0, 5);

  return [
    {
      slug: "shortlist-executiva",
      title: "Shortlist executiva",
      text: "Relatorios prontos para decisao com melhor combinacao de nota, prioridade e aderencia de mercado.",
      priority: "Alta",
      objective: "Separar atletas aptos para apresentacao a coordenacao tecnica.",
      owner: "Lider de scouting",
      nextAction: "Validar contexto competitivo e gerar relatorio final.",
      items:
        shortlist.length > 0
          ? shortlist.map((item) => `${item.playerName} | ${item.club} | ${item.rating} pts | ${item.recommendation}`)
          : ["Nenhum atleta entrou na shortlist real ainda."],
      relatedProfiles: shortlist.flatMap((item) => item.relatedProfiles).slice(0, 6)
    },
    {
      slug: "fila-de-observacao",
      title: "Fila de observacao",
      text: "Atletas que ainda precisam de mais jogo, mais video e melhor leitura de contexto.",
      priority: "Media",
      objective: "Manter cadencia de revisao para nao perder timing de avaliacao.",
      owner: "Analise e monitoramento",
      nextAction: "Agendar nova janela de revisao para os nomes ativos.",
      items:
        observationQueue.length > 0
          ? observationQueue.map((item) => `${item.playerName} | ${item.position} | ${item.nextAction}`)
          : ["Sem atletas pendentes de observacao neste momento."],
      relatedProfiles: observationQueue.flatMap((item) => item.relatedProfiles).slice(0, 6)
    },
    {
      slug: "radar-de-clubes",
      title: "Radar de clubes",
      text: "Concentracao real de observacoes por clube para orientar alocacao de atencao e agenda de acompanhamento.",
      priority: "Alta",
      objective: "Entender onde estao os contextos mais produtivos de monitoramento.",
      owner: "Coordenacao de scouting",
      nextAction: "Distribuir cobertura por clube e priorizar ambientes com mais ativos.",
      items:
        clubRadar.length > 0
          ? clubRadar.map((item) => `${item.club} | ${item.count} relatorios | topo ${item.topRating} pts`)
          : ["Sem clubes com observacoes reais ainda."],
      relatedProfiles: clubRadar
        .filter((item) => item.teamProfile?.slug)
        .map((item) => `/times/${item.teamProfile.slug}`)
        .slice(0, 6)
    }
  ];
}

function buildStaticSearchIndex() {
  const teamEntries = featuredTeams.map((team) => ({
    id: `team-${team.slug}`,
    type: "Time",
    source: normalizeSearchSource(team.source),
    title: team.name,
    subtitle: `${team.league} | ${team.phase}`,
    description: team.reportSummary,
    href: `/times/${team.slug}`
  }));

  const playerEntries = spotlightPlayers.map((player) => ({
    id: `player-${player.slug}`,
    type: "Jogador",
    source: normalizeSearchSource(player.source),
    title: player.name,
    subtitle: `${player.club} | ${player.role}`,
    description: player.reportSummary,
    href: `/jogadores/${player.slug}`
  }));

  const competitionEntries = buildCompetitionSearchEntries();

  return [...teamEntries, ...playerEntries, ...competitionEntries];
}

export function buildSearchIndex() {
  return buildStaticSearchIndex();
}

export function searchEntries(index, query = "") {
  const normalizedQuery = toSlug(query).replace(/-/g, " ");

  if (!normalizedQuery.trim()) {
    return [];
  }

  return index
    .map((entry) => {
      const title = String(entry.title || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const haystack = `${entry.type} ${entry.source} ${entry.title} ${entry.subtitle} ${entry.description}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

      if (!haystack.includes(normalizedQuery)) {
        return null;
      }

      const typeWeight = SEARCH_TYPE_ORDER.indexOf(entry.type);
      const normalizedTypeWeight = typeWeight === -1 ? SEARCH_TYPE_ORDER.length : typeWeight;
      const score = title === normalizedQuery ? 0 : title.startsWith(normalizedQuery) ? 1 : 2;

      return {
        ...entry,
        score,
        typeWeight: normalizedTypeWeight
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.typeWeight - b.typeWeight || a.score - b.score || a.title.localeCompare(b.title))
    .map(({ score: _score, typeWeight: _typeWeight, ...entry }) => entry);
}

export function buildGeneratedSearchEntries(query, existingResults = []) {
  const normalized = toSlug(query);

  if (!normalized) {
    return [];
  }

  const looksLikePlayer = String(query).trim().includes(" ");
  const hasTeam = existingResults.some((item) => item.type === "Time");
  const hasPlayer = existingResults.some((item) => item.type === "Jogador");
  const generatedEntries = [];

  if (!hasTeam && !looksLikePlayer) {
    const team = buildGeneratedTeamProfile(query);
      generatedEntries.push({
        id: `generated-team-${team.slug}`,
        type: "Time",
        source: "Base local",
      title: team.name,
      subtitle: `${team.league} | ${team.phase}`,
      description: team.reportSummary,
      href: `/times/${team.slug}`
    });
  }

  if (!hasPlayer && looksLikePlayer) {
    const player = buildGeneratedPlayerProfile(query);
    generatedEntries.push({
      id: `generated-player-${player.slug}`,
      type: "Jogador",
      source: "Base local",
      title: player.name,
      subtitle: `${player.club} | ${player.role}`,
      description: player.reportSummary,
      href: `/jogadores/${player.slug}`
    });
  }

  return generatedEntries;
}
