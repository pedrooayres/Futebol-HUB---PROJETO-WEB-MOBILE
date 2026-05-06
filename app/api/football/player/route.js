import { NextResponse } from "next/server";

import { getApiFootballPlayerSnapshot, hasApiFootballKey } from "@/lib/api-football";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const season = searchParams.get("season") || "2025";

  if (!name.trim()) {
    return NextResponse.json(
      {
        message: "Informe o nome do jogador para consultar a API-Football."
      },
      { status: 400 }
    );
  }

  if (!hasApiFootballKey()) {
    return NextResponse.json({
      configured: false,
      source: "fallback",
      message: "API_FOOTBALL_KEY nao configurada. Painel live indisponivel no momento."
    });
  }

  try {
    const snapshot = await getApiFootballPlayerSnapshot({ name, season });

    return NextResponse.json({
      configured: true,
      ...snapshot
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      source: "api-football",
      message: error.message
    });
  }
}
