import { NextResponse } from "next/server";

import { getGNewsArticles, hasGNewsKey } from "@/lib/news-provider";
import { publicErrorMessage } from "@/lib/api-errors";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || "pt";
  const country = searchParams.get("country") || "br";
  const max = Number(searchParams.get("max") || 6);

  if (!query.trim()) {
    return NextResponse.json(
      {
        message: "Informe um termo de busca para carregar notícias."
      },
      { status: 400 }
    );
  }

  if (!hasGNewsKey()) {
    return NextResponse.json({
      configured: false,
      source: "fallback",
      message: "Radar de notícias externo indisponível no momento.",
      articles: []
    });
  }

  try {
    const articles = await getGNewsArticles({ query, lang, country, max });

    return NextResponse.json({
      configured: true,
      source: "gnews",
      query,
      articles
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      source: "gnews",
      query,
      message: publicErrorMessage(error, "Não foi possível carregar notícias agora."),
      articles: []
    });
  }
}
