import { API_FOOTBALL_LEAGUES } from "@/lib/api-football";
import { featuredTeams } from "@/lib/football-data";

export function toMonitoringSlug(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCompetitionById(appId) {
  return API_FOOTBALL_LEAGUES.find((competition) => competition.appId === appId) || null;
}

export function getCompetitionHref(competition) {
  return `/ranking?league=${competition.appId}`;
}

export function getTeamHrefByName(name) {
  const slug = toMonitoringSlug(name);
  const knownTeam = featuredTeams.find((team) => team.slug === slug || toMonitoringSlug(team.name) === slug);

  return `/times/${knownTeam?.slug || slug}`;
}

function getCompetitionSource(competition) {
  if (competition.providerHint === "thesportsdb") {
    return "TheSportsDB";
  }

  if (competition.providerHint === "livescore-api") {
    return "LiveScore opcional";
  }

  if (competition.apiId) {
    return "API-Football";
  }

  return "Base local";
}

export function buildCompetitionSearchEntries() {
  return API_FOOTBALL_LEAGUES.map((competition) => ({
    id: `competition-${competition.appId}`,
    type: "Competicao",
    source: getCompetitionSource(competition),
    title: competition.label,
    subtitle: `${competition.country} | ${competition.type === "Cup" ? "Copa" : "Liga"} | ${competition.season}`,
    description: `Abrir tabela, jogos e leitura da competicao ${competition.label}.`,
    href: getCompetitionHref(competition)
  }));
}

export function buildCompetitionMonitorItem(competition) {
  return {
    id: competition.appId,
    type: "competition",
    title: competition.label,
    meta: competition.country,
    description: `${competition.type === "Cup" ? "Copa" : "Liga"} | temporada ${competition.season}`,
    href: getCompetitionHref(competition),
    source: getCompetitionSource(competition)
  };
}
