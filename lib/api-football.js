import { fetchJson } from "@/lib/http-client";

const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export const API_FOOTBALL_LEAGUES = [
  { appId: "bra.1", apiId: 71, label: "Brasileirao Serie A", country: "Brazil", season: "2026", type: "League", search: "Serie A", providerHint: "livescore-api", competitionId: 24, externalUrl: "https://live-score-api.com/leagues/league/24/Brazil?competition_id=24" },
  { appId: "bra.2", apiId: 72, label: "Brasileirao Serie B", country: "Brazil", season: "2026", type: "League", search: "Serie B", providerHint: "livescore-api", competitionId: 95 },
  { appId: "bra.3", apiId: null, label: "Brasileirao Serie C", country: "Brazil", season: "2026", type: "League", search: "Serie C", providerHint: "livescore-api", competitionId: 253 },
  { appId: "bra.4", apiId: null, label: "Brasileirao Serie D", country: "Brazil", season: "2026", type: "League", search: "Serie D", providerHint: "livescore-api", competitionId: 254 },
  { appId: "eng.1", apiId: 39, label: "Premier League", country: "England", season: "2025", type: "League", search: "Premier League", providerHint: "livescore-api", competitionId: 2, externalUrl: "https://live-score-api.com/leagues/league/2/England?competition_id=2" },
  { appId: "eng.2", apiId: 40, label: "EFL Championship", country: "England", season: "2025", type: "League", search: "Championship", providerHint: "livescore-api", competitionId: 77 },
  { appId: "esp.1", apiId: 140, label: "LaLiga", country: "Spain", season: "2025", type: "League", search: "La Liga", providerHint: "livescore-api", competitionId: 3 },
  { appId: "fra.1", apiId: 61, label: "Ligue 1", country: "France", season: "2025", type: "League", search: "Ligue 1", providerHint: "livescore-api", competitionId: 5 },
  { appId: "ita.1", apiId: 135, label: "Serie A Italia", country: "Italy", season: "2025", type: "League", search: "Serie A", providerHint: "livescore-api", competitionId: 4 },
  { appId: "ger.1", apiId: 78, label: "Bundesliga", country: "Germany", season: "2025", type: "League", search: "Bundesliga", providerHint: "livescore-api", competitionId: 1 },
  { appId: "por.1", apiId: 94, label: "Liga Portugal", country: "Portugal", season: "2025", type: "League", search: "Primeira Liga" },
  { appId: "sau.1", apiId: 307, label: "Liga Saudita", country: "Saudi-Arabia", season: "2025", type: "League", search: "Pro League", providerHint: "thesportsdb", externalUrl: "https://www.thesportsdb.com/league/4668-saudi-arabian-pro-league" },
  { appId: "ned.1", apiId: null, label: "Liga Holandesa", country: "Netherlands", season: "2025", type: "League", search: "Eredivisie", providerHint: "livescore-api", competitionId: 196 },
  { appId: "tur.1", apiId: null, label: "Liga Turca", country: "Turkey", season: "2025", type: "League", search: "Super Lig", providerHint: "livescore-api", competitionId: 6 },
  { appId: "ucl", apiId: 2, label: "Champions League", country: "World", season: "2025", type: "Cup", search: "UEFA Champions League", providerHint: "livescore-api", competitionId: 244, externalUrl: "https://live-score-api.com/leagues/uefa-champions-league" },
  { appId: "uel", apiId: 3, label: "Europa League", country: "World", season: "2025", type: "Cup", search: "UEFA Europa League", providerHint: "livescore-api", competitionId: 245, externalUrl: "https://live-score-api.com/leagues/uefa-europa-league" },
  { appId: "uecl", apiId: 848, label: "Conference League", country: "World", season: "2025", type: "Cup", search: "UEFA Europa Conference League", providerHint: "livescore-api", competitionId: 446, externalUrl: "https://live-score-api.com/leagues/league/2-f/UEFA?competition_id=446" },
  { appId: "uefa-super-cup", apiId: null, label: "Supercopa da UEFA", country: "World", season: "2025", type: "Cup", search: "Super Cup", providerHint: "livescore-api", competitionId: 349 },
  { appId: "libertadores", apiId: 13, label: "Libertadores", country: "World", season: "2026", type: "Cup", search: "CONMEBOL Libertadores", providerHint: "livescore-api", competitionId: 329, externalUrl: "https://live-score-api.com/leagues/league/6-f/CONMEBOL?competition_id=329" },
  { appId: "sudamericana", apiId: 11, label: "Sul-Americana", country: "World", season: "2026", type: "Cup", search: "CONMEBOL Sudamericana", providerHint: "livescore-api", competitionId: 330 },
  { appId: "recopa-sudamericana", apiId: null, label: "Recopa Sul-Americana", country: "World", season: "2026", type: "Cup", search: "Recopa Sudamericana", providerHint: "livescore-api", competitionId: 331 },
  { appId: "copa-do-brasil", apiId: 73, label: "Copa do Brasil", country: "Brazil", season: "2026", type: "Cup", search: "Copa do Brasil", providerHint: "livescore-api", competitionId: 256, externalUrl: "https://live-score-api.com/leagues/league/256/Brazil?competition_id=256" },
  { appId: "copa-do-nordeste", apiId: null, label: "Copa do Nordeste", country: "Brazil", season: "2026", type: "Cup", search: "Copa do Nordeste", providerHint: "livescore-api", competitionId: 461 },
  { appId: "baiano", apiId: null, label: "Baiano", country: "Brazil", season: "2026", type: "League", search: "Baiano", providerHint: "livescore-api", competitionId: 440 },
  { appId: "carioca", apiId: null, label: "Carioca", country: "Brazil", season: "2026", type: "League", search: "Carioca", providerHint: "livescore-api", competitionId: 423 },
  { appId: "catarinense", apiId: null, label: "Catarinense", country: "Brazil", season: "2026", type: "League", search: "Catarinense", providerHint: "livescore-api", competitionId: 519 },
  { appId: "cearense", apiId: null, label: "Cearense", country: "Brazil", season: "2026", type: "League", search: "Cearense", providerHint: "livescore-api", competitionId: 441 },
  { appId: "gaucho", apiId: null, label: "Gaucho", country: "Brazil", season: "2026", type: "League", search: "Gaucho", providerHint: "livescore-api", competitionId: 430 },
  { appId: "goiano", apiId: null, label: "Goiano", country: "Brazil", season: "2026", type: "League", search: "Goiano", providerHint: "livescore-api", competitionId: 438 },
  { appId: "mineiro-1", apiId: null, label: "Mineiro 1", country: "Brazil", season: "2026", type: "League", search: "Mineiro", providerHint: "livescore-api", competitionId: 425 },
  { appId: "paranaense", apiId: null, label: "Paranaense", country: "Brazil", season: "2026", type: "League", search: "Paranaense", providerHint: "livescore-api", competitionId: 444 },
  { appId: "paulista-a1", apiId: null, label: "Paulista A1", country: "Brazil", season: "2026", type: "League", search: "Paulista", providerHint: "livescore-api", competitionId: 255 },
  { appId: "pernambucano-a1", apiId: null, label: "Pernambucano A1", country: "Brazil", season: "2026", type: "League", search: "Pernambucano", providerHint: "livescore-api", competitionId: 422 },
  { appId: "copa-del-rey", apiId: 143, label: "Copa do Rei", country: "Spain", season: "2025", type: "Cup", search: "Copa del Rey", providerHint: "livescore-api", competitionId: 334 },
  { appId: "supercopa-espanha", apiId: null, label: "Supercopa da Espanha", country: "Spain", season: "2025", type: "Cup", search: "Super Cup", providerHint: "livescore-api", competitionId: 333 },
  { appId: "fa-cup", apiId: 45, label: "FA Cup", country: "England", season: "2025", type: "Cup", search: "FA Cup", providerHint: "livescore-api", competitionId: 152 },
  { appId: "carabao-cup", apiId: 48, label: "Carabao Cup", country: "England", season: "2025", type: "Cup", search: "League Cup", providerHint: "livescore-api", competitionId: 150 },
  { appId: "dfb-pokal", apiId: 81, label: "Copa da Alemanha", country: "Germany", season: "2025", type: "Cup", search: "DFB Pokal", providerHint: "livescore-api", competitionId: 167 },
  { appId: "campeonato-portugal", apiId: null, label: "Campeonato de Portugal", country: "Portugal", season: "2025", type: "League", search: "Campeonato de Portugal", providerHint: "livescore-api", competitionId: 214 },
  { appId: "taca-portugal", apiId: 97, label: "Copa de Portugal", country: "Portugal", season: "2025", type: "Cup", search: "Taca de Portugal", providerHint: "livescore-api", competitionId: 212 },
  { appId: "coupe-france", apiId: 66, label: "Copa da Franca", country: "France", season: "2025", type: "Cup", search: "Coupe de France", providerHint: "livescore-api", competitionId: 162 },
  { appId: "supercopa-brasil", apiId: null, label: "Super Cup Brasil", country: "Brazil", season: "2026", type: "Cup", search: "Supercopa do Brasil", providerHint: "livescore-api", competitionId: 493 },
  { appId: "community-shield", apiId: null, label: "Supercopa da Inglaterra", country: "England", season: "2025", type: "Cup", search: "Community Shield", providerHint: "livescore-api", competitionId: 149 },
  { appId: "dfl-supercup", apiId: null, label: "Supercopa da Alemanha", country: "Germany", season: "2025", type: "Cup", search: "Super Cup", providerHint: "livescore-api", competitionId: 169 },
  { appId: "knvb-beker", apiId: null, label: "Copa da Holanda", country: "Netherlands", season: "2025", type: "Cup", search: "KNVB Beker", providerHint: "livescore-api", competitionId: 198 },
  { appId: "tur.2", apiId: null, label: "1. Lig Turquia", country: "Turkey", season: "2025", type: "League", search: "1st Lig", providerHint: "livescore-api", competitionId: 344 },
  { appId: "turkiye-kupasi", apiId: null, label: "Copa da Turquia", country: "Turkey", season: "2025", type: "Cup", search: "Cup", providerHint: "livescore-api", competitionId: 347 },
  { appId: "coppa-italia", apiId: 179, label: "Coppa Italia", country: "Italy", season: "2025", type: "Cup", search: "Coppa Italia", providerHint: "livescore-api", competitionId: 179 },
  { appId: "supercoppa-italia", apiId: null, label: "Supercopa da Italia", country: "Italy", season: "2025", type: "Cup", search: "Super Cup", providerHint: "livescore-api", competitionId: 178 },
  { appId: "trophee-des-champions", apiId: null, label: "Supercopa da Franca", country: "France", season: "2025", type: "Cup", search: "Trophee des Champions", providerHint: "livescore-api", competitionId: 160 },
  { appId: "supertaca", apiId: null, label: "Super Taca de Portugal", country: "Portugal", season: "2025", type: "Cup", search: "Supertaca", providerHint: "livescore-api", competitionId: 211 },
  { appId: "world-cup", apiId: 1, label: "Copa do Mundo", country: "World", season: "2026", type: "Cup", search: "World Cup", providerHint: "livescore-api", competitionId: 362 },
  { appId: "copa-america", apiId: 9, label: "Copa America", country: "World", season: "2025", type: "Cup", search: "Copa America", providerHint: "livescore-api", competitionId: 271, externalUrl: "https://live-score-api.com/copa-america-api" },
  { appId: "arg.1", apiId: 128, label: "Liga Professional", country: "Argentina", season: "2026", type: "League", search: "Liga Profesional", providerHint: "livescore-api", competitionId: 23 },
  { appId: "copa-argentina", apiId: 130, label: "Copa Argentina", country: "Argentina", season: "2026", type: "Cup", search: "Copa Argentina", providerHint: "livescore-api", competitionId: 230 },
  { appId: "copa-de-la-superliga", apiId: null, label: "Copa de la Superliga", country: "Argentina", season: "2026", type: "Cup", search: "Copa de la Superliga", providerHint: "livescore-api", competitionId: 231 },
  { appId: "supercopa-argentina", apiId: null, label: "Super Cup Argentina", country: "Argentina", season: "2026", type: "Cup", search: "Supercopa Argentina", providerHint: "livescore-api", competitionId: 236 },
  { appId: "euro", apiId: 4, label: "Eurocopa", country: "World", season: "2025", type: "Cup", search: "Euro Championship", providerHint: "livescore-api", competitionId: 387, externalUrl: "https://live-score-api.com/uefa-euro-api" },
  { appId: "euro-qualifiers", apiId: null, label: "Eliminatorias da Euro", country: "World", season: "2025", type: "Cup", search: "UEFA EURO Qualification", providerHint: "livescore-api", competitionId: 274 },
  { appId: "uefa-nations-league", apiId: null, label: "UEFA Nations League", country: "World", season: "2025", type: "Cup", search: "UEFA Nations League", providerHint: "livescore-api", competitionId: 350 },
  { appId: "world-cup-uefa-qualifiers", apiId: null, label: "Eliminatorias UEFA da Copa", country: "World", season: "2026", type: "Cup", search: "World Cup UEFA Qualifiers", providerHint: "livescore-api", competitionId: 363 },
  { appId: "world-cup-conmebol-qualifiers", apiId: null, label: "Eliminatorias CONMEBOL da Copa", country: "World", season: "2026", type: "Cup", search: "World Cup CONMEBOL Qualifiers", providerHint: "livescore-api", competitionId: 361 },
  { appId: "fifa-confederations-cup", apiId: null, label: "Copa das Confederacoes", country: "World", season: "2025", type: "Cup", search: "FIFA Confederations Cup", providerHint: "livescore-api", competitionId: 270 },
  { appId: "club-world-cup", apiId: 15, label: "Mundial de Clubes", country: "World", season: "2025", type: "Cup", search: "Club World Cup", providerHint: "livescore-api", competitionId: 372 },
  { appId: "super-club-world-cup", apiId: 15, label: "Super Mundial de Clubes", country: "World", season: "2025", type: "Cup", search: "Club World Cup", providerHint: "livescore-api", competitionId: 372 }
];

