import { notFound } from "next/navigation";

import PlayerProfileClient from "@/components/PlayerProfileClient";
import { getPlayerBySlug, getTeamBySlug, spotlightPlayers } from "@/lib/football-data";

export function generateStaticParams() {
  return spotlightPlayers.map((player) => ({ slug: player.slug }));
}

export default async function PlayerProfilePage({ params }) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const team = getTeamBySlug(player.teamSlug);

  return <PlayerProfileClient player={player} team={team} />;
}
