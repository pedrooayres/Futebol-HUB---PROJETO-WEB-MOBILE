import { fetchJson } from "@/lib/http-client";
import { getApiFootballLeagueConfig } from "@/lib/api-football";

const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";

const FOOTBALL_DATA_COMPETITION_CODES = {
  "bra.1": "BSA",
  "eng.1": "PL",
  "eng.2": "ELC",
  "esp.1": "PD",
  "ita.1": "SA",
  "ger.1": "BL1",
  "fra.1": "FL1",
  "por.1": "PPL",
  ucl: "CL",
  world-cup: "WC",
  euro: "EC",
  libertadores: "CLI"
};

function normalizeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
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
    averagePoints: rows.length
      ? Number((rows.reduce((sum, item) => sum + item.points, 0) / rows.length).toFixed(1))
      : 0,
    averageGoalsFor: rows.length
      ? Number((rows.reduce((sum, item) => sum + item.goalsFor, 0) / rows.length).toFixed(1))
      : 0,
    maximumPoints: leaders.tableLeader?.points || 0
  };
}

function normalizeStandingsPayload(data, appLeagueId, season) {
  const leagueConfig = getApiFootballLeagueConfig(appLeagueId);
  const table = data?.standings?.find((standing) => standing.type === "TOTAL")?.table || data?.standings?.[0]?.table || [];
  const rows = table.map((item, index) => {
    const points = normalizeNumber(item.points);
    const gamesPlayed = normalizeNumber(item.playedGames);
    const wins = normalizeNumber(item.won);
    const draws = normalizeNumber(item.draw);
    const losses = normalizeNumber(item.lost);
    const goalsFor = normalizeNumber(item.goalsFor);
    const goalsAgainst = normalizeNumber(item.goalsAgainst);
    const goalDifference = normalizeNumber(item.goalDifference);
    const rank = normalizeNumber(item.position) || index + 1;

    return {
      id: String(item.team?.id || `${appLeagueId}-${rank}`),
      rank,
      name: item.team?.name || item.team?.shortName || "Clube",
      shortName: item.team?.tla || item.team?.shortName || "",
      logo: item.team?.crest || "",
      note: item.group || "",
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
      statMap: {
        rank: String(rank),
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
  });
  const leaders = buildLeaders(rows);

  return {
    mode: "standings",
    activeView: "standings",
    availableViews: ["standings"],
    requestMeta: {
      leagueId: appLeagueId,
      providerLeagueId: data?.competition?.code || FOOTBALL_DATA_COMPETITION_CODES[appLeagueId],
      season: Number(season)
    },
    league: {
      name: data?.competition?.name || leagueConfig.label,
      abbreviation: data?.competition?.code || leagueConfig.label,
      seasonDisplay: data?.season?.startDate && data?.season?.endDate
        ? `${data.season.startDate.slice(0, 4)}/${data.season.endDate.slice(0, 4)}`
        : `${season}/${Number(season) + 1}`,
      season: Number(season),
      logo: data?.competition?.emblem || "",
      country: data?.area?.name || leagueConfig.country
    },
    summary: buildSummary(rows, leaders),
    leaders,
    charts: buildCharts(rows),
    rows,
    source: "football-data.org",
    message: "Tabela carregada pela fonte gratuita football-data.org."
  };
}

export function hasFootballDataOrgToken() {
  return Boolean(process.env.FOOTBALL_DATA_API_TOKEN);
}

export function supportsFootballDataOrgLeague(appLeagueId) {
  return Boolean(FOOTBALL_DATA_COMPETITION_CODES[appLeagueId]);
}

export async function getFootballDataOrgStandings(appLeagueId, season) {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  const competitionCode = FOOTBALL_DATA_COMPETITION_CODES[appLeagueId];

  if (!token) {
    throw new Error("football-data.org ainda nao configurada.");
  }

  if (!competitionCode) {
    throw new Error("Competicao sem cobertura mapeada na football-data.org.");
  }

  const url = new URL(`${FOOTBALL_DATA_BASE_URL}/competitions/${competitionCode}/standings`);
  url.searchParams.set("season", String(season));

  const { response, data } = await fetchJson(
    url,
    {
      headers: {
        "X-Auth-Token": token
      },
      next: { revalidate: 21600 }
    },
    { timeoutMs: 10000 }
  );

  if (!response.ok) {
    throw new Error(data?.message || "Falha ao consultar a football-data.org.");
  }

  return normalizeStandingsPayload(data, appLeagueId, season);
}
