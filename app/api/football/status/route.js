import { NextResponse } from "next/server";

import {
  API_FOOTBALL_LEAGUES,
  apiFootballBlueprint,
  getApiFootballCoverage,
  hasApiFootballKey,
  hasLiveScoreConfig
} from "@/lib/api-football";
import { publicErrorMessage } from "@/lib/api-errors";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || "eng.1";
  const season = searchParams.get("season") || "2025";

  const payload = {
    provider: "multi-source",
    configured: hasApiFootballKey() || hasLiveScoreConfig(),
    apiFootballConfigured: hasApiFootballKey(),
    liveScoreConfigured: hasLiveScoreConfig(),
    season,
    leagues: API_FOOTBALL_LEAGUES,
    liveScoreStandingsCompetitions: API_FOOTBALL_LEAGUES.filter(
      (item) => item.providerHint === "livescore-api" && item.competitionId
    ).map((item) => ({
      appId: item.appId,
      label: item.label,
      competitionId: item.competitionId,
      season: item.season
    })),
    blueprint: apiFootballBlueprint
  };

  if (!hasApiFootballKey()) {
    return NextResponse.json({
      ...payload,
      message: hasLiveScoreConfig()
        ? "LiveScore ativo para competições mapeadas. API-Football pode ampliar a cobertura quando configurada."
        : "Fontes ao vivo ainda não configuradas. O produto segue operando com dados locais e fallback."
    });
  }

  try {
    const coverage = await getApiFootballCoverage(leagueId, season);

    return NextResponse.json({
      ...payload,
      coverage
    });
  } catch (error) {
    return NextResponse.json({
      ...payload,
      message: publicErrorMessage(error, "Não foi possível validar a cobertura da API-Football agora.")
    });
  }
}
