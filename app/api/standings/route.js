import { NextResponse } from "next/server";
import { fallbackStandingsByLeague } from "@/lib/football-data";

const DEFAULT_LEAGUE = "eng.1";
const DEFAULT_SEASON = "2024";
const STANDINGS_HOSTS = [
  "https://api-football-standings.azharimm.dev",
  "https://api-football-standings.azharimm.site"
];

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

function buildFallbackPayload(leagueId, season) {
  const leagueData = fallbackStandingsByLeague[leagueId] || fallbackStandingsByLeague[DEFAULT_LEAGUE];

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || DEFAULT_LEAGUE;
  const season = searchParams.get("season") || DEFAULT_SEASON;

  try {
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
      return NextResponse.json({
        ...buildFallbackPayload(leagueId, season),
        message: lastError?.message || "Dados externos indisponiveis. Fallback local em uso."
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
    return NextResponse.json({
      ...buildFallbackPayload(leagueId, season),
      message: error.message
    });
  }
}
