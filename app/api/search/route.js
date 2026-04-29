import { NextResponse } from "next/server";

import { buildGeneratedSearchEntries, buildSearchIndex, searchEntries } from "@/lib/report-utils";
import { back4appRequest, hasBack4AppConfig } from "@/lib/back4app";

async function getScoutingItems() {
  if (!hasBack4AppConfig()) {
    return [];
  }

  try {
    const data = await back4appRequest("?order=-updatedAt");
    return data.results || [];
  } catch (_error) {
    return [];
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = Number(searchParams.get("limit") || 8);
  const scoutingItems = await getScoutingItems();
  const index = buildSearchIndex(scoutingItems);
  const baseResults = searchEntries(index, query);
  const generatedResults = buildGeneratedSearchEntries(query, baseResults);
  const results = [...baseResults, ...generatedResults].slice(0, limit);

  return NextResponse.json({
    query,
    total: results.length,
    results
  });
}