const API_FOOTBALL_LEAGUE_MAP = Object.fromEntries(
  API_FOOTBALL_LEAGUES.map((item) => [item.appId, item])
);

function normalizeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function getPerformance(points, gamesPlayed) {
  if (!points || !gamesPlayed) {
    return 0;
  }

  return Number(((points / (gamesPlayed * 3)) * 100).toFixed(1));
}

function buildLeaders(rows) {
  const leaderBy = (selector, sort = "desc") =>
    [...rows]
      .filter((item) => typeof selector(item) === "number")
      .sort((a, b) => {
        const result = selector(a) - selector(b);
        return sort === "asc" ? result : -result;
      })[0] || null;

  return {
    tableLeader: leaderBy((item) => item.points),
    bestAttack: leaderBy((item) => item.goalsFor),
    bestDefense: leaderBy((item) => item.goalsAgainst, "asc"),
    mostWins: leaderBy((item) => item.wins)
  };
}

function buildCharts(rows) {
  return {
    points: rows.slice(0, 8).map((item) => ({
      id: item.id,
      label: item.shortName || item.name,
      value: item.points
    })),
    attack: [...rows]
      .sort((a, b) => b.goalsFor - a.goalsFor)
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        label: item.shortName || item.name,
        value: item.goalsFor
      })),
    defense: [...rows]
      .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
      .slice(0, 8)
      .map((item) => ({
        id: item.id,
        label: item.shortName || item.name,
        value: item.goalsAgainst
      }))
  };
}

