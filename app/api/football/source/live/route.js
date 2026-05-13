import { NextResponse } from "next/server";

import { hasLiveScoreConfig } from "@/lib/api-football";
import { publicErrorMessage } from "@/lib/api-errors";
import { fetchJson } from "@/lib/http-client";

const LIVE_SCORE_BASE_URL = "https://livescore-api.com/api-client/matches/live.json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const competitionId = searchParams.get("competitionId");

  if (!competitionId) {
    return NextResponse.json({ message: "competitionId obrigatório." }, { status: 400 });
  }

  if (!hasLiveScoreConfig()) {
    return NextResponse.json({
      configured: false,
      message: "Fonte LiveScore indisponível no momento."
    });
  }

  const url = new URL(LIVE_SCORE_BASE_URL);
  url.searchParams.set("competition_id", competitionId);
  url.searchParams.set("key", process.env.LIVESCORE_API_KEY);
  url.searchParams.set("secret", process.env.LIVESCORE_API_SECRET);

  try {
    const { data } = await fetchJson(url, {
      next: { revalidate: 600 }
    }, { timeoutMs: 8000 });

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
      message: publicErrorMessage(error, "Não foi possível carregar o placar ao vivo agora.")
    });
  }
}
