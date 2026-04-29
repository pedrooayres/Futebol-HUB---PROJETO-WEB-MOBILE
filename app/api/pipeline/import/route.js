import { NextResponse } from "next/server";

import { buildImportPreview, getImportTemplate } from "@/lib/pipeline-import";

export async function GET() {
  return NextResponse.json({
    message: "Envie um JSON com teams, players e reports para visualizar a importacao normalizada.",
    method: "POST",
    template: getImportTemplate()
  });
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const preview = buildImportPreview(payload);

    return NextResponse.json({
      ok: true,
      mode: "preview",
      message: "Payload normalizado com sucesso. Proxima etapa: persistir em banco.",
      ...preview
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || "Falha ao processar a importacao."
      },
      { status: 400 }
    );
  }
}
