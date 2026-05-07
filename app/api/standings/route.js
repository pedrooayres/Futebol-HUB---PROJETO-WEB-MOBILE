import { NextResponse } from "next/server";
import {
  getApiFootballLeagueConfig,
  getApiFootballStandings,
  hasApiFootballKey,
  hasLiveScoreConfig
} from "@/lib/api-football";
import { fallbackStandingsByLeague } from "@/lib/football-data";

const DEFAULT_LEAGUE = "eng.1";
const DEFAULT_SEASON = "2025";
const STANDINGS_HOSTS = [
  "https://api-football-standings.azharimm.dev",
  "https://api-football-standings.azharimm.site"
];
const LIVESCORE_BASE_URL = "https://livescore-api.com/api-client";

function buildLiveScoreUrl(pathname, searchParams = {}) {
  const url = new URL(`${LIVESCORE_BASE_URL}${pathname}`);
  url.searchParams.set("key", process.env.LIVESCORE_API_KEY || "");
  url.searchParams.set("secret", process.env.LIVESCORE_API_SECRET || "");

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

function buildStandingsUrl(host, league, season) {
  return `${host}/leagues/${league}/standings?season=${season}&sort=asc`;
}

function normalizeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function getStat(stats, keys) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  return stats.find((item) => keyList.includes(item.name));
}

function getStatDisplay(stats, keys, fallback = "--") {
  return getStat(stats, keys)?.displayValue ?? fallback;
}

function getStatNumber(stats, keys, fallback = null) {
  const stat = getStat(stats, keys);
  if (!stat) {
    return fallback;
  }

  return normalizeNumber(stat.value ?? stat.displayValue) ?? fallback;
}

function getPerformance(points, gamesPlayed) {
  if (!points || !gamesPlayed) {
    return 0;
  }

  return Number(((points / (gamesPlayed * 3)) * 100).toFixed(1));
}

async function liveScoreRequest(pathname, searchParams = {}, revalidate = 1800) {
  if (!hasLiveScoreConfig()) {
    throw new Error("LIVESCORE_API_KEY/LIVESCORE_API_SECRET nao configuradas.");
  }

  const response = await fetch(buildLiveScoreUrl(pathname, searchParams), {
    next: { revalidate }
  });
  const data = await response.json();

  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || data?.message || "Falha ao consultar a LiveScore API.");
  }

  return data;
}

function buildLiveScoreSeasonCandidates(season) {
  const numeric = Number(season);
  if (!Number.isFinite(numeric)) {
    return [];
  }

  return [`${numeric}/${numeric + 1}`, String(numeric), `${numeric - 1}/${numeric}`];
}

function inferSeasonDisplayFromName(name = "", fallbackSeason = DEFAULT_SEASON) {
  if (!name) {
    return `${fallbackSeason}/${Number(fallbackSeason) + 1}`;
  }

  return name;
}

async function resolveLiveScoreSeasonId(season) {
  const data = await liveScoreRequest("/seasons/list.json", {}, 86400);
  const seasons = data?.data?.seasons || [];
  const candidates = buildLiveScoreSeasonCandidates(season);

  const matchedSeason =
    candidates
      .map((candidateName) =>
        seasons.find((item) => String(item.name).trim() === candidateName)
      )
      .find(Boolean) || null;

  return matchedSeason
    ? {
        id: matchedSeason.id,
        name: matchedSeason.name,
        start: matchedSeason.start || "",
        end: matchedSeason.end || ""
      }
    : null;
}

function flattenLiveScoreStandings(data) {
  const stages = data?.data?.stages || [];

  return stages.flatMap((stage) =>
    (stage?.groups || []).flatMap((group) =>
      (group?.standings || []).map((item) => ({
        ...item,
        stageName: stage?.stage?.name || "",
        groupName: group?.name || ""
      }))
    )
  );
}

function inferCupPhaseLabel(leagueId, season, rows, stages = []) {
  const numericSeason = Number(season);
  const groupNames = [...new Set(rows.map((item) => item.group).filter(Boolean))];
  const stageNames = [...new Set(stages.map((item) => item.stage?.name).filter(Boolean))];

  if (["ucl", "uel", "uecl"].includes(leagueId)) {
    return numericSeason >= 2024 ? "Fase de liga" : "Fase de grupos";
  }

  if (["world-cup", "euro", "copa-america"].includes(leagueId)) {
    return "Fase de grupos";
  }

  if (groupNames.length > 1 || stageNames.some((name) => /group/i.test(name))) {
    return "Fase de grupos";
  }

  return "Tabela principal";
}