function buildSummary(rows, leaders) {
  return {
    teams: rows.length,
    averagePoints:
      rows.length > 0
        ? Number((rows.reduce((sum, item) => sum + item.points, 0) / rows.length).toFixed(1))
        : 0,
    averageGoalsFor:
      rows.length > 0
        ? Number((rows.reduce((sum, item) => sum + item.goalsFor, 0) / rows.length).toFixed(1))
        : 0,
    maximumPoints: leaders.tableLeader?.points || 0
  };
}

export function hasApiFootballKey() {
  return Boolean(process.env.API_FOOTBALL_KEY);
}

export function hasLiveScoreConfig() {
  return Boolean(process.env.LIVESCORE_API_KEY && process.env.LIVESCORE_API_SECRET);
}

export function getApiFootballLeagueConfig(appLeagueId) {
  return API_FOOTBALL_LEAGUE_MAP[appLeagueId] || API_FOOTBALL_LEAGUE_MAP["eng.1"];
}

export function buildCompetitionSourceMeta(competition) {
  if (!competition) {
    return null;
  }

  const meta = {
    providerHint: competition.providerHint || "api-football",
    externalUrl: competition.externalUrl || "",
    competitionId: competition.competitionId || null
  };

  if (competition.providerHint === "livescore-api" && competition.competitionId) {
    meta.liveEndpointAvailable = hasLiveScoreConfig();
    meta.endpoint = competition.competitionId
      ? `/api/football/source/live?competitionId=${competition.competitionId}`
      : "";
    meta.supportsHistoricalStandings = true;
  }

  return meta;
}

