import { notFound } from "next/navigation";

import TeamProfileClient from "@/components/TeamProfileClient";
import { featuredTeams, getTeamBySlug } from "@/lib/football-data";

export function generateStaticParams() {
  return featuredTeams.map((team) => ({ slug: team.slug }));
}

export default async function TeamProfilePage({ params }) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  return <TeamProfileClient team={team} />;
}
