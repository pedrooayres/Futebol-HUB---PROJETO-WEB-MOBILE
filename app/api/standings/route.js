import { NextResponse } from "next/server";

const DEFAULT_LEAGUE = "eng.1";
const DEFAULT_SEASON = "2024";

function buildStandingsUrl(league, season) {
  return `https://api-football-standings.azharimm.dev/leagues/${league}/standings?season=${season}&sort=asc`;
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || DEFAULT_LEAGUE;
  const season = searchParams.get("season") || DEFAULT_SEASON;
  const url = buildStandingsUrl(leagueId, season);

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tabela externa.");
    }

    const data = await response.json();
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
      rows
    });
  } catch (error) {
    return NextResponse.json(
      {
        requestMeta: {
          leagueId,
          season: Number(season)
        },
        league: null,
        summary: null,
        leaders: null,
        charts: null,
        rows: [],
        message: error.message
      },
      { status: 500 }
    );
  }
}
