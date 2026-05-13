import { NextResponse } from "next/server";
import { back4appRequest } from "@/lib/back4app";
import { jsonError } from "@/lib/api-errors";
import { buildScoutingBody } from "@/lib/scouting-validation";

export async function PUT(request, { params }) {
  try {
    const payload = await request.json();
    const body = buildScoutingBody(payload);

    const updated = await back4appRequest(`/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    });

    return NextResponse.json(updated);
  } catch (error) {
    return jsonError(error, "Não foi possível atualizar o relatório de scouting.");
  }
}

export async function DELETE(_request, { params }) {
  try {
    await back4appRequest(`/${params.id}`, {
      method: "DELETE"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error, "Não foi possível excluir o relatório de scouting.");
  }
}
