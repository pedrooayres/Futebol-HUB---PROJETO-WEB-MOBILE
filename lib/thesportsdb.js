import { fetchJson } from "@/lib/http-client";

const THESPORTSDB_BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getBestTeamMatch(teams = [], teamName = "") {
  const normalizedName = normalizeText(teamName);

  return (
    teams.find((team) => normalizeText(team.strTeam) === normalizedName) ||
    teams.find((team) => normalizeText(team.strAlternate).split(" ").includes(normalizedName)) ||
    teams.find((team) => normalizeText(team.strTeam).includes(normalizedName)) ||
    teams[0] ||
    null
  );
}

export function normalizeTheSportsDbTeam(team) {
  if (!team) {
    return null;
  }

  return {
    id: team.idTeam || "",
    name: team.strTeam || "",
    alternateName: team.strAlternate || "",
    league: team.strLeague || "",
    country: team.strCountry || "",
    stadium: team.strStadium || "",
    stadiumLocation: team.strStadiumLocation || "",
    formedYear: team.intFormedYear || "",
    description: team.strDescriptionEN || "",
    website: team.strWebsite || "",
    badge: team.strBadge || "",
    logo: team.strLogo || "",
    jersey: team.strEquipment || "",
    banner: team.strBanner || "",
    source: "TheSportsDB"
  };
}

export async function getTheSportsDbTeamByName(teamName) {
  if (!teamName) {
    return null;
  }

  const url = new URL(`${THESPORTSDB_BASE_URL}/searchteams.php`);
  url.searchParams.set("t", teamName);

  const { response, data } = await fetchJson(
    url,
    { next: { revalidate: 86400 } },
    { timeoutMs: 8000 }
  );

  if (!response.ok) {
    throw new Error("Nao foi possivel consultar a TheSportsDB.");
  }

  const match = getBestTeamMatch(data?.teams || [], teamName);
  return normalizeTheSportsDbTeam(match);
}

export async function enrichTeamsWithTheSportsDb(teams = []) {
  const enrichedTeams = await Promise.all(
    teams.map(async (team) => {
      if (team.logo) {
        return team;
      }

      try {
        const meta = await getTheSportsDbTeamByName(team.name);

        if (!meta) {
          return team;
        }

        return {
          ...team,
          logo: meta.badge || meta.logo || team.logo || "",
          externalMeta: {
            ...(team.externalMeta || {}),
            theSportsDb: meta
          }
        };
      } catch (_error) {
        return team;
      }
    })
  );

  return enrichedTeams;
}
