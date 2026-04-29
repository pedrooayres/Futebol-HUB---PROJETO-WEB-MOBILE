import { NextResponse } from "next/server";

import { buildPipelineSummary } from "@/lib/external-football-pipeline";
import { getImportTemplate } from "@/lib/pipeline-import";

export async function GET() {
  return NextResponse.json({
    summary: buildPipelineSummary(),
    importContract: {
      endpoint: "/api/pipeline/import",
      method: "POST",
      acceptedFormats: ["application/json"],
      collections: ["teams", "players", "reports"]
    },
    template: getImportTemplate()
  });
}
