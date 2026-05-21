import { NextResponse } from "next/server";

import { buildGeneratedSearchEntries, buildSearchIndex, searchEntries } from "@/lib/report-utils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 8);
  const index = buildSearchIndex();
  const baseResults = searchEntries(index, query);
  const generatedResults = buildGeneratedSearchEntries(query, baseResults);
  const results = [...baseResults, ...generatedResults].slice(0, limit);

  return NextResponse.json({
    query,
    total: results.length,
    results
  });
}