function normalizeLiveScoreForm(form) {
  if (Array.isArray(form)) {
    return form.join(" ");
  }

  if (typeof form === "string") {
    return form;
  }

  return "--";
}

function getKnockoutRoundLabel(value = "") {
  const normalized = String(value || "").trim();

  if (!normalized || normalized === "999") {
    return "Fase em definicao";
  }

  return normalized;
}

function normalizeLiveScoreMatch(item, mode = "history") {
  const home = item.home || {};
  const away = item.away || {};
  const scoreObject = item.scores || {};
  const score =
    scoreObject.score ||
    scoreObject.ft_score ||
    [scoreObject.home_score, scoreObject.away_score].filter((value) => value !== undefined).join(" - ") ||
    "--";

  return {
    id: String(item.id || item.fixture_id || `${home.id || "h"}-${away.id || "a"}-${item.date || item.scheduled || mode}`),
    round: getKnockoutRoundLabel(item.round),
    date: item.date || "",
    time: item.time || item.scheduled || "",
    status: item.status || item.time || (mode === "fixtures" ? "AGENDADO" : "FT"),
    homeTeam: {
      id: String(home.id || ""),
      name: home.name || "Mandante",
      logo: home.logo || ""
    },
    awayTeam: {
      id: String(away.id || ""),
      name: away.name || "Visitante",
      logo: away.logo || ""
    },
    score,
    location: item.location || "",
    winner: item.outcomes?.full_time || "",
    fixtureId: String(item.fixture_id || ""),
    mode
  };
}

function buildRoundOrderValue(round) {
  const normalized = String(round || "").toUpperCase();
  const knockoutOrder = {
    "PRELIMINARY": 0,
    "QUAL": 1,
    "R128": 2,
    "R64": 3,
    "R32": 4,
    "R16": 5,
    "QF": 6,
    "SF": 7,
    "3P": 8,
    "FINAL": 9
  };

  if (normalized in knockoutOrder) {
    return knockoutOrder[normalized];
  }

  const numeric = Number(normalized);
  if (Number.isFinite(numeric)) {
    return 100 + numeric;
  }

  return 999;
}

function groupMatchesByRound(matches) {
  const buckets = new Map();

  matches.forEach((match) => {
    const key = match.round || "Fase em definicao";
    const current = buckets.get(key) || [];
    current.push(match);
    buckets.set(key, current);
  });

  return [...buckets.entries()]
    .sort((a, b) => buildRoundOrderValue(a[0]) - buildRoundOrderValue(b[0]))
    .map(([round, items]) => ({
      round,
      matches: items
    }));
}

async function getLiveScoreKnockoutPayload(leagueId, season) {
  const competition = getApiFootballLeagueConfig(leagueId);
  const resolvedSeason = await resolveLiveScoreSeasonId(season);
  const competition_id = competition.competitionId;

  const [liveData, fixturesData, historyData] = await Promise.all([
    liveScoreRequest("/matches/live.json", { competition_id }, 120).catch(() => ({ data: { match: [] } })),
    liveScoreRequest("/fixtures/list.json", { competition_id }, 1800).catch(() => ({ data: { fixtures: [] } })),
    liveScoreRequest("/matches/history.json", { competition_id }, 1800).catch(() => ({ data: { match: [] } }))
  ]);

  const liveMatches = (liveData?.data?.match || []).map((item) => normalizeLiveScoreMatch(item, "live"));
  const upcomingMatches = (fixturesData?.data?.fixtures || []).map((item) => normalizeLiveScoreMatch(item, "fixtures"));
  const recentMatches = (historyData?.data?.match || []).map((item) => normalizeLiveScoreMatch(item, "history"));
  const rounds = groupMatchesByRound([...upcomingMatches, ...recentMatches]);

  return {
    mode: "knockout",
    activeView: "knockout",
    availableViews: ["standings", "knockout"],
    requestMeta: {
      leagueId,
      providerLeagueId: competition_id,
      season: Number(season),
      providerSeasonId: resolvedSeason?.id || null
    },
    league: {
      name: competition.label,
      abbreviation: competition.label,
      seasonDisplay: inferSeasonDisplayFromName(resolvedSeason?.name, season),
      season: Number(season),
      country: competition.country
    },
    overview: {
      liveMatches: liveMatches.length,
      upcomingMatches: upcomingMatches.length,
      recentMatches: recentMatches.length,
      rounds: rounds.length
    },
    liveMatches,
    upcomingMatches: upcomingMatches.slice(0, 16),
    recentMatches: recentMatches.slice(0, 16),
    rounds,
    source: "livescore-knockout",
    message: "Modo mata-mata ativo com base em livescores, agenda e historico da competicao."
  };
}

