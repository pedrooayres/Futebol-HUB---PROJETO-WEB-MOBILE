import { NextResponse } from "next/server";
import { back4appRequest, getClassName, hasBack4AppConfig } from "@/lib/back4app";

export async function GET() {
  if (!hasBack4AppConfig()) {
    return NextResponse.json(
      {
        items: [],
        configured: false,
        message: `Defina as credenciais do Back4App para usar a classe ${getClassName()}.`
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
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const created = await back4appRequest("", {
      method: "POST",
      body: JSON.stringify(body)
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
