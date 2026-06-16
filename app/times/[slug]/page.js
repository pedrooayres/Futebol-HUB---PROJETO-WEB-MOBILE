import { notFound } from "next/navigation";

import TeamProfileClient from "@/components/TeamProfileClient";
import { featuredTeams, getTeamBySlug } from "@/lib/football-data";
import { getTheSportsDbTeamByName } from "@/lib/thesportsdb";

export function generateStaticParams() {
  return featuredTeams.map((team) => ({ slug: team.slug }));
}

export default async function TeamProfilePage({ params }) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  const theSportsDbMeta = await getTheSportsDbTeamByName(team.name).catch(() => null);

  return (
    <TeamProfileClient
      team={{
        ...team,
        logo: theSportsDbMeta?.badge || theSportsDbMeta?.logo || team.logo || "",
        externalMeta: {
          ...(team.externalMeta || {}),
          theSportsDb: theSportsDbMeta
        }
      }}
    />
  );
}
