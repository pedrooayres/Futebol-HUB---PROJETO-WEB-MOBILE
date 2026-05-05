import { NextResponse } from "next/server";

import {
  API_FOOTBALL_LEAGUES,
  apiFootballBlueprint,
  getApiFootballCoverage,
  hasApiFootballKey
} from "@/lib/api-football";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get("league") || "eng.1";
  const season = searchParams.get("season") || "2025";

  const payload = {
    provider: "API-Football",
    configured: hasApiFootballKey(),
    season,
    leagues: API_FOOTBALL_LEAGUES,
    blueprint: apiFootballBlueprint
  };

  if (!hasApiFootballKey()) {
    return NextResponse.json({
      ...payload,
      message: "Configure API_FOOTBALL_KEY para ativar a migracao real dos dados."
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
      message: error.message
    });
  }
}