async function resolveApiFootballLeague(leagueConfig, season) {
  if (leagueConfig.apiId) {
    return { ...leagueConfig, resolvedApiId: leagueConfig.apiId };
  }

  const data = await apiFootballRequest("/leagues", {
    search: leagueConfig.search,
    country: leagueConfig.country !== "World" ? leagueConfig.country : undefined,
    type: leagueConfig.type,
    season
  });

  const candidates = data.response || [];
  const candidate =
    candidates.find((item) => item.league?.name?.toLowerCase() === leagueConfig.label.toLowerCase()) ||
    candidates.find((item) => item.league?.name?.toLowerCase().includes(String(leagueConfig.search || "").toLowerCase())) ||
    candidates[0];

  if (!candidate?.league?.id) {
    throw new Error(`Competição não encontrada na API-Football: ${leagueConfig.label}.`);
  }

  return {
    ...leagueConfig,
    resolvedApiId: candidate.league.id,
    resolvedName: candidate.league.name
  };
}

export function inferAppLeagueId(value = "") {
  const normalized = String(value).toLowerCase();

  if (normalized.includes("brasil") || normalized.includes("brasileirao") || normalized.includes("brazil")) {
    return "bra.1";
  }

  if (normalized.includes("argentina") || normalized.includes("liga profesional") || normalized.includes("liga professional")) {
    return "arg.1";
  }

  if (normalized.includes("eng") || normalized.includes("premier")) {
    return "eng.1";
  }

  if (normalized.includes("spain") || normalized.includes("la liga")) {
    return "esp.1";
  }

  if (normalized.includes("ital") || normalized.includes("serie a")) {
    return "ita.1";
  }

  if (normalized.includes("germany") || normalized.includes("bundesliga")) {
    return "ger.1";
  }

  if (normalized.includes("france") || normalized.includes("ligue 1")) {
    return "fra.1";
  }

  return "eng.1";
}

