import { NextResponse } from "next/server";

import { buildPipelineSummary } from "@/lib/external-football-pipeline";

export async function GET() {
  return NextResponse.json(buildPipelineSummary());
}
