import { NextResponse } from "next/server";

const STANDINGS_URL =
  "https://api-football-standings.azharimm.dev/leagues/eng.1/standings?season=2024&sort=asc";

export async function GET() {
  try {
    const response = await fetch(STANDINGS_URL, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error("Nao foi possivel carregar a tabela externa.");
    }

    const data = await response.json();
    const rows =
      data?.data?.standings?.slice(0, 6).map((item) => ({
        id: item.team.id,
        name: item.team.name,
        logo: item.team.logos?.[0]?.href || "",
        stats: item.stats
      })) || [];

    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json({ rows: [], message: error.message }, { status: 500 });
  }
}