function toSlug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pickBestTeamCandidate(candidates, name) {
  const normalized = String(name).trim().toLowerCase();
  const normalizedSlug = toSlug(name);

  return (
    candidates.find((item) => item.team?.name?.toLowerCase() === normalized) ||
    candidates.find((item) => toSlug(item.team?.name) === normalizedSlug) ||
    candidates.find((item) => item.team?.name?.toLowerCase().includes(normalized)) ||
    candidates[0] ||
    null
  );
}

function pickBestPlayerCandidate(candidates, name) {
  const normalized = String(name).trim().toLowerCase();
  const normalizedSlug = toSlug(name);

  return (
    candidates.find((item) => item.player?.name?.toLowerCase() === normalized) ||
    candidates.find((item) => toSlug(item.player?.name) === normalizedSlug) ||
    candidates.find((item) => item.player?.name?.toLowerCase().includes(normalized)) ||
    candidates[0] ||
    null
  );
}

export async function apiFootballRequest(pathname, searchParams = {}, options = {}) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("Camada de dados ao vivo ainda não configurada.");
  }

  const url = new URL(`${API_FOOTBALL_BASE_URL}${pathname}`);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const { response, data } = await fetchJson(url, {
    headers: {
      "x-apisports-key": apiKey
    },
    next: { revalidate: options.revalidate ?? 1800 }
  }, { timeoutMs: options.timeoutMs ?? 12000 });
  const hasErrors = Array.isArray(data.errors)
    ? data.errors.length > 0
    : Object.keys(data.errors || {}).length > 0;

  if (!response.ok || hasErrors) {
    const details = Array.isArray(data.errors)
      ? data.errors.join(", ")
      : Object.values(data.errors || {}).join(", ");
    throw new Error(details || "Falha ao consultar a API-Football.");
  }

  return data;
}

