import { NextResponse } from "next/server";

import { buildGeneratedSearchEntries, buildSearchIndex, SEARCH_TYPE_ORDER, searchEntries } from "@/lib/report-utils";

export const revalidate = 3600;

function countByType(results) {
  return ["Todos", ...SEARCH_TYPE_ORDER].reduce((counts, type) => {
    counts[type] = type === "Todos" ? results.length : results.filter((item) => item.type === type).length;
    return counts;
  }, {});
}

function groupByType(results) {
  return SEARCH_TYPE_ORDER.map((type) => ({
    type,
    results: results.filter((item) => item.type === type)
  })).filter((group) => group.results.length > 0);
}

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
    counts: countByType(results),
    groups: groupByType(results),
    results
  });
}
