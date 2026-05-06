import { NextResponse } from "next/server";

import { hasLiveScoreConfig } from "@/lib/api-football";

const LIVE_SCORE_BASE_URL = "https://livescore-api.com/api-client/matches/live.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get("competitionId");

  if (!competitionId) {
    return NextResponse.json({ message: "competitionId obrigatorio." }, { status: 400 });
  }

  if (!hasLiveScoreConfig()) {
    return NextResponse.json({
      configured: false,
      message: "LIVESCORE_API_KEY e LIVESCORE_API_SECRET nao configuradas."
    });
  }

  const url = new URL(LIVE_SCORE_BASE_URL);
  url.searchParams.set("competition_id", competitionId);
  url.searchParams.set("key", process.env.LIVESCORE_API_KEY);
  url.searchParams.set("secret", process.env.LIVESCORE_API_SECRET);

  try {
    const response = await fetch(url, {
      next: { revalidate: 600 }
    });
    const data = await response.json();

    return NextResponse.json({
      configured: true,
      competitionId,
      source: "livescore-api",
      data
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      competitionId,
      source: "livescore-api",
      message: error.message
    });
  }
}
