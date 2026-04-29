import { NextResponse } from "next/server";

const fallbackAdminCode = "futebolhubadmin";

export async function POST(request) {
  try {
    const payload = await request.json();
    const expectedCode = process.env.ADMIN_ACCESS_CODE || fallbackAdminCode;

    if (payload?.code !== expectedCode) {
      return NextResponse.json(
        {
          ok: false,
          message: "Codigo admin invalido."
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      role: "admin"
    });
  } catch (_error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Falha ao validar o acesso admin."
      },
      { status: 400 }
    );
  }
}