export async function getApiFootballStandings(appLeagueId, season) {
  const baseLeague = getApiFootballLeagueConfig(appLeagueId);
  const league = await resolveApiFootballLeague(baseLeague, season);
  const data = await apiFootballRequest("/standings", {
    league: league.resolvedApiId,
    season
  });

  return normalizeApiFootballStandingsPayload(data, league, season);
}

export async function getApiFootballCoverage(appLeagueId, season) {
  const baseLeague = getApiFootballLeagueConfig(appLeagueId);
  const league = await resolveApiFootballLeague(baseLeague, season);
  const data = await apiFootballRequest("/leagues", {
    id: league.resolvedApiId,
    season
  });

  const leagueResponse = data.response?.[0]?.league;

  return {
    league,
    season: Number(season),
    coverage: leagueResponse?.coverage || null,
    seasons: leagueResponse?.seasons || [],
    source: "api-football"
  };
}

export function normalizeApiFootballStandingsPayload(data, leagueConfig, season) {
  const standingsGroups = data.response?.[0]?.league?.standings || [];
  const rows = standingsGroups.flatMap((group, groupIndex) =>
    group.map((item) => {
      const points = normalizeNumber(item.points) || 0;
      const gamesPlayed = normalizeNumber(item.all?.played) || 0;
      const wins = normalizeNumber(item.all?.win) || 0;
      const draws = normalizeNumber(item.all?.draw) || 0;
      const losses = normalizeNumber(item.all?.lose) || 0;
      const goalsFor = normalizeNumber(item.all?.goals?.for) || 0;
      const goalsAgainst = normalizeNumber(item.all?.goals?.against) || 0;
      const goalDifference = normalizeNumber(item.goalsDiff) || goalsFor - goalsAgainst;
      const groupLabel = item.group || (standingsGroups.length > 1 ? `Grupo ${groupIndex + 1}` : "");

      return {
        id: String(item.team?.id || `${leagueConfig.apiId}-${item.rank}`),
        rank: normalizeNumber(item.rank) || 0,
        name: item.team?.name || "Clube",
        shortName: item.team?.name?.slice(0, 3)?.toUpperCase() || "",
        logo: item.team?.logo || "",
        note: item.description || "",
        points,
        gamesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        performance: getPerformance(points, gamesPlayed),
        form: item.form || "--",
        stats: [],
        group: groupLabel,
        status: item.status || "",
        statMap: {
          rank: String(item.rank ?? "--"),
          gamesPlayed: String(gamesPlayed),
          wins: String(wins),
          draws: String(draws),
          losses: String(losses),
          points: String(points),
          goalsFor: String(goalsFor),
          goalsAgainst: String(goalsAgainst),
          goalDifference: String(goalDifference),
          form: item.form || "--"
        }
      };
    })
  );

  const leaders = buildLeaders(rows);

  return {
    requestMeta: {
      leagueId: leagueConfig.appId,
      providerLeagueId: leagueConfig.resolvedApiId || leagueConfig.apiId,
      season: Number(season)
    },
    league: {
      name: data.response?.[0]?.league?.name || leagueConfig.label,
      abbreviation: leagueConfig.label,
      seasonDisplay: `${season}/${Number(season) + 1}`,
      season: Number(season),
      logo: data.response?.[0]?.league?.logo || "",
      country: data.response?.[0]?.league?.country || leagueConfig.country
    },
    summary: buildSummary(rows, leaders),
    leaders,
    charts: buildCharts(rows),
    rows,
    source: "api-football"
  };
}

function normalizeFixtureFormItem(item, teamId) {
  const goalsHome = item.goals?.home ?? 0;
  const goalsAway = item.goals?.away ?? 0;
  const homeName = item.teams?.home?.name || "Casa";
  const awayName = item.teams?.away?.name || "Fora";
  const isHome = String(item.teams?.home?.id || "") === String(teamId);
  const opponent = isHome ? awayName : homeName;
  const isFinished = item.fixture?.status?.short === "FT" || item.fixture?.status?.elapsed >= 90;

  let result = "E";
  if (isFinished) {
    const teamWon = isHome ? item.teams?.home?.winner : item.teams?.away?.winner;
    const teamLost = isHome ? item.teams?.away?.winner : item.teams?.home?.winner;
    if (teamWon === true) result = "V";
    else if (teamLost === true) result = "D";
  }

  return {
    fixtureId: item.fixture?.id || `${item.league?.id}-${item.fixture?.timestamp || opponent}`,
    opponent,
    score: `${goalsHome}-${goalsAway}`,
    venue: isHome ? "Casa" : "Fora",
    result,
    status: item.fixture?.status?.short || "--",
    league: item.league?.name || ""
  };
}

