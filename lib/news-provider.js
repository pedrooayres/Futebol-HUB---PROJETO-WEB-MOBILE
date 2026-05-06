export function hasGNewsKey() {
  return Boolean(process.env.GNEWS_API_KEY);
}

export async function getGNewsArticles({ query, lang = "pt", country = "br", max = 6 }) {
  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    throw new Error("GNEWS_API_KEY nao configurada.");
  }

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", query);
  url.searchParams.set("lang", lang);
  url.searchParams.set("country", country);
  url.searchParams.set("max", String(max));
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, {
    next: { revalidate: 1800 }
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join?.(", ") || data.message || "Falha ao consultar o GNews.");
  }

  return (data.articles || []).map((item, index) => ({
    id: `${item.url || query}-${index}`,
    title: item.title || "Noticia",
    description: item.description || "",
    url: item.url || "",
    image: item.image || "",
    publishedAt: item.publishedAt || "",
    source: item.source?.name || ""
  }));
}