async function getLiveScoreStandings(leagueId, season) {
  const competition = getApiFootballLeagueConfig(leagueId);

  if (!competition?.competitionId) {
    throw new Error("Competicao sem competition_id configurado para LiveScore.");
  }

  const resolvedSeason = await resolveLiveScoreSeasonId(season);
  const searchParams = {
    competition_id: competition.competitionId,
    include_form: 1
  };

  if (resolvedSeason?.id) {
    searchParams.season_id = resolvedSeason.id;
  }

  const data = await liveScoreRequest("/competitions/table.json", searchParams, 1800);
  const stages = data?.data?.stages || [];
  const standings = flattenLiveScoreStandings(data);

  if (standings.length === 0) {
    throw new Error("A LiveScore nao retornou tabela para essa temporada.");
  }

  const rows = standings.map((item, index) => {
    const points = normalizeNumber(item.points) || 0;
    const gamesPlayed = normalizeNumber(item.matches) || 0;
    const wins = normalizeNumber(item.won) || 0;
    const draws = normalizeNumber(item.drawn) || 0;
    const losses = normalizeNumber(item.lost) || 0;
    const goalsFor = normalizeNumber(item.goals_scored) || 0;
    const goalsAgainst = normalizeNumber(item.goals_conceded) || 0;
    const goalDifference = normalizeNumber(item.goal_diff) || goalsFor - goalsAgainst;
    const rank = normalizeNumber(item.rank) || index + 1;
    const form = normalizeLiveScoreForm(item.form);

    return {
      id: String(item.team?.id || `${competition.competitionId}-${rank}`),
      rank,
      name: item.team?.name || "Clube",
      shortName: item.team?.name?.slice(0, 3)?.toUpperCase() || "",
      logo: item.team?.logo || "",
      note: item.stageName && item.groupName ? `${item.stageName} | Grupo ${item.groupName}` : item.stageName || "",
      points,
      gamesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference,
      performance: getPerformance(points, gamesPlayed),
      form,
      stats: [],
      group: item.groupName || "",
      stage: item.stageName || "",
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
        form
      }
    };
  });

  const leaderBy = (selector, sort = "desc") =>
    [...rows]
      .filter((item) => typeof selector(item) === "number")
      .sort((a, b) => {
        const result = selector(a) - selector(b);
        return sort === "asc" ? result : -result;
      })[0] || null;

  const leaders = {
    tableLeader: leaderBy((item) => item.points),
    bestAttack: leaderBy((item) => item.goalsFor),
    bestDefense: leaderBy((item) => item.goalsAgainst, "asc"),
    mostWins: leaderBy((item) => item.wins)
  };

  const charts = {
    points: rows.slice(0, 8).map((item) => ({ id: item.id, label: item.shortName || item.name, value: item.points })),
    attack: [...rows]
      .sort((a, b) => b.goalsFor - a.goalsFor)
      .slice(0, 8)
      .map((item) => ({ id: item.id, label: item.shortName || item.name, value: item.goalsFor })),
    defense: [...rows]
      .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
      .slice(0, 8)
      .map((item) => ({ id: item.id, label: item.shortName || item.name, value: item.goalsAgainst }))
  };

  const summary = {
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

  return {
    mode: "standings",
    activeView: "standings",
    availableViews: competition.type === "Cup" ? ["standings", "knockout"] : ["standings"],
    phaseLabel: competition.type === "Cup" ? inferCupPhaseLabel(leagueId, season, rows, stages) : "",
    requestMeta: {
      leagueId,
      providerLeagueId: competition.competitionId,
      season: Number(season),
      providerSeasonId: resolvedSeason?.id || null
    },
    league: {
      name: data?.data?.competition?.name || competition.label,
      abbreviation: competition.label,
      seasonDisplay: inferSeasonDisplayFromName(resolvedSeason?.name, season),
      season: Number(season),
      country: competition.country
    },
    summary,
    leaders,
    charts,
    rows,
    source: "livescore-table",
    message: resolvedSeason?.id
      ? `Tabela carregada pela LiveScore com season_id ${resolvedSeason.id}.`
      : "Tabela carregada pela LiveScore na temporada atual da competicao."
  };
}

