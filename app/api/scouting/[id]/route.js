import { NextResponse } from "next/server";
import { back4appRequest } from "@/lib/back4app";

export async function PUT(request, { params }) {
  try {
    const payload = await request.json();
    const body = {
      playerName: payload.playerName,
      club: payload.club,
      position: payload.position,
      rating: Number(payload.rating),
      status: payload.status,
      notes: payload.notes
    };

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
