import { NextResponse } from "next/server";

import { API_FOOTBALL_LEAGUES, hasApiFootballKey } from "@/lib/api-football";

export async function GET() {
  return NextResponse.json({
    configured: hasApiFootballKey(),
    competitions: API_FOOTBALL_LEAGUES.map((item) => ({
      id: item.appId,
      label: item.label,
      season: item.season,
      country: item.country,
      type: item.type
    }))
  });
}
