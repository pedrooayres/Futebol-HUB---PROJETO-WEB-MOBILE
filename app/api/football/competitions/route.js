import { NextResponse } from "next/server";

import {
  API_FOOTBALL_LEAGUES,
  buildCompetitionSourceMeta,
  hasApiFootballKey,
  hasLiveScoreConfig
} from "@/lib/api-football";

export async function GET() {
  return NextResponse.json({
    configured: hasApiFootballKey(),
    livescoreConfigured: hasLiveScoreConfig(),
    competitions: API_FOOTBALL_LEAGUES.map((item) => ({
      id: item.appId,
      label: item.label,
      season: item.season,
      country: item.country,
      type: item.type,
      sourceMeta: buildCompetitionSourceMeta(item)
    }))
  });
}
