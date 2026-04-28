import { NextResponse } from "next/server";
import { back4appRequest } from "@/lib/back4app";
import { parseListField } from "@/lib/report-utils";

function buildBody(payload) {
  return {
    playerName: payload.playerName,
    club: payload.club,
    position: payload.position,
    rating: Number(payload.rating),
    status: payload.status,
    priority: payload.priority || "Media",
    reportSummary: payload.reportSummary || "",
    strengths: parseListField(payload.strengths),
    risks: parseListField(payload.risks),
    recommendation: payload.recommendation || "",
    nextAction: payload.nextAction || "",
    isFavorite: Boolean(payload.isFavorite),
    notes: payload.notes
  };
}

export async function PUT(request, { params }) {
  try {
    const payload = await request.json();
    const body = buildBody(payload);

    const updated = await back4appRequest(`/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(body)
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    await back4appRequest(`/${params.id}`, {
      method: "DELETE"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