function buildFallbackPayload(leagueId, season) {
  const leagueData = fallbackStandingsByLeague[leagueId];

  if (!leagueData) {
    return buildUnavailablePayload(
      leagueId,
      season,
      "Sem fallback local confiavel para essa competicao/temporada."
    );
  }

  const rows = leagueData.teams.map((team, index) => {
    const [name, shortName, points, gamesPlayed, wins, draws, losses, goalsFor, goalsAgainst] = team;
    const goalDifference = goalsFor - goalsAgainst;

    return {
      id: `${leagueId}-${shortName}-${season}`,
      rank: index + 1,
      name,
      shortName,
      logo: "",
      note: "Dados exibidos a partir de fallback local.",
      points,
      gamesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference,
      performance: getPerformance(points, gamesPlayed),
      form: "--",
      stats: [],
      statMap: {
        rank: String(index + 1),
        gamesPlayed: String(gamesPlayed),
        wins: String(wins),
        draws: String(draws),
        losses: String(losses),
        points: String(points),
        goalsFor: String(goalsFor),
        goalsAgainst: String(goalsAgainst),
        goalDifference: String(goalDifference),
        form: "--"
      }
    };
  });

  const leaderBy = (selector, sort = "desc") =>
    [...rows]
      .sort((a, b) => {
        const result = selector(a) - selector(b);
        return sort === "asc" ? result : -result;
      })[0] || null;

  return {
    requestMeta: {
      leagueId,
      season: Number(season)
    },
    league: {
      name: leagueData.name,
      abbreviation: leagueData.abbreviation,
      seasonDisplay: `${season}-${Number(season) + 1}`,
      season: Number(season)
    },
    summary: {
      teams: rows.length,
      averagePoints: Number((rows.reduce((sum, item) => sum + item.points, 0) / rows.length).toFixed(1)),
      averageGoalsFor: Number((rows.reduce((sum, item) => sum + item.goalsFor, 0) / rows.length).toFixed(1)),
      maximumPoints: leaderBy((item) => item.points)?.points || 0
    },
    leaders: {
      tableLeader: leaderBy((item) => item.points),
      bestAttack: leaderBy((item) => item.goalsFor),
      bestDefense: leaderBy((item) => item.goalsAgainst, "asc"),
      mostWins: leaderBy((item) => item.wins)
    },
    charts: {
      points: rows.slice(0, 8).map((item) => ({ id: item.id, label: item.shortName, value: item.points })),
      attack: [...rows]
        .sort((a, b) => b.goalsFor - a.goalsFor)
        .slice(0, 8)
        .map((item) => ({ id: item.id, label: item.shortName, value: item.goalsFor })),
      defense: [...rows]
        .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
        .slice(0, 8)
        .map((item) => ({ id: item.id, label: item.shortName, value: item.goalsAgainst }))
    },
    rows,
    source: "fallback"
  };
}

