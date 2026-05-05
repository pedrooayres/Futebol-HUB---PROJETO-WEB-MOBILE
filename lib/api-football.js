const API_FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";

export const API_FOOTBALL_LEAGUES = [
  { appId: "eng.1", apiId: 39, label: "Premier League", country: "England" },
  { appId: "esp.1", apiId: 140, label: "La Liga", country: "Spain" },
  { appId: "ita.1", apiId: 135, label: "Serie A", country: "Italy" },
  { appId: "ger.1", apiId: 78, label: "Bundesliga", country: "Germany" },
  { appId: "fra.1", apiId: 61, label: "Ligue 1", country: "France" },
  { appId: "bra.1", apiId: 71, label: "Brasileirao", country: "Brazil" }
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

export function getApiFootballLeagueConfig(appLeagueId) {
  return API_FOOTBALL_LEAGUE_MAP[appLeagueId] || API_FOOTBALL_LEAGUE_MAP["eng.1"];
}

export async function apiFootballRequest(pathname, searchParams = {}, options = {}) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY nao configurada.");
  }

  const url = new URL(`${API_FOOTBALL_BASE_URL}${pathname}`);
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      "x-apisports-key": apiKey
    },
    next: { revalidate: options.revalidate ?? 1800 }
  });

  const data = await response.json();
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
  const league = getApiFootballLeagueConfig(appLeagueId);
  const data = await apiFootballRequest("/standings", {
    league: league.apiId,
    season
  });

  return normalizeApiFootballStandingsPayload(data, league, season);
}

export async function getApiFootballCoverage(appLeagueId, season) {
  const league = getApiFootballLeagueConfig(appLeagueId);
  const data = await apiFootballRequest("/leagues", {
    id: league.apiId,
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
      providerLeagueId: leagueConfig.apiId,
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