function normalizeTopScorersFromSquad(playersData) {
  return (playersData.response || [])
    .map((item) => {
      const stats = item.statistics?.[0];
      return {
        name: item.player?.name || "Jogador",
        goals: normalizeNumber(stats?.goals?.total) || 0,
        assists: normalizeNumber(stats?.goals?.assists) || 0,
        minutes: normalizeNumber(stats?.games?.minutes) || 0
      };
    })
    .sort((a, b) => {
      if (b.goals !== a.goals) {
        return b.goals - a.goals;
      }

      return b.assists - a.assists;
    })
    .slice(0, 5);
}

export async function getApiFootballTeamSnapshot({ name, leagueId, season = "2025" }) {
  const inferredLeagueId = inferAppLeagueId(leagueId);
  const league = getApiFootballLeagueConfig(inferredLeagueId);
  const searchData = await apiFootballRequest("/teams", { search: name });
  const candidate = pickBestTeamCandidate(searchData.response || [], name);

  if (!candidate?.team?.id) {
    throw new Error("Time não encontrado na API-Football.");
  }

  const teamId = candidate.team.id;

  const [statisticsData, fixturesData, squadData] = await Promise.all([
    apiFootballRequest(
      "/teams/statistics",
      {
        league: league.apiId,
        season,
        team: teamId
      },
      { revalidate: 1800 }
    ).catch(() => null),
    apiFootballRequest("/fixtures", { team: teamId, season, last: 5 }, { revalidate: 900 }).catch(() => null),
    apiFootballRequest("/players", { team: teamId, season, page: 1 }, { revalidate: 3600 }).catch(() => null)
  ]);

  const statistics = statisticsData?.response || null;
  const fixtures = (fixturesData?.response || []).map((item) => normalizeFixtureFormItem(item, teamId));
  const topScorers = normalizeTopScorersFromSquad(squadData || { response: [] });

  return {
    source: "api-football",
    query: { name, leagueId: inferredLeagueId, season: Number(season) },
    team: {
      id: teamId,
      name: candidate.team?.name || name,
      code: candidate.team?.code || "",
      country: candidate.team?.country || "",
      founded: candidate.team?.founded || null,
      logo: candidate.team?.logo || "",
      venue: candidate.venue?.name || "",
      city: candidate.venue?.city || ""
    },
    statistics: statistics
      ? {
          form: statistics.form || "--",
          played: normalizeNumber(statistics.fixtures?.played?.total) || 0,
          wins: normalizeNumber(statistics.fixtures?.wins?.total) || 0,
          draws: normalizeNumber(statistics.fixtures?.draws?.total) || 0,
          losses: normalizeNumber(statistics.fixtures?.loses?.total) || 0,
          goalsFor: normalizeNumber(statistics.goals?.for?.total?.total) || 0,
          goalsAgainst: normalizeNumber(statistics.goals?.against?.total?.total) || 0,
          cleanSheets: normalizeNumber(statistics.clean_sheet?.total) || 0,
          failedToScore: normalizeNumber(statistics.failed_to_score?.total) || 0,
          penaltyScored: normalizeNumber(statistics.penalty?.scored?.total) || 0,
          penaltyMissed: normalizeNumber(statistics.penalty?.missed?.total) || 0
        }
      : null,
    recentFixtures: fixtures,
    topScorers
  };
}