function buildUnavailablePayload(leagueId, season, message) {
  const competition = getApiFootballLeagueConfig(leagueId);

  return {
    mode: "unavailable",
    requestMeta: {
      leagueId,
      season: Number(season)
    },
    league: {
      name: competition?.label || "Competicao",
      abbreviation: competition?.label || "",
      seasonDisplay: `${season}/${Number(season) + 1}`,
      season: Number(season),
      country: competition?.country || ""
    },
    summary: null,
    leaders: null,
    charts: null,
    rows: [],
    source: "unavailable",
    message
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || DEFAULT_LEAGUE;
  const season = searchParams.get("season") || DEFAULT_SEASON;
  const view = searchParams.get("view") || "auto";

  try {
    const liveScoreConfig = getApiFootballLeagueConfig(leagueId);

    if (liveScoreConfig?.providerHint === "livescore-api" && liveScoreConfig?.competitionId && hasLiveScoreConfig()) {
      try {
        if (liveScoreConfig.type === "Cup" && view === "knockout") {
          const liveScoreKnockoutPayload = await getLiveScoreKnockoutPayload(leagueId, season);
          return NextResponse.json(liveScoreKnockoutPayload);
        }

        try {
          const liveScorePayload = await getLiveScoreStandings(leagueId, season);
          return NextResponse.json(liveScorePayload);
        } catch (standingsError) {
          if (liveScoreConfig.type === "Cup") {
            const liveScoreKnockoutPayload = await getLiveScoreKnockoutPayload(leagueId, season);
            return NextResponse.json({
              ...liveScoreKnockoutPayload,
              message: `Fase classificatoria indisponivel para ${leagueId}/${season}. Exibindo mata-mata: ${standingsError.message}`
            });
          }

          return NextResponse.json(
            buildUnavailablePayload(
              leagueId,
              season,
              `Sem tabela historica confiavel para ${leagueId}/${season}: ${standingsError.message}`
            )
          );
        }
      } catch (liveScoreError) {
        if (hasApiFootballKey()) {
          const apiFootballPayload = await getApiFootballStandings(leagueId, season);
          return NextResponse.json({
            ...apiFootballPayload,
            message: `LiveScore indisponivel para ${leagueId}/${season}. Fallback em API-Football: ${liveScoreError.message}`
          });
        }
      }
    }

    if (hasApiFootballKey()) {
      const payload = await getApiFootballStandings(leagueId, season);
      return NextResponse.json(payload);
    }

    let response = null;
    let data = null;
    let lastError = null;

    for (const host of STANDINGS_HOSTS) {
      try {
        response = await fetch(buildStandingsUrl(host, leagueId, season), {
          next: { revalidate: 3600 }
        });

        if (!response.ok) {
          throw new Error("Nao foi possivel carregar a tabela externa.");
        }

        data = await response.json();
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!data) {
      const fallbackPayload = buildFallbackPayload(leagueId, season);
      return NextResponse.json({
        ...fallbackPayload,
        message:
          fallbackPayload.mode === "unavailable"
            ? lastError?.message || fallbackPayload.message
            : lastError?.message || "Dados externos indisponiveis. Fallback local em uso."
      });
    }
    const standings = data?.data?.standings || [];

    const rows = standings.map((item, index) => {
      const stats = item.stats || [];
      const points = getStatNumber(stats, "points", 0);
      const gamesPlayed = getStatNumber(stats, ["gamesPlayed", "matchesPlayed"], 0);
      const wins = getStatNumber(stats, "wins", 0);
      const draws = getStatNumber(stats, ["ties", "draws"], 0);
      const losses = getStatNumber(stats, "losses", 0);
      const goalsFor = getStatNumber(stats, ["pointsFor", "goalsFor"], 0);
      const goalsAgainst = getStatNumber(stats, ["pointsAgainst", "goalsAgainst"], 0);
      const goalDifference = getStatNumber(stats, ["pointDifferential", "goalDifferential"], 0);
      const rank = getStatNumber(stats, ["rank", "leagueRank"], index + 1);

      return {
        id: item.team?.id || String(index + 1),
        rank,
        name: item.team?.name || item.team?.displayName || "Clube",
        shortName: item.team?.abbreviation || item.team?.shortDisplayName || "",
        logo: item.team?.logos?.[0]?.href || "",
        note: item.note || "",
        points,
        gamesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        performance: getPerformance(points, gamesPlayed),
        form: getStatDisplay(stats, ["form", "lastFive"], "--"),
        stats,
        statMap: {
          rank: getStatDisplay(stats, ["rank", "leagueRank"], String(rank)),
          gamesPlayed: getStatDisplay(stats, ["gamesPlayed", "matchesPlayed"], String(gamesPlayed)),
          wins: getStatDisplay(stats, "wins", String(wins)),
          draws: getStatDisplay(stats, ["ties", "draws"], String(draws)),
          losses: getStatDisplay(stats, "losses", String(losses)),
          points: getStatDisplay(stats, "points", String(points)),
          goalsFor: getStatDisplay(stats, ["pointsFor", "goalsFor"], String(goalsFor)),
          goalsAgainst: getStatDisplay(stats, ["pointsAgainst", "goalsAgainst"], String(goalsAgainst)),
          goalDifference: getStatDisplay(
            stats,
            ["pointDifferential", "goalDifferential"],
            String(goalDifference)
          ),
          form: getStatDisplay(stats, ["form", "lastFive"], "--")
        }
      };
    });

    const leaderBy = (selector, sort = "desc") =>
      [...rows]
        .filter((item) => typeof selector(item) === "number")
        .sort((a, b) => {
          const result = selector(a) - selector(b);
          return sort === "asc" ? result : -result;
        })[0] || null;

    const leaders = {
      tableLeader: leaderBy((item) => item.points),
      bestAttack: leaderBy((item) => item.goalsFor),
      bestDefense: leaderBy((item) => item.goalsAgainst, "asc"),
      mostWins: leaderBy((item) => item.wins)
    };

    const charts = {
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

    const summary = {
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

    return NextResponse.json({
      requestMeta: {
        leagueId,
        season: Number(season)
      },
      league: {
        name: data?.data?.name || "League",
        abbreviation: data?.data?.abbreviation || "",
        seasonDisplay: data?.data?.seasonDisplay || "",
        season: data?.data?.season || null
      },
      summary,
      leaders,
      charts,
      rows,
      source: "api"
    });
  } catch (error) {
    const fallbackPayload = buildFallbackPayload(leagueId, season);
    return NextResponse.json({
      ...fallbackPayload,
      message: fallbackPayload.mode === "unavailable" ? error.message : error.message
    });
  }
}
