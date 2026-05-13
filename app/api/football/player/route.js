import { NextResponse } from "next/server";

import { getApiFootballPlayerSnapshot, hasApiFootballKey } from "@/lib/api-football";
import { publicErrorMessage } from "@/lib/api-errors";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const season = searchParams.get("season") || "2025";

  if (!name.trim()) {
    return NextResponse.json(
      {
        message: "Informe o nome do jogador para consultar dados ao vivo."
      },
      { status: 400 }
    );
  }

  if (!hasApiFootballKey()) {
    return NextResponse.json({
      configured: false,
      source: "fallback",
      message: "Painel ao vivo indisponível no momento."
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
      message: publicErrorMessage(error, "Não foi possível carregar dados ao vivo do jogador agora.")
    });
  }
}