export async function getApiFootballPlayerSnapshot({ name, season = "2025" }) {
  const searchData = await apiFootballRequest("/players", { search: name, season }, { revalidate: 1800 });
  const candidate = pickBestPlayerCandidate(searchData.response || [], name);

  if (!candidate?.player?.id) {
    throw new Error("Jogador não encontrado na API-Football.");
  }

  const playerId = candidate.player.id;
  const primaryStats = candidate.statistics?.[0] || null;

  const [transfersData, trophiesData] = await Promise.all([
    apiFootballRequest("/transfers", { player: playerId }, { revalidate: 86400 }).catch(() => null),
    apiFootballRequest("/trophies", { player: playerId }, { revalidate: 86400 }).catch(() => null)
  ]);

  const transfers = (transfersData?.response?.[0]?.transfers || []).slice(0, 5).map((item) => ({
    date: item.date || "",
    from: item.teams?.out?.name || "Origem",
    to: item.teams?.in?.name || "Destino",
    type: item.type || ""
  }));

  const trophies = (trophiesData?.response || []).slice(0, 6).map((item) => ({
    league: item.league || "",
    country: item.country || "",
    season: item.season || "",
    place: item.place || ""
  }));

  return {
    source: "api-football",
    query: { name, season: Number(season) },
    player: {
      id: playerId,
      name: candidate.player?.name || name,
      firstname: candidate.player?.firstname || "",
      lastname: candidate.player?.lastname || "",
      age: candidate.player?.age || null,
      nationality: candidate.player?.nationality || "",
      height: candidate.player?.height || "",
      weight: candidate.player?.weight || "",
      injured: Boolean(candidate.player?.injured),
      photo: candidate.player?.photo || ""
    },
    team: {
      id: primaryStats?.team?.id || null,
      name: primaryStats?.team?.name || "",
      logo: primaryStats?.team?.logo || ""
    },
    league: {
      id: primaryStats?.league?.id || null,
      name: primaryStats?.league?.name || "",
      country: primaryStats?.league?.country || ""
    },
    statistics: primaryStats
      ? {
          appearances: normalizeNumber(primaryStats.games?.appearences) || 0,
          starts: normalizeNumber(primaryStats.games?.lineups) || 0,
          minutes: normalizeNumber(primaryStats.games?.minutes) || 0,
          rating: primaryStats.games?.rating || "--",
          goals: normalizeNumber(primaryStats.goals?.total) || 0,
          assists: normalizeNumber(primaryStats.goals?.assists) || 0,
          shots: normalizeNumber(primaryStats.shots?.total) || 0,
          shotsOnTarget: normalizeNumber(primaryStats.shots?.on) || 0,
          passes: normalizeNumber(primaryStats.passes?.total) || 0,
          keyPasses: normalizeNumber(primaryStats.passes?.key) || 0,
          tackles: normalizeNumber(primaryStats.tackles?.total) || 0,
          interceptions: normalizeNumber(primaryStats.tackles?.interceptions) || 0,
          duelsWon: normalizeNumber(primaryStats.duels?.won) || 0,
          duelsTotal: normalizeNumber(primaryStats.duels?.total) || 0,
          dribbles: normalizeNumber(primaryStats.dribbles?.success) || 0,
          cardsYellow: normalizeNumber(primaryStats.cards?.yellow) || 0,
          cardsRed: normalizeNumber(primaryStats.cards?.red) || 0
        }
      : null,
    transfers,
    trophies
  };
}

export const apiFootballBlueprint = {
  home: ["/fixtures?live=all", "/fixtures?league=LEAGUE_ID&season=SEASON&next=5"],
  ranking: ["/standings?league=LEAGUE_ID&season=SEASON", "/teams/statistics?league=LEAGUE_ID&season=SEASON&team=TEAM_ID"],
  teams: [
    "/teams?id=TEAM_ID",
    "/teams/statistics?league=LEAGUE_ID&season=SEASON&team=TEAM_ID",
    "/fixtures?team=TEAM_ID&season=SEASON&last=5",
    "/injuries?team=TEAM_ID&season=SEASON",
    "/fixtures/headtohead?h2h=TEAM_A-TEAM_B"
  ],
  players: [
    "/players?search=PLAYER_NAME&season=SEASON",
    "/players?id=PLAYER_ID&season=SEASON",
    "/transfers?player=PLAYER_ID",
    "/trophies?player=PLAYER_ID",
    "/sidelined?player=PLAYER_ID"
  ],
  reports: [
    "/fixtures/players?fixture=FIXTURE_ID",
    "/predictions?fixture=FIXTURE_ID",
    "/odds?fixture=FIXTURE_ID"
  ]
};
