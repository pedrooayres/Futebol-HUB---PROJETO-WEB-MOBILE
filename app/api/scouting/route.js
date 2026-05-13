import { NextResponse } from "next/server";
import { back4appRequest, getClassName, hasBack4AppConfig } from "@/lib/back4app";
import { jsonError, publicErrorMessage } from "@/lib/api-errors";
import { buildScoutingBody } from "@/lib/scouting-validation";

export async function GET() {
  if (!hasBack4AppConfig()) {
    return NextResponse.json(
      {
        items: [],
        configured: false,
        message: `Base de scouting offline. Configure a classe ${getClassName()} para salvar registros reais.`
      },
      { status: 200 }
    );
  }

  try {
    const data = await back4appRequest("?order=-updatedAt");

    return NextResponse.json({
      items: data.results || [],
      configured: true
    });
  } catch (error) {
    return NextResponse.json(
      {
        items: [],
        configured: true,
        message: publicErrorMessage(error, "Não foi possível carregar a base de scouting.")
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const body = buildScoutingBody(payload);

    const created = await back4appRequest("", {
      method: "POST",
      body: JSON.stringify(body)
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return jsonError(error, "Não foi possível salvar o relatório de scouting.");
  }
}
